package torclms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import torclms.model.Stage;
import torclms.repository.StageRepository;

import java.util.Optional;

@Service
public class StageServiceImpl implements  StageService {

    @Autowired
    private StageRepository stageRepo;

    public Stage saveStage (Stage stage) {
        return stageRepo.save(stage);
    }

    public Stage getStageById (int stageId) {
        return stageRepo.findByStageId(stageId);
    }
}
