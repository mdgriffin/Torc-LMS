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
        List<Stage> stages = GenerateStages.getStageList(NUM_STAGES);

        assertEquals(NUM_STAGES, stages.size());
        Stage lastStage = stageService.getLastStage(stages);
        assertEquals(NUM_STAGES - 1, lastStage.getStepOrder());
    }

}
