package torclms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import torclms.model.StageAttempt;

public interface StageAttemptRepository extends JpaRepository<StageAttempt, Integer> {
}
