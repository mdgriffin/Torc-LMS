package torclms.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SpeechApiVoiceOptions {

    @JsonProperty("name")
    private String name;

    @JsonProperty("languageCode")
    private String languageCode;

    @JsonProperty("ssmlGender")
    private String ssmlGender;

    public SpeechApiVoiceOptions(String name, String languageCode, String ssmlGender) {
        this.name = name;
        this.languageCode = languageCode;
        this.ssmlGender = ssmlGender;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLanguageCode() {
        return languageCode;
    }

    public void setLanguageCode(String languageCode) {
        this.languageCode = languageCode;
    }

    public String getSsmlGender() {
        return ssmlGender;
    }

    public void setSsmlGender(String ssmlGender) {
        this.ssmlGender = ssmlGender;
    }
}
