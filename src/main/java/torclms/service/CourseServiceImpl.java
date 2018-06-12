package torclms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import torclms.model.Course;
import torclms.repository.CourseRepository;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepo;

    public Course findCourseById (int courseId) {
        return courseRepo.findByCourseId(courseId);
    }

    public Course saveCourse (Course cource) {
        return courseRepo.save(cource);
    }

}
