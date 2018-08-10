package torclms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import torclms.entity.UserRole;
import torclms.exception.ResourceNotFoundException;
import torclms.model.User;
import torclms.service.UserService;

import javax.validation.Valid;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    UserService userService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

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
        model.addAttribute("actionUrl", "admin/users/new");
        model.addAttribute("httpMethod", "POST");

        return "admin/user-form";
    }

    @PostMapping("/users/new")
    public ModelAndView createNewUser(@Valid User user, BindingResult bindingResult, @RequestParam("user_role") String roleName) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("roles",UserRole.values());
        modelAndView.addObject("actionUrl", "admin/users/new" );
        modelAndView.addObject("httpMethod", "POST");
        modelAndView.setViewName("admin/user-form");

        User userExists = userService.findUserByEmail(user.getEmail());

        if (userExists != null) {
            bindingResult.rejectValue("email", "error.user","There is already a user registered with the email provided");
        }

        if (bindingResult.hasErrors() || !UserRole.contains(roleName)) {
            modelAndView.addObject("user", user);
        } else {
            UserRole userRole = UserRole.valueOf(roleName);
            userService.createUser(user, userRole);
            modelAndView.addObject("successMessage", "User has been registered successfully");
            modelAndView.addObject("user", new User());
        }

        return modelAndView;
    }

    @GetMapping("/users/{userId}")
    public String viewUser(@PathVariable Long userId, Model model) {
        User user = userService.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

        model.addAttribute("user", user);
        model.addAttribute("roles", UserRole.values());
        model.addAttribute("actionUrl", "admin/users/" + userId);
        model.addAttribute("httpMethod", "PUT");

        return "admin/user-form";
    }

    @PutMapping("/users/{userId}")
    public ModelAndView updateUser(@Valid User user, BindingResult bindingResult, @PathVariable Long userId) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("roles",UserRole.values());
        modelAndView.addObject("actionUrl", "admin/users/" + userId);
        modelAndView.addObject("httpMethod", "PUT");
        modelAndView.setViewName("admin/user-form");

        User dbUser = userService.findById(user.getUserId()).orElseThrow(() -> new ResourceNotFoundException("User", "userId", user.getUserId()));

        if (dbUser == null) {
            bindingResult.rejectValue("email", "error.user","This user does not exist or is no longer registered");
        }

        if (bindingResult.hasErrors()) {
            modelAndView.addObject("user", user);
        } else {
            if (user.getPassword().length() > 0 && dbUser.getPassword() != user.getPassword()) {
                user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            }

            User updatedUser = userService.saveUser(user);
            modelAndView.addObject("successMessage", "User has been updated successfully");
            modelAndView.addObject("user", updatedUser);
        }

        return modelAndView;
    }

}
