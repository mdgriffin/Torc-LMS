package torclms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import torclms.model.Question;
import torclms.service.QuestionService;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class QuestionController {

    @Autowired
    QuestionService questionService;

    @GetMapping("/questions")
    public List<Question> getAllQuestionss () {
        return questionService.getQuestions();
    }

    @PostMapping("/questions")
    public Question createQuestion (@Valid @RequestBody Question question) {
        return questionService.saveQuestion(question);
    }
}
