package torclms.service;

import torclms.model.Stage;

import java.util.Optional;

public interface StageService {
    Stage saveStage (Stage stage);
    Optional<Stage> getStageById (int stageId);
}
