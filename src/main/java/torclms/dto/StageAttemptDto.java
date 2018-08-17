package torclms.dto;

public class StageAttemptDto {

    private Long userAssignmentId;

    private int stageId;

    private boolean completed;

    private int numQuestions;

    private int numCorrect;

    public StageAttemptDto () {}

    public StageAttemptDto(Long userAssignmentId, int stageId, boolean completed) {
        this.userAssignmentId = userAssignmentId;
        this.stageId = stageId;
        this.completed = completed;
    }

    public StageAttemptDto(Long userAssignmentId, int stageId, boolean completed, int numQuestions, int numCorrect) {
        this(userAssignmentId, stageId, completed);
        this.numQuestions = numQuestions;
        this.numCorrect = numCorrect;
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
