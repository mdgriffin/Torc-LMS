package torclms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import torclms.entity.TestCompletionDeadline;
import torclms.model.Course;
import torclms.model.UserAssignment;
import torclms.repository.CourseRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepo;

    public List<Course> findAll () {
        return courseRepo.findAll();
    }

    public Optional<Course> findCourseById (int courseId) {
        return courseRepo.findById(courseId);
    }

    public Course saveCourse (Course course) {
        return courseRepo.save(course);
    }

}
