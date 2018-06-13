package torclms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import torclms.model.Course;
import torclms.model.Stage;
import torclms.service.CourseService;
import torclms.service.StageService;

import javax.validation.Valid;

@RestController
@RequestMapping("/api")
public class StageController {

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
}
