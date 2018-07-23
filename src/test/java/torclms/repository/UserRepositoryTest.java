package torclms.repository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import torclms.entity.UserRole;
import torclms.model.Course;
import torclms.model.Role;
import torclms.model.User;
import torclms.model.UserAssignment;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(SpringRunner.class)
@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    TestEntityManager entityManager;

    @Autowired
    UserRepository userRepository;

    private static String TEST_EMAIL = "example@example.com";

    private static String TEST_ADMIN_EMAIL = "admin@example.com";

    @Test
    public void whenSavingUser_withValidDetails_userSaves () {
        User user = generateTestUser(UserRole.TRAINEE, TEST_EMAIL);
        userRepository.save(user);

        List<User> users = userRepository.findAll();

        assertNotNull(users);
        assertEquals(3, users.size());
    }

    @Test
    public void whenFindingUserById_withValidId_userFound () {
        User user = generateTestUser(UserRole.TRAINEE, TEST_EMAIL);

        Course course = new Course();
        course.setTitle("Example Course Title");

        UserAssignment assignment = new UserAssignment(user, course, new Date());

        entityManager.persist(course);
        Long userId = (Long)entityManager.persistAndGetId(user);
        entityManager.persist(assignment);

        User foundUser = userRepository.getOne(userId);

        assertNotNull(foundUser);
        assertEquals(TEST_EMAIL, foundUser.getEmail());
    }

    @Test
    public void whenFindingUsersByRole_correctUsersReturned () {
        User traineeUser = generateTestUser(UserRole.TRAINEE, TEST_EMAIL);
        User adminUser = generateTestUser(UserRole.ADMIN, TEST_ADMIN_EMAIL);

        userRepository.save(traineeUser);
        userRepository.save(adminUser);

        List<User> adminUsers = userRepository.getUsersByRole(UserRole.ADMIN.name());

        assertEquals(2, adminUsers.size());
    }

    private static User generateTestUser(UserRole role, String email) {
        User  user = new User();
        user.setEmail(email);
        user.setFirstname("Tom");
        user.setSurname("Jones");
        user.setPassword("password123");
        Set<Role> roles = new HashSet<>();
        roles.add(new Role(role.name()));

        user.setRoles(roles);

        return user;
    }
}
