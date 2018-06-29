package torclms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import torclms.dto.UserCourseAssignment;
import torclms.exception.ResourceNotFoundException;
import torclms.model.Course;
import torclms.model.User;
import torclms.service.CourseService;
import torclms.service.UserService;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserService userService;

    @GetMapping("/courses")
    public List<Course> getCourse () {
        return courseService.findAll();
    }

    @PostMapping("/courses")
    public Course saveCourse (@RequestBody @Valid Course course) {
        return courseService.saveCourse(course);
    }

    @PostMapping("/courses/assign")
    public User assignStage (@RequestBody UserCourseAssignment assignment) {
        Course course = courseService.findCourseById(assignment.getCourseId()).orElseThrow(() -> new ResourceNotFoundException("Course", "id", assignment.getCourseId()));
        User user = userService.findById(assignment.getUserId()).orElseThrow(() -> new ResourceNotFoundException("User", "id", assignment.getUserId()));

        return userService.assignCourse(user, course);
    }
}
