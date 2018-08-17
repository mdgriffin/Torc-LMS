package torclms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import torclms.exception.ResourceNotFoundException;
import torclms.model.Course;
import torclms.repository.CourseRepository;
import torclms.tasks.ProcessTextToSpeech;
import torclms.tasks.ExecutorService;

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
        Course savedCourse = courseRepo.save(course);

        ExecutorService executorService = ExecutorService.getInstance();
        executorService.addJob(new ProcessTextToSpeech(savedCourse, courseRepo));

        return savedCourse;
    }

    @Override
    public Course updateCourse(Course course) {
        return courseRepo.save(course);
    }

}
