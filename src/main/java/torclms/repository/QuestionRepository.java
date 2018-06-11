package torclms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import torclms.model.Question;

public interface QuestionRepository  extends JpaRepository<Question, Integer> {
    Question findByQuestionId (int questionId);
}
