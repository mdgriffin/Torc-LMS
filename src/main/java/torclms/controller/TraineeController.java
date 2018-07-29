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
import torclms.model.UserAssignment;
import torclms.service.CourseService;
import torclms.service.UserAssignmentService;
import torclms.service.UserService;

@Controller
@RequestMapping("/learn")
public class TraineeController {

    @GetMapping(value={"/", "/home"})
    public ModelAndView home () {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("learn/home");
        return modelAndView;
    }

    @GetMapping("/assignment/{assignmentId}")
    public ModelAndView getAssignment (@PathVariable(value = "assignmentId") Long assignmentId) {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("learn/assignment");
        return mv;
    }

}
