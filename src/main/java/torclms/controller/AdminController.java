package torclms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import torclms.entity.UserRole;
import torclms.model.User;
import torclms.service.UserService;

import javax.validation.Valid;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    UserService userService;

    @GetMapping(value={"/", "/home"})
    public ModelAndView home(){
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByEmail(auth.getName());
        modelAndView.addObject("userName", "Welcome " + user.getFirstname() + " " + user.getSurname() + " (" + user.getEmail() + ")");
        modelAndView.addObject("adminMessage","Content Available Only for Users with Admin Role");
        modelAndView.setViewName("admin/home");
        return modelAndView;
    }

    @GetMapping("/courses")
    public String showCourses () {
        // TODO: Create admin index view of courses
        return "admin/courses";
    }

    @GetMapping("/courses/new")
    public String createCourse () {
        return "admin/create-course";
    }

    @GetMapping("/users")
    public String getUsers(Model model){
        return "admin/users";
    }

    @GetMapping("/users/new")
    public String registration(Model model){
        model.addAttribute("user", new User());
        model.addAttribute("roles", UserRole.values());

        return "registration";
    }

    @PostMapping("/users/new")
    public ModelAndView createNewUser(@Valid User user, BindingResult bindingResult, @RequestParam("user_role") String roleName) {
        ModelAndView modelAndView = new ModelAndView();
        // TODO: Selected role should be returned
        modelAndView.addObject("roles",UserRole.values());
        User userExists = userService.findUserByEmail(user.getEmail());

        if (userExists != null) {
            bindingResult.rejectValue("email", "error.user","There is already a user registered with the email provided");
        }

        if (bindingResult.hasErrors() || !UserRole.contains(roleName)) {
            modelAndView.setViewName("registration");
        } else {
            UserRole userRole = UserRole.valueOf(roleName);
            userService.saveUser(user, userRole);
            modelAndView.addObject("successMessage", "User has been registered successfully");
            modelAndView.addObject("user", new User());
            modelAndView.setViewName("registration");
        }

        return modelAndView;
    }

}
