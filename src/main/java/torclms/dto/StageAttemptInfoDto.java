package torclms.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.Type;
import torclms.model.*;

import javax.persistence.*;
import java.util.Date;

public class StageAttemptInfoDto {

    private int stageAttemptId;

    private StageDto stage;

    private UserDto user;

    private CourseDto course;

    private Date dateAttempted;

    @JsonProperty(value="completed")
    private boolean completed;

    private int numQuestions;

    private int numCorrect;

    public StageAttemptInfoDto () {}

    public StageAttemptInfoDto(StageAttempt attempt) {
        this.stageAttemptId = attempt.getStageAttemptId();
        this.dateAttempted = attempt.getDateAttempted();
        this.completed = attempt.isCompleted();
        this.numQuestions = attempt.getNumQuestions();
        this.numCorrect = attempt.getNumCorrect();

        User mappedUser = attempt.getUserAssignment().getAssignedUser();
        Course mappedCourse = attempt.getUserAssignment().getAssignedCourse();
        Stage mappedStage = attempt.getStage();

        this.setCourse(new CourseDto((mappedCourse)));
        this.setUser(new UserDto(mappedUser));
        this.setStage(new StageDto(mappedStage));
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

    public StageDto getStage() {
        return stage;
    }

    public void setStage(StageDto stage) {
        this.stage = stage;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public CourseDto getCourse() {
        return course;
    }

    public void setCourse(CourseDto course) {
        this.course = course;
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

    public int getNumQuestions() {
        return numQuestions;
    }

    public void setNumQuestions(int numQuestions) {
        this.numQuestions = numQuestions;
    }

    public int getNumCorrect() {
        return numCorrect;
    }

    public void setNumCorrect(int numCorrect) {
        this.numCorrect = numCorrect;
    }

}
