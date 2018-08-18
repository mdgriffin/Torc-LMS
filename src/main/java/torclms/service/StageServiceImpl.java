package torclms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import torclms.model.Stage;
import torclms.repository.StageRepository;

import java.util.*;

@Service
public class StageServiceImpl implements  StageService {

    @Autowired
    private StageRepository stageRepo;

    public Stage saveStage (Stage stage) {
        return stageRepo.save(stage);
    }

    public Optional<Stage> getStageById (int stageId) {
        return stageRepo.findById(stageId);
    }

    @Override
    public Stage getLastStage(Set<Stage> stages) {
        return stages
            .stream()
            .reduce((a, b) -> a.getStepOrder() > b.getStepOrder()? a : b)
            .get();
    }

    @Override
    public Stage getNextStage (Set<Stage> stages, Stage comparisonStage) {
        List<Stage> orderedStages = getStagesOrderedByStepOrder(stages);
        int stageIndex = orderedStages.indexOf(comparisonStage);

        if (stageIndex < orderedStages.size() - 1) {
            return orderedStages.get(stageIndex + 1);
        }

        return comparisonStage;
    }

    @Override
    public List<Stage> getStagesOrderedByStepOrder (Set<Stage> stages) {
        List<Stage> stagesAsList = new ArrayList<>(stages);

        Collections.sort(stagesAsList, (Stage lhs, Stage rhs) -> {
            return lhs.getStepOrder() > rhs.getStepOrder() ? 1 : (lhs.getStepOrder() < rhs.getStepOrder()) ? -1 : 0;
        });

        return stagesAsList;
    }
}
