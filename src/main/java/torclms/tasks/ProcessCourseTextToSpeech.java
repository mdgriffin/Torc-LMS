package torclms.tasks;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.cloud.storage.Acl;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.json.JSONObject;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import torclms.dto.SpeechApiAudioConfigOptions;
import torclms.dto.SpeechApiInputOptions;
import torclms.dto.SpeechApiOptions;
import torclms.dto.SpeechApiVoiceOptions;
import torclms.model.Course;
import torclms.repository.CourseRepository;

import java.io.*;
import java.util.*;

@Component
public class ProcessCourseTextToSpeech extends TextToSpeechService implements Runnable {

    @Autowired
    private CourseRepository courseRepository;

    private Course course;

    private static final Logger log = LoggerFactory.getLogger(UserAssignmentLockCheck.class);

    public ProcessCourseTextToSpeech() {
    }

    public ProcessCourseTextToSpeech(Course course, CourseRepository courseRepository) {
        this.course = course;
        this.courseRepository = courseRepository;
    }

    @Override
    public void run () {
        log.info("Run by the executor service for course: " + course.getTitle());

        this.course.setTitleAudio(processTextAndGetFileName(this.course.getTitle()));

        this.course.getStages().forEach(stage -> {

            if (stage.getTitleAudio() == null || stage.getTitleAudio().length() == 0) {
                stage.setTitleAudio(processTextAndGetFileName(stage.getTitle()));
            }

            stage.getQuestions().forEach(question -> {

                if (question.getQuestionAudio() == null || question.getQuestionAudio().length() == 0) {
                    question.setQuestionAudio(processTextAndGetFileName(question.getQuestion()));
                }

                if (question.getExplanationAudio() == null || question.getExplanationAudio().length() == 0) {
                    question.setExplanationAudio(processTextAndGetFileName(question.getExplanation()));
                }

                question.getOptions().forEach(option -> {
                    if (option.getTextAudio() == null || option.getTextAudio().length() == 0) {
                        option.setTextAudio(processTextAndGetFileName(option.getText()));
                    }
                });
            });
        });

        courseRepository.save(this.course);
    }

}
