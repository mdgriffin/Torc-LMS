package torclms.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import torclms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    @Query("SELECT u from User u inner join u.roles r where r.role = :role")
    List<User> getUsersByRole (@Param("role") String role);

    @Query("SELECT u from User u INNER JOIN u.assignedCourses a WHERE a.status = 'LOCKED'")
    List<User> getUsersWithLockedAssignments ();

    @Query("SELECT u FROM User u INNER JOIN u.assignedCourses a WHERE a.lastUpdated > :startDate AND a.lastUpdated < :endDate")
    List<User> getUsersWithAssignmentActivityInDateRange (@Param("startDate") Date startDate, @Param("endDate") Date endDate);
}