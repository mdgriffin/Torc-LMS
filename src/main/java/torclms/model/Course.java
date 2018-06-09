package torclms.model;

import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "courses")
public class Course implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="course_id")
    private long courseId;

    @NotBlank
    private String title;

    @Column(name = "date_created", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @CreatedDate
    private Date dateCreated;

    @Column(columnDefinition = "TINYINT", nullable = true)
    @Type(type = "org.hibernate.type.NumericBooleanType")
    private boolean enabled;

    @OneToMany(mappedBy = "course")
    Set<Stage> stages = new HashSet<>();

    public long getCourseId() {
        return courseId;
    }

    public void setCourseId(long id) {
        this.courseId = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public Set<Stage> getStages() {
        return stages;
    }

    public void setStages(Set<Stage> stages) {
        this.stages = stages;
    }
}
