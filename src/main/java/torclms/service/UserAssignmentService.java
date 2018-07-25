package torclms.service;

import torclms.model.Stage;
import torclms.model.StageAttempt;
import torclms.model.UserAssignment;

public interface UserAssignmentService {

    StageAttempt attemptStage (UserAssignment assignment, Stage stage, boolean completed);

}
