package torclms.service;

import org.springframework.beans.factory.annotation.Autowired;
import torclms.model.Stage;
import torclms.model.StageAttempt;
import torclms.model.UserAssignment;
import torclms.repository.StageAttemptRepository;

public class UserAssignmentServiceImpl implements UserAssignmentService {

    @Autowired
    private StageAttemptRepository stageAttemptRepository;

    @Override
    public StageAttempt attemptStage(UserAssignment assignment, Stage stage, boolean completed) {
        StageAttempt completion = new StageAttempt(assignment, stage, completed);
        return stageAttemptRepository.save(completion);
    }

}
