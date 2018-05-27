package torclms.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.ui.Model;

@Controller
public class LoginController {

    @RequestMapping("/login")
    public String login (Model model) {

        model.addAttribute("title", "Please Login");
        return "login";
    }
}
