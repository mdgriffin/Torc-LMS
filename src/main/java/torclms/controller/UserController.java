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

    // Get All Users
    @GetMapping("/users")
    public List<User> getAllUser(@RequestParam(value = "trainees", required = false, defaultValue = "false") boolean trainee) {
        if (trainee) {
            return userRepository.getUsersByRole(UserRole.TRAINEE.name());
        } else {
            return userRepository.findAll();
        }
    }

    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable(value = "id") Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }

    @GetMapping("/users/locked-assignments")
    public List<User> getUsersWithLockedAssignments () {
        return userService.findUsersWithLockedAssignments();
    }

}