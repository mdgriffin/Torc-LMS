package torclms.service;

import torclms.entity.UserRole;
import torclms.model.Course;
import torclms.model.Stage;
import torclms.model.User;
import torclms.model.UserAssignment;

import java.util.List;
import java.util.Optional;

public interface UserService {

    User findUserByEmail(String email);

    User createUser (User user, UserRole userRole);

    User saveUser(User user);

    Optional<User> findById (Long userId);

    User assignCourse(User user, Course course);

    List<User> findUsersWithLockedAssignments ();

    List<User> findUsersWithRecentAssignments ();

    List<UserAssignment> findAssignmentsByUserId (Long userId);

    List<UserAssignment> findUserAssignmentsByCourseId (Long userId, int courseId);

}