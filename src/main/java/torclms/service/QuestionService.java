package torclms.service;

import torclms.model.Question;

public interface QuestionService {
    Question findQuestionById (int questionId);

    Question saveQuestion (Question question);
}
