package torclms.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Stage_Attempts")
public class StageAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stage_attempt_id")
    private int stageAttemptId;

    @ManyToOne(cascade=CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name="stage_id", nullable=false)
    private Stage stage;

    @Column(name = "date_attempted")
    private Date dateAttempted;

    @Column(name="completed", columnDefinition = "TINYINT DEFAULT 1", nullable = true)
    @Type(type = "org.hibernate.type.NumericBooleanType")
    @JsonProperty(value="completed")
    private boolean completed;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_assignment_id")
    @JsonBackReference
    private UserAssignment userAssignment;

    public StageAttempt () {}

    public StageAttempt(UserAssignment userAssignment, Stage stage, boolean completed) {
        setUserAssignment(userAssignment);
        setStage(stage);
        setCompleted(completed);
    }

    @PrePersist
    protected void onCreate() {
        dateAttempted = new Date();
    }

    public int getStageAttemptId() {
        return stageAttemptId;
    }

    public void setStageAttemptId(int stageAttemptId) {
        this.stageAttemptId = stageAttemptId;
    }

    public Stage getStage() {
        return stage;
    }

    public void setStage(Stage stage) {
        this.stage = stage;
    }

    public Date getDateAttempted() {
        return dateAttempted;
    }

    public void setDateAttempted(Date dateAttempted) {
        this.dateAttempted = dateAttempted;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public UserAssignment getUserAssignment() {
        return userAssignment;
    }

    public void setUserAssignment(UserAssignment userAssignment) {
        this.userAssignment = userAssignment;
    }
}
