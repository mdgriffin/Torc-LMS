package torclms.service;

import torclms.dto.StageAttemptDto;
import torclms.entity.AssignmentStatus;
import torclms.model.Stage;
import torclms.model.StageAttempt;
import torclms.model.User;
import torclms.model.UserAssignment;

import java.util.List;
import java.util.Optional;

public interface UserAssignmentService {

    Optional<UserAssignment> getAssignmentById (Long assignmentId);

    UserAssignment attemptStage (User user, StageAttemptDto stageAttemptDto);

    int numAttemptsRemaining(UserAssignment assignment, int stageId);

    List<UserAssignment> getAssignmentsByStatus (AssignmentStatus assignmentStatus);

    UserAssignment unlockAssignment (Long assignmentId);

    int changeStatusOfExpiredAssignments ();

}
