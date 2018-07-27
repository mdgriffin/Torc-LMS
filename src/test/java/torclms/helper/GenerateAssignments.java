package torclms.helper;

import torclms.entity.AssignmentStatus;
import torclms.model.Course;
import torclms.model.User;
import torclms.model.UserAssignment;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class GenerateAssignments {

    public static List<UserAssignment> getAssignmentList (int numAssignments, User user) {
        List<UserAssignment> assignments = new ArrayList<>();

        for (int i = 0;i < numAssignments; i++) {
            assignments.add(getAssignment(user,  new Course("Course " + i)));
        }

        return  assignments;
    }

    public static UserAssignment getAssignment (User user, Course course) {
        return new UserAssignment(user, course, new Date(), AssignmentStatus.INCOMPLETE);
    }

}
