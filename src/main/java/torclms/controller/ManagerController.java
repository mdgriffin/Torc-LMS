package torclms.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/manage")
public class ManagerController {

    @GetMapping(value={"/", "/home"})
    public String home () {
        return "manage/home";
    }
}
