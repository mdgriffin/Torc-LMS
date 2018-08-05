package torclms.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class SpeechApiOptionsTest {

    @Test
    public void withAllOptionsSet_canSerializeToJson () throws JsonProcessingException {
        SpeechApiOptions apiOptions = new SpeechApiOptions(
            new SpeechApiInputOptions("Mary had a little lamb"),
            new SpeechApiVoiceOptions("en-gb", "en-GB-Standard-A", "FEMALE"),
            new SpeechApiAudioConfigOptions("MP3")
        );

        String json = apiOptions.toJson();

        assertEquals("{\"input\":{\"text\":\"Mary had a little lamb\"},\"voice\":{\"name\":\"en-gb\",\"languageCode\":\"en-GB-Standard-A\",\"ssmlGender\":\"FEMALE\"},\"audioConfig\":{\"audioEncoding\":\"MP3\"}}", json);
    }
}
