package torclms.model;

import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.Date;

@Table(name="question_attempt")
public class QuestionAttempt implements Serializable {

    private int questionId;

    private int userId;

    private int questionAttemptId;

    private Date dateAttempted;

    @ManyToOne
    @JoinColumn(name="question_id", nullable=false)
    private Question question;

    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @ManyToOne
    @JoinColumn(name="question_option_id", nullable=false)
    private QuestionOption questionOption;
}
