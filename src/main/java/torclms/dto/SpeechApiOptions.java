package torclms.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class SpeechApiOptions {

    @JsonProperty("input")
    private SpeechApiInputOptions inputOptions;

    @JsonProperty("voice")
    private SpeechApiVoiceOptions voiceOptions;

    @JsonProperty("audioConfig")
    private SpeechApiAudioConfigOptions audioOptions;

    public SpeechApiOptions(SpeechApiInputOptions inputOptions, SpeechApiVoiceOptions voiceOptions, SpeechApiAudioConfigOptions audioOptions) {
        this.inputOptions = inputOptions;
        this.voiceOptions = voiceOptions;
        this.audioOptions = audioOptions;
    }

    public SpeechApiInputOptions getInputOptions() {
        return inputOptions;
    }

    public void setInputOptions(SpeechApiInputOptions inputOptions) {
        this.inputOptions = inputOptions;
    }

    public SpeechApiVoiceOptions getVoiceOptions() {
        return voiceOptions;
    }

    public void setVoiceOptions(SpeechApiVoiceOptions voiceOptions) {
        this.voiceOptions = voiceOptions;
    }

    public SpeechApiAudioConfigOptions getAudioOptions() {
        return audioOptions;
    }

    public void setAudioOptions(SpeechApiAudioConfigOptions audioOptions) {
        this.audioOptions = audioOptions;
    }

    public String toJson () throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(this);
    }
}
