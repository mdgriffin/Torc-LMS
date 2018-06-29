package torclms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import torclms.model.Course;
import torclms.repository.CourseRepository;

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

    public Course saveCourse (Course cource) {
        return courseRepo.save(cource);
    }

}
