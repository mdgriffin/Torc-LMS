package torclms.entity;

import org.joda.time.Days;
import org.joda.time.LocalDate;
import org.junit.Test;

import java.util.Date;
import java.util.concurrent.TimeUnit;

import static org.junit.Assert.assertEquals;


public class TestCompletionDeadlineTest {


    @Test
    public void dateIs7DaysFromToday () {
        Date now = new Date();
        Date deadline = TestCompletionDeadline.getDate();

        long diff = deadline.getTime() - now.getTime();
        long days = TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);

        assertEquals(7l, TestCompletionDeadline.NUM_DAYS);
    }
}
