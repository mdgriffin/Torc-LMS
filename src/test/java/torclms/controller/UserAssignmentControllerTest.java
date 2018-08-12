package torclms.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import torclms.dto.StageAttemptDto;
import torclms.entity.AssignmentStatus;
import torclms.helper.GenerateAssignments;
import torclms.model.Course;
import torclms.model.User;
import torclms.model.UserAssignment;
import torclms.service.CourseService;
import torclms.service.UserAssignmentService;
import torclms.service.UserService;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.Is.is;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class UserAssignmentControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private UserService userService;

    @MockBean
    private UserAssignmentService userAssignmentService;

    private User testUser;

    private static final int NUM_ASSIGNMENTS = 10;

    @Before
    public void setup () {
        testUser = new User();
        testUser.setUserId(1L);
    }

    @Test
    @WithMockUser(username="test@example.com",roles={"ADMIN", "MANAGER", "TRAINEE"})
    public void whenGettingUserAssignments_assignmentsReturned () throws Exception {
        ArgumentCaptor<String> userEmailCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<Long> assignmentUserIdCaptor = ArgumentCaptor.forClass(Long.class);

        given(userService.findUserByEmail(userEmailCaptor.capture())).willReturn(testUser);
        given(userService.findAssignmentsByUserId(assignmentUserIdCaptor.capture())).willReturn(GenerateAssignments.getAssignmentList(NUM_ASSIGNMENTS, testUser));

        mvc.perform(get("/api/assignments/active-user").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(NUM_ASSIGNMENTS)))
            .andExpect(jsonPath("$[0].assignedCourse.title", is("Course 0")));

        verify(userService).findUserByEmail(userEmailCaptor.capture());
        verify(userService).findAssignmentsByUserId(assignmentUserIdCaptor.capture());
    }

    @Test
    @WithMockUser(username="test@example.com",roles={"ADMIN", "MANAGER", "TRAINEE"})
    public void whenCompletingStage_responseOk () throws Exception {
        ArgumentCaptor<String> userEmailCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<StageAttemptDto> stageAttemptCaptor = ArgumentCaptor.forClass(StageAttemptDto.class);
        ArgumentCaptor<User> userArgumentCaptor = ArgumentCaptor.forClass(User.class);

        UserAssignment assignment = GenerateAssignments.getAssignmentList(NUM_ASSIGNMENTS, testUser).get(0);
        StageAttemptDto attemptDto = new StageAttemptDto(1L, 1, true);

        given(userService.findUserByEmail(userEmailCaptor.capture())).willReturn(testUser);
        given(userAssignmentService.attemptStage(userArgumentCaptor.capture(), stageAttemptCaptor.capture())).willReturn(assignment);

        mvc.perform(post("/api/assignments/attempt-stage").contentType(MediaType.APPLICATION_JSON).content(asJsonString(attemptDto)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.assignedCourse.title", is(assignment.getAssignedCourse().getTitle())));

        verify(userService).findUserByEmail(userEmailCaptor.capture());
        verify(userAssignmentService).attemptStage(userArgumentCaptor.capture(), stageAttemptCaptor.capture());
    }

    public static String asJsonString(final Object obj) {
        try {
            final ObjectMapper mapper = new ObjectMapper();
            final String jsonContent = mapper.writeValueAsString(obj);
            System.out.println(jsonContent);
            return jsonContent;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
