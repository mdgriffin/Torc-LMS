package torclms.service;

import torclms.model.User;

public interface UserService {
    public User findUserByEmail(String email);
    public void saveUser(User user);
}