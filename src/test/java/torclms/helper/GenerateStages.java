package torclms.helper;

import torclms.model.Stage;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class GenerateStages {

    public static List<Stage> getStageList(int numStages) {
        List<Stage> stages = new ArrayList<>();

        for (int i = 0; i < numStages; i++) {
            Stage stage = new Stage();
            stage.setStepOrder(i);
            stages.add(stage);
        }

        return stages;
    };

}
