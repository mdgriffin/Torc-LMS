package torclms.controller;

import org.omg.PortableInterceptor.SUCCESSFUL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import torclms.model.Course;
import torclms.model.Stage;
import torclms.model.User;
import torclms.model.UserAssignment;
import torclms.service.CourseService;
import torclms.service.StageService;
import torclms.service.UserService;

import javax.validation.Valid;

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
    public User assignStage (@RequestParam("stage_id") String stageIdStr) {
        int stageId = Integer.parseInt(stageIdStr);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Stage stage = stageService.getStageById(stageId);
        String userEmail = auth.getPrincipal().toString();
        User loggedInUser = userService.findUserByEmail(userEmail);

        return userService.assignStages(loggedInUser, stage);
    }
}
