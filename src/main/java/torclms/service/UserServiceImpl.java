package torclms.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import torclms.entity.AssignmentStatus;
import torclms.entity.TestCompletionDeadline;
import torclms.entity.UserRole;
import torclms.model.*;
import torclms.repository.CourseRepository;
import torclms.repository.RoleRepository;
import torclms.repository.UserAssignmentRepository;
import torclms.repository.UserRepository;

@Service("UserService")
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    //@Autowired
    //private CourseRepository courseRepository;

    @Autowired
    private UserAssignmentRepository assignmentRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public void saveUser(User user, UserRole userRole) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setEnabled(true);
        Role role = roleRepository.findByRole(userRole.toString());
        user.setRoles(new HashSet<Role>(Arrays.asList(role)));
        userRepository.save(user);
    }

    @Override
    public Optional<User> findById (Long userId) {
        return userRepository.findById(userId);
    }

    @Override
    public User assignCourse(User user, Course course) {
        UserAssignment assignment = new UserAssignment(user, course, TestCompletionDeadline.getDate(), AssignmentStatus.INCOMPLETE);

        user.getAssignedCourses().add(assignment);

        return userRepository.save(user);
    }

    @Override
    public List<User> findUsersWithLockedAssignments() {
        return userRepository.getUsersWithLockedAssignments();
    }

    // TODO: Move to assignment service
    public List<UserAssignment> findAssignmentsByUserId (Long userId) {
        return assignmentRepository.findUserAssignments(userId, new Date(), TestCompletionDeadline.getDate());
    }

    // TODO: Move to assignment service
    @Override
    public List<UserAssignment> findUserAssignmentsByCourseId(Long userId, int courseId) {
        return assignmentRepository.findUserAssignmentsByCourseId(userId, courseId, new Date(), TestCompletionDeadline.getDate());
    }

}
