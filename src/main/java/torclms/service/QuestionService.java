package torclms.service;

import torclms.model.Question;

import java.util.List;

public interface QuestionService {
    Question findQuestionById (int questionId);

    List<Question> getQuestions ();

    Question saveQuestion (Question question);
}
