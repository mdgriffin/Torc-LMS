package torclms.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import torclms.model.Course;
import torclms.model.User;
import torclms.model.UserAssignment;
import torclms.repository.UserRepository;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UserServiceTest {

    @MockBean
    UserRepository userRepository;

    @Autowired
    UserService userService;

    private static final String COURSE_TITLE = "Intro to Java";

    private static final String FIRST_NAME = "John";

    private static final String SURNAME = "Smith";

    @Test
    public void whenAssigningCourses_courseAddedToUsersAssignedCourses () {
        Course course = new Course(COURSE_TITLE);
        User user = new User(FIRST_NAME, SURNAME);

        assertEquals(0, user.getAssignedCourses().size());

        ArgumentCaptor<User> userArgumentCaptor = ArgumentCaptor.forClass(User.class);
        given(userRepository.save(userArgumentCaptor.capture())).willReturn(user);

        userService.assignCourse(user, course);

        User resultingUser = (User)userArgumentCaptor.getValue();

        assertEquals(FIRST_NAME, resultingUser.getFirstname());
        assertEquals(1, resultingUser.getAssignedCourses().size());

        UserAssignment assignment = resultingUser.getAssignedCourses().iterator().next();
        assertEquals(COURSE_TITLE, assignment.getAssignedCourse().getTitle());
    }


}
