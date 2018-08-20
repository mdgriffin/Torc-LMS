package torclms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import torclms.dto.StageAttemptDto;
import torclms.dto.StageAttemptInfoDto;
import torclms.entity.AssignmentStatus;
import torclms.entity.TestCompletionDeadline;
import torclms.exception.ResourceNotFoundException;
import torclms.model.*;
import torclms.repository.StageAttemptRepository;
import torclms.repository.UserAssignmentRepository;

import java.util.*;

import static java.lang.Math.toIntExact;

@Service
public class UserAssignmentServiceImpl implements UserAssignmentService {

    @Autowired
    private UserAssignmentRepository userAssignmentRepository;

    @Autowired
    private  StageAttemptRepository stageAttemptRepository;

    @Autowired
    private  StageService stageService;

    private static final int NUM_STAGE_ATTEMPTS = 2;

    @Override
    public Optional<UserAssignment> getAssignmentById(Long assignmentId) {
        UserAssignment assignment = userAssignmentRepository.getOne(assignmentId);
        return Optional.of(assignment);
    }

    @Override
    public UserAssignment attemptStage(User user, StageAttemptDto stageAttemptDto) {
        UserAssignment assignment = userAssignmentRepository.getOne(stageAttemptDto.getUserAssignmentId());

        if (assignment == null) {
            throw new ResourceNotFoundException("UserAssignment", "id", null);
        }

        if (assignment.getStatus().equals(AssignmentStatus.INCOMPLETE)) {
            Stage stage = assignment.getAssignedCourse()
                    .getStages()
                    .stream().filter(val -> val.getStageId()== stageAttemptDto.getStageId())
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Stage", "id", stageAttemptDto.getStageId()));

            Stage lastStage = stageService.getLastStage(assignment.getAssignedCourse().getStages());

            StageAttempt attempt = new StageAttempt(assignment, stage, stageAttemptDto.isCompleted(), stageAttemptDto.getNumQuestions(), stageAttemptDto.getNumCorrect());
            attempt.setDateAttempted(new Date());

            assignment.getStageAttempts().add(attempt);

            if (stageAttemptDto.isCompleted() && lastStage.getStageId() == stageAttemptDto.getStageId()) {
                assignment.setStatus(AssignmentStatus.COMPLETED);
            } else if (numAttemptsRemaining(assignment, stageAttemptDto.getStageId()) == 0) {
                assignment.setStatus(AssignmentStatus.LOCKED);
            } else if (stageAttemptDto.isCompleted()) {
                Stage nextStage = stageService.getNextStage(assignment.getAssignedCourse().getStages(), stage);
                assignment.setCurrentStageId(nextStage.getStageId());
            }

            return userAssignmentRepository.save(assignment);
        }

        return assignment;
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

    @Override
    public List<UserAssignment> getAssignmentsByStatus(AssignmentStatus assignmentStatus) {
        return userAssignmentRepository.findByStatus(assignmentStatus);
    }

    @Override
    public UserAssignment unlockAssignment(Long assignmentId) {
        UserAssignment assignment = userAssignmentRepository.findById(assignmentId).orElseThrow(() -> new ResourceNotFoundException("UserAssignment", "id", assignmentId));

        if (!assignment.getStatus().equals(AssignmentStatus.LOCKED)) {
            throw new IllegalArgumentException("Assignment must be locked");
        }

        assignment.setStatus(AssignmentStatus.INCOMPLETE);
        assignment.setDeadline(TestCompletionDeadline.getDate());

        return userAssignmentRepository.save(assignment);
    }

    @Override
    public int changeStatusOfExpiredAssignments() {
        List<UserAssignment> expiredAssignments = userAssignmentRepository.findExpiredAssignments();

        expiredAssignments.stream().forEach(assignment -> {
            assignment.setStatus(AssignmentStatus.LOCKED);
            userAssignmentRepository.save(assignment);
        });

        return expiredAssignments.size();
    }

    public List<UserAssignment> getAllAssignments() {
        return userAssignmentRepository.findAll();
    }

    public List<StageAttemptInfoDto> getAllStageAttempts() {
        List<StageAttempt> stageAttempts = stageAttemptRepository.findAll();
        List<StageAttemptInfoDto> attemptsDtoList = new ArrayList<>();

        stageAttempts.forEach(attempt -> attemptsDtoList.add(new StageAttemptInfoDto(attempt)));

        return attemptsDtoList;

    }

}