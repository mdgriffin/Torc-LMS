package torclms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import torclms.model.Question;
import torclms.model.QuestionOption;
import torclms.service.QuestionOptionService;
import torclms.service.QuestionService;

import javax.validation.Valid;

@RestController
@RequestMapping("/api")
public class QuestionOptionController {

    @Autowired
    QuestionOptionService optionService;

    @Autowired
    QuestionService questionService;

    @PostMapping("/question-option")
    public QuestionOption saveOption (@RequestBody @Valid QuestionOption option) {
        Question question = questionService.findQuestionById(option.getQuestionId());
        option.setQuestion(question);

        return optionService.saveOption(option);
    }


}
