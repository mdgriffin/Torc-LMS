package torclms.controller;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import torclms.service.CourseService;
import torclms.service.UserService;

import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.Is.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mvc;

    private static int NUM_USERS = 2;

    private static int NUM_TRAINEES = 1;

    @Test
    @WithMockUser(username="admin",roles={"ADMIN", "MANAGER", "TRAINEE"})
    public void whenGettingUsers_allUsersReturned () throws Exception {
        mvc.perform(get("/api/users").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(NUM_USERS)));
    }

    @Test
    @WithMockUser(username="admin",roles={"ADMIN", "MANAGER", "TRAINEE"})
    public void whenGettingUsers_withTraineeFlag_onlyTraineeReturned () throws Exception {
        mvc.perform(get("/api/users?trainees=1").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(NUM_TRAINEES)))
            .andExpect(jsonPath("$[0].firstname", is("John")));
    }
}
