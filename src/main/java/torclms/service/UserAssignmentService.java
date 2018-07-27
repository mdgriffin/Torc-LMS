package torclms.service;

import torclms.dto.StageAttemptDto;
import torclms.model.Stage;
import torclms.model.StageAttempt;
import torclms.model.User;
import torclms.model.UserAssignment;

public interface UserAssignmentService {

    UserAssignment attemptStage (User user, StageAttemptDto stageAttemptDto);

}
