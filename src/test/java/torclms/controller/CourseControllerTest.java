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
import torclms.model.Course;
import torclms.repository.CourseRepository;
import torclms.repository.UserAssignmentRepository;
import torclms.service.CourseService;
import torclms.service.UserService;

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.Is.is;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class CourseControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private CourseService courseService;

    @MockBean
    private UserService userService;

    @MockBean
    private CourseRepository courseRepo;

    @MockBean
    private UserAssignmentRepository assignmentRepo;

    private static int NUM_COURSES = 10;

    @Test
    public void whenGettingAllCourses_withAnonymousUser_redirected () throws Exception {
        mvc.perform(get("/api/courses").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().is3xxRedirection());
    }

    @Test
    @WithMockUser(username="admin",roles={"ADMIN", "MANAGER", "TRAINEE"})
    public void whenGettingAllCourse_courseListReturned() throws Exception {
        given(courseService.findAll()).willReturn(generateCourses(NUM_COURSES));

        mvc.perform(get("/api/courses").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(NUM_COURSES)))
            .andExpect(jsonPath("$[0].title", is("Course 0")));
    }

    private static List<Course> generateCourses (int numCourses) {
        List<Course> courseList = new ArrayList<>();

        for (int i = 0; i < numCourses; i++) {
            Course course = new Course();
            course.setTitle("Course " + i);
            courseList.add(course);
        }

        return courseList;


    }

}
