package torclms.service;

import torclms.model.Course;

import java.util.List;

public interface CourseService {

    Course findCourseById (int courseId);

    List<Course> findAll ();

    Course saveCourse (Course course);
}
