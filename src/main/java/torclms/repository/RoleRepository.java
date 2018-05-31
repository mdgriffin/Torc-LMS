package torclms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.support.Repositories;
import torclms.model.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Role findByRole (String role);
}
