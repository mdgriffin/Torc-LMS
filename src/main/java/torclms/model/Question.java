package torclms.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="Questions")
public class Question implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="question_id")
    private int questionId;

    @NotBlank
    private String question;

    @Column(name="question_audio")
    private String questionAudio;

    @NotBlank
    private String explanation;

    @Column(name="explanation_audio")
    private String explanationAudio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="stage_id", nullable=false)
    @JsonBackReference("stageQuestions")
    private Stage stage;

    @OneToMany(mappedBy = "question", fetch = FetchType.LAZY, cascade =  CascadeType.PERSIST)
    @JsonManagedReference("questionOptions")
    Set<QuestionOption> options = new HashSet<>();

    public int getQuestionId() {
        return questionId;
    }

    public void setQuestionId(int questionId) {
        this.questionId = questionId;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getExplanationAudio() {
        return explanationAudio;
    }

    public void setExplanationAudio(String explanationAudio) {
        this.explanationAudio = explanationAudio;
    }

    public Set<QuestionOption> getOptions() {
        return options;
    }

    public void setOptions(Set<QuestionOption> options) {
        this.options = options;
    }

    public String getQuestionAudio() {
        return questionAudio;
    }

    public void setQuestionAudio(String questionAudio) {
        this.questionAudio = questionAudio;
    }

    public Stage getStage() {
        return stage;
    }

    public void setStage(Stage stage) {
        this.stage = stage;
    }
}
