package torclms.tasks;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import torclms.service.UserAssignmentService;

import java.text.SimpleDateFormat;
import java.util.Date;

@Component
public class UserAssignmentLockCheck {

    private static final Logger log = LoggerFactory.getLogger(UserAssignmentLockCheck.class);

    @Autowired
    private UserAssignmentService userAssignmentService;

    @Scheduled(fixedRate = 60000)
    public void markIncompleteAssignmentsAsLocked () {
        int numAssignmentsModified = userAssignmentService.changeStatusOfExpiredAssignments();
        log.info(numAssignmentsModified + " assignments have been identified with incorrect status flags");
    }
}
