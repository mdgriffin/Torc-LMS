package torclms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import torclms.dto.UserCourseAssignment;
import torclms.entity.TestCompletionDeadline;
import torclms.exception.ResourceNotFoundException;
import torclms.model.Course;
import torclms.model.User;
import torclms.model.UserAssignment;
import torclms.repository.CourseRepository;
import torclms.repository.UserAssignmentRepository;
import torclms.service.CourseService;
import torclms.service.UserService;

import javax.validation.Valid;
import java.security.Principal;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserService userService;

    @Autowired
    private CourseRepository courseRepo;

    @Autowired
    private UserAssignmentRepository assignmentRepo;

    @GetMapping("/courses")
    public List<Course> getCourse () {
        return courseService.findAll();
    }

    @PostMapping("/courses")
    public Course saveCourse (@RequestBody @Valid Course course) {
        return courseService.saveCourse(course);
    }

    @GetMapping("/courses/{courseId}")
    public Course getCourseById (@PathVariable(value = "courseId") int courseId) {
        Course course = courseService.findCourseById(courseId).orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));
        return course;
    }

    // TODO: Change to /courses/assigned
    @PostMapping("/courses/assign")
    public User assignStage (@RequestBody UserCourseAssignment assignment) {
        Course course = courseService.findCourseById(assignment.getCourseId()).orElseThrow(() -> new ResourceNotFoundException("Course", "id", assignment.getCourseId()));
        User user = userService.findById(assignment.getUserId()).orElseThrow(() -> new ResourceNotFoundException("User", "id", assignment.getUserId()));

        return userService.assignCourse(user, course);
    }

    @GetMapping("/courses/assigned")
    public List<UserAssignment> getCoursesAssignedToActiveUser (@AuthenticationPrincipal final Principal authUser) {
        User user = userService.findUserByEmail(authUser.getName());
        //List<Course> assignedCourses = courseRepo.findAssignedCourses(user.getUserId(), new Date(), TestCompletionDeadline.getDate());

        List<UserAssignment> userAssignments = assignmentRepo.findUserAssignments(user.getUserId(), new Date(), TestCompletionDeadline.getDate());

        if (userAssignments.size() == 0) {
            throw new ResourceNotFoundException("User", "id", user.getUserId());
        }

        return userAssignments;
    };

    @GetMapping("/courses/assigned/{userId}")
    public List<Course> getCoursesAssignedToUser (@PathVariable(value = "userId") Long userId) {
        List<Course> assignedCourses = courseRepo.findAssignedCourses(userId, new Date(), TestCompletionDeadline.getDate());

        // TODO: Should only be accessible to the user who is assigned courses or users with role or admin

        if (assignedCourses.size() == 0) {
            throw new ResourceNotFoundException("User", "id", userId);
        }

        return assignedCourses;
    };
}
