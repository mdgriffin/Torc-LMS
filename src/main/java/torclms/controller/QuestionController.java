package torclms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import torclms.model.Question;
import torclms.service.QuestionService;

import javax.validation.Valid;

@RestController
@RequestMapping("/api")
public class QuestionController {

    @Autowired
    QuestionService questionService;

    @PostMapping("/questions")
    public Question createQuestion (@Valid @RequestBody Question question) {
        return questionService.saveQuestion(question);
    }
}
