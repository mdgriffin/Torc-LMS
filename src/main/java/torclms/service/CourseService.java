package torclms.service;

import torclms.model.Course;

public interface CourseService {

    Course findCourseById (int courseId);

    Course saveCourse (Course course);
}
