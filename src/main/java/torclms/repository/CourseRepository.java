package torclms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import torclms.model.Course;

import java.util.Date;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Integer> {

    Course findByCourseId (int courseId);

}
