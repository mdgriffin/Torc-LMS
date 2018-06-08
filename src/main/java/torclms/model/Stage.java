package torclms.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.io.Serializable;

@Entity
@Table(name = "stages")
public class Stage implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stage_id")
    private int stageId;

    @NotBlank
    @Column(name="video_url")
    private String videoUrl;

    @Column(name="step_order")
    private int stepOrder;

    @ManyToOne
    @JoinColumn(name="course_id", nullable=false)
    private Course course;

}
