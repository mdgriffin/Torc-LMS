package torclms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import torclms.dto.StageAttemptDto;
import torclms.exception.ResourceNotFoundException;
import torclms.model.*;
import torclms.repository.StageAttemptRepository;
import torclms.repository.UserAssignmentRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserAssignmentServiceImpl implements UserAssignmentService {

    @Autowired
    private UserAssignmentRepository userAssignmentRepository;

    @Autowired
    private UserService userService;

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

}
