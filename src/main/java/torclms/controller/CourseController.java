package torclms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    private CourseRepository courseRepo;

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

    @PutMapping("/courses/{courseId}")
    public Course updateCourse (@RequestBody @Valid Course course) {
        return courseService.updateCourse(course);
    }

    @DeleteMapping("/courses/{courseId}")
    public ResponseEntity deleteCourseById (@PathVariable(value = "courseId") int courseId) {
        Course course = courseService.findCourseById(courseId).orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));
        // move delete to course service
        courseRepo.delete(course);

        return ResponseEntity.ok().build();
    }

}
