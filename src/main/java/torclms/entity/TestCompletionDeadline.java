package torclms.entity;

import java.util.Calendar;
import java.util.Date;

public class TestCompletionDeadline {

    public static final int NUM_DAYS = 7;

    public static Date getDate () {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        calendar.add(Calendar.DAY_OF_YEAR, NUM_DAYS);

        return calendar.getTime();
    }

}
