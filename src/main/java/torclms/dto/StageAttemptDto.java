package torclms.dto;

public class StageAttemptDto {

    private int courseId;

    private int stageId;

    private boolean completed;

    public StageAttemptDto () {}

    public StageAttemptDto(int courseId, int stageId, boolean completed) {
        this.courseId = courseId;
        this.stageId = stageId;
        this.completed = completed;
    }

    public int getCourseId() {
        return courseId;
    }

    public void setCourseId(int courseId) {
        this.courseId = courseId;
    }

    public int getStageId() {
        return stageId;
    }

    public void setStageId(int stageId) {
        this.stageId = stageId;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}
