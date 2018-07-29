package torclms.service;

import torclms.dto.StageAttemptDto;
import torclms.model.Stage;
import torclms.model.StageAttempt;
import torclms.model.User;
import torclms.model.UserAssignment;

import java.util.Optional;

public interface UserAssignmentService {

    Optional<UserAssignment> getAssignmentById (Long assignmentId);

    UserAssignment attemptStage (User user, StageAttemptDto stageAttemptDto);

    int numAttemptsRemaining(UserAssignment assignment, int stageId);

}
