package torclms.service;

import torclms.entity.UserRole;
import torclms.model.Stage;
import torclms.model.User;
import torclms.model.UserAssignment;

import java.util.Optional;

public interface UserService {
    User findUserByEmail(String email);
    void saveUser(User user, UserRole userRole);
    User assignStages (User user, Stage stage);
    Optional<User> findById (Long userId);
}