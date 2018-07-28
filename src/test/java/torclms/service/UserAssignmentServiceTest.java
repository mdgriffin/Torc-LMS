package torclms.service;

import com.sun.org.apache.xpath.internal.Arg;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Spy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import torclms.dto.StageAttemptDto;
import torclms.entity.AssignmentStatus;
import torclms.exception.ResourceNotFoundException;
import torclms.helper.GenerateAssignments;
import torclms.model.*;
import torclms.repository.UserAssignmentRepository;

import java.util.*;

import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.notNull;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UserAssignmentServiceTest {

    @MockBean
    private UserAssignmentRepository userAssignmentRepository;

    @MockBean
    private UserService userService;

    @Autowired
    private UserAssignmentService userAssignmentService;

    private User testUser;

    private static final int NUM_ASSIGNMENTS = 1;

    private Course assignedCourse;

    private Stage assignedCourseStage;

    private ArgumentCaptor<Long> userIdCaptor;
    private ArgumentCaptor<Integer> courseIdCaptor;
    private ArgumentCaptor<UserAssignment> assignmentArgumentCaptor;

    @Before
    public void setup () {
        testUser = new User();
        testUser.setUserId(1L);

        this.assignedCourse = new Course();
        assignedCourseStage = new Stage();
        assignedCourseStage.setStepOrder(0);
        assignedCourseStage.setStageId(1);

        Set<Stage> assignedCourseStages = new HashSet<>();
        assignedCourseStages.add(assignedCourseStage);

        assignedCourse.setCourseId(1);
        assignedCourse.setStages(assignedCourseStages);

        userIdCaptor  = ArgumentCaptor.forClass(Long.class);
        courseIdCaptor = ArgumentCaptor.forClass(Integer.class);
        assignmentArgumentCaptor = ArgumentCaptor.forClass(UserAssignment.class);
    }

    @Test
    public void whenAttemptingStage_withValidAssignment_attemptedAddedToAssignment () {
        List<UserAssignment> assignmentList = GenerateAssignments.getAssignmentList(NUM_ASSIGNMENTS, testUser);
        StageAttemptDto stageAttemptDto = new StageAttemptDto(1, 1, true);
        assignmentList.get(0).setAssignedCourse(assignedCourse);

        given(userService.findUserAssignmentsByCourseId(userIdCaptor.capture(), courseIdCaptor.capture())).willReturn(assignmentList);
        given(userAssignmentRepository.save(assignmentArgumentCaptor.capture())).willReturn(GenerateAssignments.getAssignment(testUser, assignedCourse));

        assertEquals(assignmentList.get(0).getStageAttempts().size(), 0);
        assertTrue(assignmentList.get(0).getStatus().equals(AssignmentStatus.INCOMPLETE));

        userAssignmentService.attemptStage(testUser, stageAttemptDto);

        verify(userService).findUserAssignmentsByCourseId(userIdCaptor.capture(), courseIdCaptor.capture());
        verify(userAssignmentRepository).save(assignmentArgumentCaptor.capture());

        UserAssignment savedAssignment = assignmentArgumentCaptor.getValue();

        assertEquals(savedAssignment.getStageAttempts().size(), 1);
        assertTrue(savedAssignment.getStatus().equals(AssignmentStatus.COMPLETED));
    }

    @Test
    public void whenAttemptingStage_withValidAssignmentAndOneAttemptRemaining_courseLocked () {
        List<UserAssignment> assignmentList = GenerateAssignments.getAssignmentList(NUM_ASSIGNMENTS, testUser);
        StageAttemptDto stageAttemptDto = new StageAttemptDto(1, 1, false);
        assignmentList.get(0).setAssignedCourse(assignedCourse);
        StageAttempt failedAttempt = new StageAttempt(assignmentList.get(0), assignedCourseStage, false);
        failedAttempt.setDateAttempted(new Date());
        assignmentList.get(0).getStageAttempts().add(failedAttempt);
        assignmentList.get(0).setLastUpdated(new Date());

        given(userService.findUserAssignmentsByCourseId(userIdCaptor.capture(), courseIdCaptor.capture())).willReturn(assignmentList);
        given(userAssignmentRepository.save(assignmentArgumentCaptor.capture())).willReturn(GenerateAssignments.getAssignment(testUser, assignedCourse));

        assertEquals(1, assignmentList.get(0).getStageAttempts().size());
        assertTrue(assignmentList.get(0).getStatus().equals(AssignmentStatus.INCOMPLETE));

        userAssignmentService.attemptStage(testUser, stageAttemptDto);

        verify(userService).findUserAssignmentsByCourseId(userIdCaptor.capture(), courseIdCaptor.capture());
        verify(userAssignmentRepository).save(assignmentArgumentCaptor.capture());

        UserAssignment savedAssignment = assignmentArgumentCaptor.getValue();

        assertEquals(2, savedAssignment.getStageAttempts().size());
        assertTrue(savedAssignment.getStatus().equals(AssignmentStatus.LOCKED));
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenAttemptingStage_noAssignmentFound_exceptionThrown () {
        StageAttemptDto stageAttemptDto = new StageAttemptDto(1, 1, true);
        List<UserAssignment> emptyUserAssignments = new ArrayList<>();

        given(userService.findUserAssignmentsByCourseId(any(Long.class), any(Integer.class))).willReturn(emptyUserAssignments);

        userAssignmentService.attemptStage(testUser, stageAttemptDto);
    }

    // TODO: Test that an assignment is changed to locked

    @Test
    public void whenGettingNumAttemptsRemaining_withCorrectAttempts_correctAttemptsReturned () {
        UserAssignment assignment = new UserAssignment();
        assignment.setLastUpdated(new Date(2018, 5, 1));
        Set<StageAttempt> stageAttempts = new HashSet<>();
        stageAttempts.addAll(generateAttempts(10, assignment, generateStage(1), true, new Date(2018, 5, 1)));
        assignment.setStageAttempts(stageAttempts);

        int numAttemptsRemaining = userAssignmentService.numAttemptsRemaining(assignment, 1);

        assertEquals(2, numAttemptsRemaining);
    }

    @Test
    public void whenGettingNumAttemptsRemaining_withMixedAttempts_correctAttemptsReturned () {
        UserAssignment assignment = new UserAssignment();
        assignment.setLastUpdated(new Date(2018, 5, 1));
        Set<StageAttempt> stageAttempts = new HashSet<>();
        stageAttempts.addAll(generateAttempts(10, assignment, generateStage(1), true, new Date(2018, 5, 1)));
        stageAttempts.addAll(generateAttempts(10, assignment, generateStage(1), false, new Date(2018, 5, 1)));

        assignment.setStageAttempts(stageAttempts);

        assertEquals(20, assignment.getStageAttempts().size());

        int numAttemptsRemaining = userAssignmentService.numAttemptsRemaining(assignment, 1);

        assertEquals(0, numAttemptsRemaining);
    }

    private static Set<StageAttempt> generateAttempts (int numAttempts, UserAssignment assignment, Stage stage, boolean completed, Date dateAttempted) {
        Set<StageAttempt> attempts = new HashSet<>();

        for (int i = 0; i < numAttempts; i++) {
            StageAttempt attempt = new StageAttempt(assignment, stage, completed);
            attempt.setDateAttempted(dateAttempted);
            attempts.add(attempt);
        }

        return attempts;
    }

    private static Stage generateStage (int stageId) {
        Stage stage = new Stage();
        stage.setStageId(stageId);
        return stage;
    }

}
