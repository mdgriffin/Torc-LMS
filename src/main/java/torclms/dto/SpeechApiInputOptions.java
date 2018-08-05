package torclms.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SpeechApiInputOptions {

    @JsonProperty("text")
    private String text;

    public SpeechApiInputOptions(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
