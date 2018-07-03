package torclms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import torclms.model.Course;

import java.util.Date;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Integer> {

    Course findByCourseId (int courseId);

    @Query("SELECT c FROM Course c INNER JOIN c.assignedUsers a INNER JOIN a.assignedUser u WHERE u.userId = :userId AND a.assignedOn <= :startDate AND a.deadline <= :endDate")
    List<Course> findAssignedCourses (@Param("userId") Long userId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

}
