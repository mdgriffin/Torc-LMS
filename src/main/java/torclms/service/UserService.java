package torclms.service;

import torclms.entity.UserRole;
import torclms.model.User;

public interface UserService {
    public User findUserByEmail(String email);
    public void saveUser(User user, UserRole userRole);
}