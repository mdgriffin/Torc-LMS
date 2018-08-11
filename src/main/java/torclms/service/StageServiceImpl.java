package torclms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import torclms.model.Stage;
import torclms.repository.StageRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

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
    public Stage getLastStage(List<Stage> stages) {
        return stages
            .stream()
            .reduce((a, b) -> a.getStepOrder() > b.getStepOrder()? a : b)
            .get();
    }
}
