package torclms.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import torclms.model.Course;
import torclms.model.Question;
import torclms.model.Stage;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

public class StageDto {

    private int stageId;

    private String title;

    public StageDto () {}

    public StageDto (int stageid, String title) {
        this.stageId = stageid;
        this.title = title;
    }

    public StageDto (Stage stage) {
        this.stageId = stage.getStageId();
        this.title = stage.getTitle();
    }

    public int getStageId() {
        return stageId;
    }

    public void setStageId(int stageId) {
        this.stageId = stageId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
