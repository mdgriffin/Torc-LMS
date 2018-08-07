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
public class ProcessTextToSpeech implements Runnable {

    @Autowired
    private CourseRepository courseRepository;

    private Course course;

    private static final String SERVICE_URL = "https://texttospeech.googleapis.com/v1beta1/text:synthesize";

    private static final String API_KEY = "AIzaSyB1lmPS8znXUfTH6UiimSaS5j7MpcpkqJk";

    private static final Logger log = LoggerFactory.getLogger(UserAssignmentLockCheck.class);

    public ProcessTextToSpeech () {
    }

    public ProcessTextToSpeech (Course course, CourseRepository courseRepository) {
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

    public String processTextAndGetFileName (String text) {
        String fileName = UUID.randomUUID().toString() + ".mp3";

        try {
            String audioContent = getAudioContent(text);

            if (audioContent.length() > 0) {
                byte[] decodedAudio = Base64.getMimeDecoder().decode(audioContent);
                uploadFileToCdn(fileName, decodedAudio);
            }
        } catch (Exception exc) {
            exc.printStackTrace();
            fileName = "";
        }

        return fileName;
    }

    private String getAudioContent (String text) throws UnirestException, JsonProcessingException, UnsupportedEncodingException {
        String audioContent = "";

        String apiOptions = new SpeechApiOptions(
            new SpeechApiInputOptions(text),
            new SpeechApiVoiceOptions("en-US-Wavenet-C", "en-us", "FEMALE"),
            new SpeechApiAudioConfigOptions("MP3")
        ).toJson();

        HttpResponse<JsonNode> response = Unirest
            .post(SERVICE_URL + "?key=" + API_KEY)
            .body(apiOptions)
            .asJson();

        JSONObject responseObject = response.getBody().getObject();

        if (responseObject.has("audioContent")) {
            audioContent = responseObject.getString("audioContent");
        }

        return audioContent;
    }

    private void uploadFileToCdn (String fileName, byte[] fileContent) {
        Storage storage = StorageOptions.getDefaultInstance().getService();

        storage.create(
            BlobInfo
                .newBuilder("torc-lms.appspot.com", "audio/" + fileName)
                    .setAcl(new ArrayList<>(Arrays.asList(Acl.of(Acl.User.ofAllUsers(), Acl.Role.READER))))
                .build(),
            fileContent
        );
    }

    /*
    private static void writeMp3ToFile (String fileName, String audioContent) {
        byte[] decodedAudio = Base64.getMimeDecoder().decode(audioContent);

        try (OutputStream out = new FileOutputStream(fileName + ".mp3")) {
            out.write(decodedAudio);
            System.out.println("Audio content written to file \"output.mp3\"");
        } catch (FileNotFoundException e) {
            log.error(e.getMessage());
            e.printStackTrace();
        } catch (IOException e) {
            log.error(e.getMessage());
            e.printStackTrace();
        }
    }
    */

}
