package torclms.model;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name="question_attempt")
public class QuestionAttempt implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="question_attempt_id")
    private int questionAttemptId;

    private Date dateAttempted;

    @ManyToOne
    @JoinColumn(name="question_id", nullable=false)
    private Question question;

    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @ManyToOne
    @JoinColumn(name="option_id", nullable=false)
    private QuestionOption questionOption;
}
