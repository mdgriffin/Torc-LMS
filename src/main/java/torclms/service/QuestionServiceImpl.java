package torclms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import torclms.model.Question;
import torclms.repository.QuestionRepository;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionRepository questionRepo;

    public Question findQuestionById (int questionId) {
        return questionRepo.findByQuestionId((questionId));
    }

    public Question saveQuestion (Question question) {
        return questionRepo.save(question);
    }
}
