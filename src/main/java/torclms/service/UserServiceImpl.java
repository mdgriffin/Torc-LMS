package torclms.service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import torclms.entity.TestCompletionDeadline;
import torclms.entity.UserRole;
import torclms.model.Role;
import torclms.model.Stage;
import torclms.model.User;
import torclms.model.UserAssignment;
import torclms.repository.RoleRepository;
import torclms.repository.UserRepository;

@Service("UserService")
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public void saveUser(User user, UserRole userRole) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setEnabled(true);
        Role role = roleRepository.findByRole(userRole.toString());
        user.setRoles(new HashSet<Role>(Arrays.asList(role)));
        userRepository.save(user);
    }

    @Override
    public Optional<User> findById (Long userId) {
        return userRepository.findById(userId);
    }

    @Override
    public User assignStages(User user, Stage stage) {
        UserAssignment assignment = new UserAssignment();

        assignment.setAssignedUser(user);
        assignment.setAssignedStage(stage);

        assignment.setDeadline(TestCompletionDeadline.getDate());

        user.getAssignedStages().add(assignment);

        return userRepository.save(user);
    }
}
