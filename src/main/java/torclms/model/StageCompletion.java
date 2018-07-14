package torclms.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Stage_Completion")
public class StageCompletion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stage_completion_id")
    private int stageCompletionId;

    @ManyToOne(cascade=CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name="stage_id", nullable=false)
    private Stage stage;

    @ManyToOne(cascade=CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @Column(name = "date_attempted")
    private Date dateAttempted;

    @Column(name="completed", columnDefinition = "TINYINT DEFAULT 1", nullable = true)
    @Type(type = "org.hibernate.type.NumericBooleanType")
    private boolean completed;

    public StageCompletion(Stage stage, User user, boolean completed) {
        this.stage = stage;
        this.user = user;
        this.completed = completed;
    }

    @PrePersist
    protected void onCreate() {
        dateAttempted = new Date();
    }

    public int getStageCompletionId() {
        return stageCompletionId;
    }

    public void setStageCompletionId(int stageCompletionId) {
        this.stageCompletionId = stageCompletionId;
    }

    public Stage getStage() {
        return stage;
    }

    public void setStage(Stage stage) {
        this.stage = stage;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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
}
