package torclms.service;

import torclms.model.Course;
import torclms.model.UserAssignment;

import java.util.List;
import java.util.Optional;

public interface CourseService {

    Optional<Course> findCourseById (int courseId);

    List<Course> findAll ();

    Course saveCourse (Course course);

}
