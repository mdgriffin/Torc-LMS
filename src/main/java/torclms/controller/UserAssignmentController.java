package torclms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import torclms.dto.StageAttemptDto;
import torclms.dto.UserCourseAssignment;
import torclms.exception.ResourceNotFoundException;
import torclms.model.Course;
import torclms.model.StageAttempt;
import torclms.model.User;
import torclms.model.UserAssignment;
import torclms.service.CourseService;
import torclms.service.UserAssignmentService;
import torclms.service.UserAssignmentServiceImpl;
import torclms.service.UserService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserAssignmentController {

    @Autowired
    private UserService userService;

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserAssignmentService userAssignmentService;

    @PostMapping("/assignments/active-user")
    public User assignStage (@RequestBody UserCourseAssignment assignment) {
        Course course = courseService.findCourseById(assignment.getCourseId()).orElseThrow(() -> new ResourceNotFoundException("Course", "id", assignment.getCourseId()));
        User user = userService.findById(assignment.getUserId()).orElseThrow(() -> new ResourceNotFoundException("User", "id", assignment.getUserId()));

        return userService.assignCourse(user, course);
    }

    @GetMapping("/assignments/active-user")
    public List<UserAssignment> getCoursesAssignedToActiveUser (@AuthenticationPrincipal final Principal authUser) {
        User user = userService.findUserByEmail(authUser.getName());
        List<UserAssignment> userAssignments = userService.findAssignmentsByUserId(user.getUserId());

        if (userAssignments.size() == 0) {
            throw new ResourceNotFoundException("User", "id", user.getUserId());
        }

        return userAssignments;
    };

    @PostMapping("/assignments/attempt-stage")
    public UserAssignment postAttemptStage (@RequestBody StageAttemptDto stageAttemptDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByEmail(auth.getName());
        return userAssignmentService.attemptStage(user, stageAttemptDto);
    }

    /*
    // Get all assignments for user with id
    //@GetMapping("/assignments/users/{userId}

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
