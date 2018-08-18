package torclms.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import torclms.helper.GenerateStages;
import torclms.model.Stage;

import java.util.List;
import java.util.Set;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest
public class StageServiceTest {

    @Autowired
    private StageService stageService;

    private static final int NUM_STAGES = 20;

    @Test
    public void whenGettingLastStage_correctStageReturned () {
        Set<Stage> stages = GenerateStages.getStageList(NUM_STAGES);

        assertEquals(NUM_STAGES, stages.size());
        Stage lastStage = stageService.getLastStage(stages);
        assertEquals(NUM_STAGES - 1, lastStage.getStepOrder());
    }

    @Test
    public void whenGettingStagesAsList_stagesInCorrectOrder () {
        Set<Stage> stages = GenerateStages.getStageList(NUM_STAGES);

        assertEquals(NUM_STAGES, stages.size());
        List<Stage> stageList = stageService.getStagesOrderedByStepOrder(stages);
        assertEquals(NUM_STAGES, stageList.size());

        Stage firstStage = stageList.get(0);
        assertEquals(0, firstStage.getStepOrder());

        Stage lastStage = stageList.get(NUM_STAGES - 1);

        assertEquals(NUM_STAGES - 1, lastStage.getStepOrder());
    }

    @Test
    public void whenGettingNextStage_correctStageReturned () {
        Set<Stage> stages = GenerateStages.getStageList(NUM_STAGES);

        assertEquals(NUM_STAGES, stages.size());
        List<Stage> stagesAsList = stageService.getStagesOrderedByStepOrder(stages);
        assertEquals(NUM_STAGES, stagesAsList.size());

        Stage firstStage  = stagesAsList.get(0);
        assertEquals(0, firstStage.getStepOrder());

        Stage nextStage = stageService.getNextStage(stages, firstStage);
        assertEquals(1, nextStage.getStepOrder());
    }

    @Test
    public void whenGettingNextStage_whenStageIsLastStage_sameStageReturned () {
        Set<Stage> stages = GenerateStages.getStageList(NUM_STAGES);

        assertEquals(NUM_STAGES, stages.size());
        List<Stage> stagesAsList = stageService.getStagesOrderedByStepOrder(stages);
        assertEquals(NUM_STAGES, stagesAsList.size());

        Stage lastStage  = stagesAsList.get(NUM_STAGES - 1);
        assertEquals(NUM_STAGES - 1, lastStage.getStepOrder());

        Stage nextStage = stageService.getNextStage(stages, lastStage);
        assertEquals(lastStage.getStepOrder(), nextStage.getStepOrder());
    }

}
