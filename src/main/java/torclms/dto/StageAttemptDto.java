package torclms.dto;

public class StageAttemptDto {

    private Long userAssignmentId;

    private int stageId;

    private boolean completed;

    public StageAttemptDto () {}

    public StageAttemptDto(Long userAssignmentId, int stageId, boolean completed) {
        this.userAssignmentId = userAssignmentId;
        this.stageId = stageId;
        this.completed = completed;
    }

    public Long getUserAssignmentId() {
        return userAssignmentId;
    }

    public void setUserAssignmentId(Long userAssignmentId) {
        this.userAssignmentId = userAssignmentId;
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
