package torclms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import torclms.model.Course;
import torclms.model.UserAssignment;

import java.util.Date;
import java.util.List;

public interface UserAssignmentRepository  extends JpaRepository<UserAssignment, Long> {

    @Query("SELECT a FROM UserAssignment a INNER JOIN a.assignedUser u WHERE u.userId = :userId  AND a.assignedOn <= :startDate AND a.deadline <= :endDate ")
    List<UserAssignment> findUserAssignments (@Param("userId") Long userId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

}
