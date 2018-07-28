package torclms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import torclms.dto.StageAttemptDto;
import torclms.entity.AssignmentStatus;
import torclms.exception.ResourceNotFoundException;
import torclms.model.*;
import torclms.repository.StageAttemptRepository;
import torclms.repository.UserAssignmentRepository;

import java.util.List;
import java.util.Optional;

import static java.lang.Math.toIntExact;

@Service
public class UserAssignmentServiceImpl implements UserAssignmentService {

    @Autowired
    private UserAssignmentRepository userAssignmentRepository;

    @Autowired
    private UserService userService;

    private static final int NUM_STAGE_ATTEMPTS = 2;

    @Override
    public UserAssignment attemptStage(User user, StageAttemptDto stageAttemptDto) {
        List<UserAssignment> userAssignments = userService.findUserAssignmentsByCourseId(user.getUserId(), stageAttemptDto.getCourseId());

        if (userAssignments.size() == 0) {
            throw new ResourceNotFoundException("UserAssignment", "id", null);
        }

        UserAssignment assignment  = userAssignments.get(0);

        Stage stage = assignment.getAssignedCourse()
            .getStages()
            .stream().filter(val -> val.getStageId()== stageAttemptDto.getStageId())
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("Stage", "id", stageAttemptDto.getStageId()));

        assignment.getStageAttempts().add(new StageAttempt(assignment, stage, stageAttemptDto.isCompleted()));

        return userAssignmentRepository.save(assignment);
    }

    @Override
    public int numAttemptsRemaining(UserAssignment assignment, int stageId) {
        Long numFailedAttempts = assignment.getStageAttempts()
            .stream()
            .filter(attempt -> attempt.getStage().getStageId() == stageId && attempt.getDateAttempted().compareTo(assignment.getLastUpdated()) >= 0 && !attempt.isCompleted())
            .count();

        if (numFailedAttempts >= NUM_STAGE_ATTEMPTS) {
            return 0;
        }

        return NUM_STAGE_ATTEMPTS - toIntExact(numFailedAttempts);
    }

}
