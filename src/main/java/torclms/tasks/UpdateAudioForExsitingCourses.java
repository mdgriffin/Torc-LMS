package torclms.tasks;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import torclms.model.Course;
import torclms.repository.CourseRepository;

import java.util.List;

@Component
public class UpdateAudioForExsitingCourses {

    private static final Logger log = LoggerFactory.getLogger(UserAssignmentLockCheck.class);

    @Autowired
    private CourseRepository courseRepository;

    //@Scheduled(fixedRate = 60000)
    public void processCourses () {

        log.info("Starting to update existing courses with audio");
        List<Course> courses = courseRepository.findAll();

        ExecutorService executor = ExecutorService.getInstance();

        courses.forEach(course -> {
            executor.addJob(new ProcessTextToSpeech(course, courseRepository));
        });
    }
}
