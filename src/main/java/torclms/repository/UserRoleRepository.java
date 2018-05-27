package torclms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import torclms.model.User;
import torclms.model.UserRole;

@Repository("UserRoleRepository")
public interface UserRoleRepository  extends JpaRepository<UserRole, Integer> {
    UserRole findByRole(String role);
}
