package torclms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import torclms.model.Course;

public interface CourseRepository extends JpaRepository<Course, Integer> {
    Course findByCourseId (int courseId);
}
