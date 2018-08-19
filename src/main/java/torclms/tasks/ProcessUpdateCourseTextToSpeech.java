package torclms.tasks;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import torclms.model.Course;
import torclms.model.Question;
import torclms.model.QuestionOption;
import torclms.model.Stage;
import torclms.repository.CourseRepository;

import java.util.Optional;

public class ProcessUpdateCourseTextToSpeech extends  TextToSpeechService implements Runnable {

    @Autowired
    private CourseRepository courseRepository;

    private Course course;

    private Course existingCourse;

    private static final Logger log = LoggerFactory.getLogger(UserAssignmentLockCheck.class);

    public ProcessUpdateCourseTextToSpeech() {
    }

    public ProcessUpdateCourseTextToSpeech(Course course, Course existingCourse, CourseRepository courseRepository) {
        this.course = course;
        this.existingCourse = course;
        this.courseRepository = courseRepository;
    }

    @Override
    public void run () {
        log.info("Run by the executor service for course: " + course.getTitle());

        if (this.course.getTitle() == null || this.course.getTitle().length() == 0 || !this.course.getTitle().equals(existingCourse.getTitle())) {
            this.course.setTitleAudio(processTextAndGetFileName(this.course.getTitle()));
        }

        this.course.getStages().forEach(stage -> {

            final Optional<Stage> existingStage = existingCourse
                .getStages()
                .stream()
                .filter(searchStage -> searchStage.getStageId() == stage.getStageId())
                .findFirst();

            if (stage.getTitleAudio() == null || stage.getTitleAudio().length() == 0 || (existingStage.isPresent() && !stage.getTitle().equals(existingStage.get().getTitleAudio()))) {
                stage.setTitleAudio(processTextAndGetFileName(stage.getTitle()));
            }

            stage.getQuestions().forEach(question -> {
                Optional<Question> existingQuestion = Optional.empty();
                if (existingStage.isPresent()) {
                    existingQuestion = existingStage
                        .get()
                        .getQuestions()
                        .stream()
                        .filter(searchQuestion -> searchQuestion.getQuestionId() == question.getQuestionId())
                        .findFirst();
                }

                if (question.getQuestionAudio() == null || question.getQuestionAudio().length() == 0 || (existingQuestion.isPresent() && !existingQuestion.get().getQuestion().equals(question.getQuestion()))) {
                    question.setQuestionAudio(processTextAndGetFileName(question.getQuestion()));
                }

                if (question.getExplanationAudio() == null || question.getExplanationAudio().length() == 0  || (existingQuestion.isPresent() && !existingQuestion.get().getExplanation().equals(question.getExplanation()))) {
                    question.setExplanationAudio(processTextAndGetFileName(question.getExplanation()));
                }

                final Optional<Question> parentQuestion = existingQuestion;

                question.getOptions().forEach(option -> {
                    Optional<QuestionOption> existingOption = Optional.empty();

                    if (parentQuestion.isPresent()) {
                        existingOption = parentQuestion
                            .get()
                            .getOptions()
                            .stream()
                            .filter(searchOption -> searchOption.getOptionId() == option.getOptionId())
                            .findFirst();
                    }

                    if (option.getTextAudio() == null || option.getTextAudio().length() == 0 || (existingOption.isPresent() && !existingOption.get().getText().equals(option.getText()))) {
                        option.setTextAudio(processTextAndGetFileName(option.getText()));
                    }
                });
            });
        });

        courseRepository.save(this.course);
    }

}
