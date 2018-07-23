package torclms.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import torclms.entity.AssignmentStatus;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "User_Assignment")
public class UserAssignment implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JoinColumn(name = "user_assignment_id")
    private Long userAssignmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User assignedUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    //@JsonBackReference("courseAssignedUser")
    private Course assignedCourse;

    @OneToMany(mappedBy="userAssignment", fetch = FetchType.LAZY, cascade =  CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<StageCompletion> stageCompletions = new HashSet<>();

    @Column(name = "assigned_on", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private Date assignedOn;

    @Column(name = "deadline", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date deadline;

    @Column(name = "last_updated", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @UpdateTimestamp
    private Date lastUpdated;

    /*
    @Column(name="locked", columnDefinition = "TINYINT DEFAULT 0", nullable = true)
    @Type(type = "org.hibernate.type.NumericBooleanType")
    private boolean locked;
    */

    @Column(name= "status", nullable = true)
    private AssignmentStatus status;

    public UserAssignment() {}

    public UserAssignment(User user, Course course, Date deadline) {
        setAssignedUser(user);
        setAssignedCourse(course);
        setDeadline(deadline);
    }

    public User getAssignedUser() {
        return assignedUser;
    }

    public void setAssignedUser(User assignedUser) {
        this.assignedUser = assignedUser;
    }

    public Course getAssignedCourse() {
        return assignedCourse;
    }

    public void setAssignedCourse(Course assignedCourse) {
        this.assignedCourse = assignedCourse;
    }

    public Date getAssignedOn() {
        return assignedOn;
    }

    public void setAssignedOn(Date assignedOn) {
        this.assignedOn = assignedOn;
    }

    public Date getDeadline() {
        return deadline;
    }

    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }

    public Long getUserAssignmentId() {
        return userAssignmentId;
    }

    public void setUserAssignmentId(Long userAssignmentId) {
        this.userAssignmentId = userAssignmentId;
    }

    public Set<StageCompletion> getStageCompletions() {
        return stageCompletions;
    }

    public void setStageCompletions(Set<StageCompletion> stageCompletions) {
        this.stageCompletions = stageCompletions;
    }

    public Date getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(Date lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public AssignmentStatus getStatus() {
        return status;
    }

    public void setStatus(AssignmentStatus status) {
        this.status = status;
    }

    public boolean isLocked() {
        return this.status.equals(AssignmentStatus.LOCKED);
    }

}
