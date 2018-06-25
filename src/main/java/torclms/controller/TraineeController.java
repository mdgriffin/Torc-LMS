package torclms.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/learn")
public class TraineeController {

    @GetMapping(value={"/", "/home"})
    public String home () {
        return "learn/home";
    }

}
