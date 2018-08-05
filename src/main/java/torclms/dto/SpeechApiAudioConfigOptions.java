package torclms.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SpeechApiAudioConfigOptions {

    @JsonProperty("audioEncoding")
    String audioEncoding;

    public SpeechApiAudioConfigOptions(String audioEncoding) {
        this.audioEncoding = audioEncoding;
    }
}
