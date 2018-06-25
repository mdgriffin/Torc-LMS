package torclms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import torclms.model.User;
import torclms.service.UserService;

@Controller
@RequestMapping("/manage")
public class ManagerController {

    @Autowired
    UserService userService;

    @GetMapping(value={"/", "/home"})
    public ModelAndView home () {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByEmail(auth.getName());
        modelAndView.addObject("userName", "Welcome " + user.getFirstname() + " " + user.getSurname() + " (" + user.getEmail() + ")");
        modelAndView.addObject("managerMessage","Content Available Only for Users with ManagerRole");
        modelAndView.setViewName("manage/home");
        return modelAndView;
    }


    @GetMapping("/assign-course")
    public String assignCourse () {
        return "manage/assign-course";
    }
}
