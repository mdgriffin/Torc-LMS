package torclms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import torclms.model.QuestionOption;

public interface QuestionOptionRepository extends JpaRepository<QuestionOption, Integer> {
}
