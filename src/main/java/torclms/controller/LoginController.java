package torclms.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.ui.Model;

@RestController
@RequestMapping("/login")
public class LoginController {


    // Get All Users
    @GetMapping("/")
    public String getIndex (Model model) {

        model.addAttribute("title", "Please Login");
        return "login";
    }
}
