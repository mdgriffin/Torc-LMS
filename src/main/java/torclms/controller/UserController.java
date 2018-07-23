package torclms.controller;

import org.springframework.data.repository.query.Param;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import torclms.dto.UserCourseAssignment;
import torclms.entity.TestCompletionDeadline;
import torclms.entity.UserRole;
import torclms.exception.ResourceNotFoundException;
import torclms.model.Course;
import torclms.model.User;
import torclms.model.UserAssignment;
import torclms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import torclms.service.CourseService;
import torclms.service.UserService;

import javax.validation.Valid;
import java.security.Principal;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CourseService courseService;

    // Get All Users
    @GetMapping("/users")
    public List<User> getAllUser(@RequestParam(value = "trainees", required = false, defaultValue = "false") boolean trainee) {
        if (trainee) {
            return userRepository.getUsersByRole(UserRole.TRAINEE.name());
        } else {
            return userRepository.findAll();
        }
    }

    // Create a new User
    @PostMapping("/users")
    public User createUser(@Valid @RequestBody User user) {
        return userRepository.save(user);
    }

    // Get a Single User
    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable(value = "id") Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }

    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable(value = "id") Long userId,
                           @Valid @RequestBody User userDetails) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setFirstname(userDetails.getFirstname());
        user.setSurname(userDetails.getSurname());

        User updatedUser = userRepository.save(user);
        return updatedUser;
    }

    // Delete a User
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable(value = "id") Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        userRepository.delete(user);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/assigned")
    public User assignStage (@RequestBody UserCourseAssignment assignment) {
        Course course = courseService.findCourseById(assignment.getCourseId()).orElseThrow(() -> new ResourceNotFoundException("Course", "id", assignment.getCourseId()));
        User user = userService.findById(assignment.getUserId()).orElseThrow(() -> new ResourceNotFoundException("User", "id", assignment.getUserId()));

        return userService.assignCourse(user, course);
    }

    @GetMapping("/users/assigned")
    public List<UserAssignment> getCoursesAssignedToActiveUser (@AuthenticationPrincipal final Principal authUser) {
        User user = userService.findUserByEmail(authUser.getName());
        List<UserAssignment> userAssignments = userService.findAssignmentsByUserId(user.getUserId());

        if (userAssignments.size() == 0) {
            throw new ResourceNotFoundException("User", "id", user.getUserId());
        }

        return userAssignments;
    };

    /*
    @GetMapping("/users/{userId}/assigned/")
    public List<Course> getCoursesAssignedToUser (@PathVariable(value = "userId") Long userId) {
        //List<Course> assignedCourses = courseRepo.findAssignedCourses(userId, new Date(), TestCompletionDeadline.getDate());

        // TODO: Should only be accessible to the user who is assigned courses or users with role or admin
        List<Course> assignedCourses = courseService.getAssignedCourses(userId);

        if (assignedCourses.size() == 0) {
            throw new ResourceNotFoundException("User", "id", userId);
        }

        return assignedCourses;
    };
    */
}