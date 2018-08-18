package torclms.service;

import torclms.model.Stage;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface StageService {

    Stage saveStage (Stage stage);

    Optional<Stage> getStageById (int stageId);

    Stage getLastStage (Set<Stage> stages);

    Stage getNextStage (Set<Stage> stages, Stage comparisonStage);

    List<Stage> getStagesOrderedByStepOrder (Set<Stage> stages);
}
