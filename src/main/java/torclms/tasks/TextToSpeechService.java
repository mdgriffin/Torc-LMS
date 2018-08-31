package torclms.tasks;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.cloud.storage.Acl;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import torclms.dto.SpeechApiAudioConfigOptions;
import torclms.dto.SpeechApiInputOptions;
import torclms.dto.SpeechApiOptions;
import torclms.dto.SpeechApiVoiceOptions;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.UUID;

public abstract class TextToSpeechService {

    private static final String SERVICE_URL = "https://texttospeech.googleapis.com/v1beta1/text:synthesize";

    @Value("${google.apikey}")
    private static String API_KEY;

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

}