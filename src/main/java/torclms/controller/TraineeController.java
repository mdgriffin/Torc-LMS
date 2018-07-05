package torclms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import torclms.model.User;
import torclms.service.CourseService;
import torclms.service.UserService;

@Controller
@RequestMapping("/learn")
public class TraineeController {

    @Autowired
    private UserService userService;

    @GetMapping(value={"/", "/home"})
    public ModelAndView home () {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("learn/home");
        return modelAndView;
    }


    @GetMapping("/course/{courseid}")
    public ModelAndView viewCourse (@PathVariable(value = "courseid") Long courseId) {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("learn/course");
        return mv;
    }

}
