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
import torclms.helper.GenerateAssignments;
import torclms.model.*;
import torclms.repository.UserAssignmentRepository;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.Assert.assertEquals;
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

    @Before
    public void setup () {
        testUser = new User();
        testUser.setUserId(1L);
    }

    @Test
    public void whenAttemptingStage_withValidAssignment_attemptedAddedToAssignment () {
        List<UserAssignment> assignmentList = GenerateAssignments.getAssignmentList(NUM_ASSIGNMENTS, testUser);
        StageAttemptDto stageAttemptDto = new StageAttemptDto(1, 1, true);

        Course assignedCourse = new Course();
        Stage assignedCourseStage = new Stage();
        assignedCourseStage.setStageId(1);

        Set<Stage> assignedCourseStages = new HashSet<>();
        assignedCourseStages.add(assignedCourseStage);

        assignedCourse.setCourseId(1);
        assignedCourse.setStages(assignedCourseStages);

        assignmentList.get(0).setAssignedCourse(assignedCourse);

        ArgumentCaptor<Long> userIdCaptor  = ArgumentCaptor.forClass(Long.class);
        ArgumentCaptor<Integer> courseIdCaptor = ArgumentCaptor.forClass(Integer.class);
        ArgumentCaptor<UserAssignment> assignmentArgumentCaptor = ArgumentCaptor.forClass(UserAssignment.class);

        given(userService.findUserAssignmentsByCourseId(userIdCaptor.capture(), courseIdCaptor.capture())).willReturn(assignmentList);
        given(userAssignmentRepository.save(assignmentArgumentCaptor.capture())).willReturn(GenerateAssignments.getAssignment(testUser, assignedCourse));

        assertEquals(assignmentList.get(0).getStageAttempts().size(), 0);

        userAssignmentService.attemptStage(testUser, stageAttemptDto);

        verify(userService).findUserAssignmentsByCourseId(userIdCaptor.capture(), courseIdCaptor.capture());
        verify(userAssignmentRepository).save(assignmentArgumentCaptor.capture());

        UserAssignment savedAssignment = assignmentArgumentCaptor.getValue();

        assertEquals(savedAssignment.getStageAttempts().size(), 1);
    }

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
