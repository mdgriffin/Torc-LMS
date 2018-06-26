package torclms.controller;

import org.omg.PortableInterceptor.SUCCESSFUL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import torclms.dto.UserStageAssignment;
import torclms.exception.ResourceNotFoundException;
import torclms.model.Course;
import torclms.model.Stage;
import torclms.model.User;
import torclms.model.UserAssignment;
import torclms.service.CourseService;
import torclms.service.StageService;
import torclms.service.UserService;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class StageController {

    @Autowired
    private UserService userService;

    @Autowired
    private StageService stageService;

    @Autowired
    CourseService courseService;

    @PostMapping("/stages")
    public Stage saveStage (@RequestBody @Valid Stage stage) {
        // TODO: Course ID not getting set
        //stage.getCourseId()
        Course course = courseService.findCourseById(1);
        stage.setCourse(course);

        return stageService.saveStage(stage);
    }

    @PostMapping("/stages/assign")
    public User assignStage (@RequestBody  UserStageAssignment assignment) {
        Stage stage = stageService.getStageById(assignment.getStageId()).orElseThrow(() -> new ResourceNotFoundException("Stage", "id", assignment.getStageId()));
        User user = userService.findById(assignment.getUserId()).orElseThrow(() -> new ResourceNotFoundException("User", "id", assignment.getUserId()));

        return userService.assignStages(user, stage);
    }
}
