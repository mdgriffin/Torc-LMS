package torclms.service;

import torclms.model.Stage;

public interface StageService {
    Stage saveStage (Stage stage);
    Stage getStageById (int stageId);
}
