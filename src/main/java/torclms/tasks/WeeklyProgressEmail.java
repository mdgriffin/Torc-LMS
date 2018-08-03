package torclms.tasks;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.apache.http.HttpHost;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import torclms.entity.AssignmentStatus;
import torclms.model.User;
import torclms.service.UserService;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class WeeklyProgressEmail {

    private static final Logger log = LoggerFactory.getLogger(UserAssignmentLockCheck.class);

    private static final String SERVICE_URL = "https://api.mailgun.net/v3/sandboxc6c799a970144339bafd9f2602a780ad.mailgun.org/messages";

    //private static final String SMTP_LOGIN = "postmaster@sandboxc6c799a970144339bafd9f2602a780ad.mailgun.org";

    //private static final String PASSWORD = "4rhe-nc9erz2";

    private static final String API_KEY = "key-9kkpn7g9-vf94ponbx5ai5c9nqc36ej9";

    private static final String WEEKLY_REPORT_TEMPLATE_NAME = "html/weekly_report";

    @Autowired
    private TemplateEngine emailTemplateEngine;

    @Autowired
    private UserService userService;

    @Scheduled(cron = "30 45 11 ? * FRI")
    //@Scheduled(cron = "0 0/3 * ? * *")
    private void sendWeeklyMail () throws UnirestException {
        log.info("SENDING EMAIL");
        final String emailHtmlContent = getReportHtml();

        HttpResponse<JsonNode> request = Unirest
            .post(SERVICE_URL)
            .basicAuth("api", API_KEY)
            .queryString("from", "Team Torc <mailgun@sandboxc6c799a970144339bafd9f2602a780ad.mailgun.org>")
            .queryString("to", "mdgriffin064@gmail.com")
            .queryString("subject", "Team Torc LMS - Weekly Progress Report")
            .queryString("html", emailHtmlContent)
            .asJson();

         JsonNode response = request.getBody();

        log.info(response.toString());
    }

    private String getReportHtml () {

        List<User> users = userService.findUsersWithRecentAssignments();

        final Context ctx = new Context();

        /*
        List<User> lockedUsers = users.stream().filter(user -> {
           user.setAssignedCourses(user.getAssignedCourses().stream().filter(assignment -> assignment.getStatus() == AssignmentStatus.LOCKED).collect(Collectors.toSet()));
           return user.getAssignedCourses().size() > 0;
        }).collect(Collectors.toList());
        */

        ctx.setVariable("name", "John Doe");
        ctx.setVariable("users", users);

        return this.emailTemplateEngine.process(WEEKLY_REPORT_TEMPLATE_NAME, ctx);
    }

}
