package torclms.service;

import torclms.model.Question;
import torclms.model.QuestionOption;

import java.util.List;

public interface QuestionService {
    Question findQuestionById (int questionId);

    List<Question> getQuestions ();

    Question saveQuestion (Question question);
}
