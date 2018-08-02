package torclms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import torclms.entity.AssignmentStatus;
import torclms.model.Course;
import torclms.model.UserAssignment;

import java.util.Date;
import java.util.List;

public interface UserAssignmentRepository  extends JpaRepository<UserAssignment, Long> {

    @Query("SELECT a FROM UserAssignment a INNER JOIN a.assignedUser u WHERE u.userId = :userId  AND a.assignedOn <= :startDate AND a.deadline <= :endDate ")
    List<UserAssignment> findUserAssignments (@Param("userId") Long userId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT a FROM UserAssignment a INNER JOIN a.assignedUser u WHERE u.userId = :userId  AND a.assignedCourse.courseId = :courseId  AND a.assignedOn <= :startDate AND a.deadline <= :endDate ")
    List<UserAssignment> findUserAssignmentsByCourseId (@Param("userId") Long userId, @Param("courseId") int courseId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT a FROM UserAssignment a WHERE a.status = 'INCOMPLETE' AND a.deadline <= CURRENT_TIMESTAMP")
    List<UserAssignment> findExpiredAssignments ();

    List<UserAssignment> findByStatus (AssignmentStatus assignmentStatus);

}
