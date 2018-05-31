package torclms.model;

import javax.persistence.*;

@Entity
@Table(name = "user_roles")
@IdClass(UserRoleIdentity.class)
public class UserRole {

    @Column(name="user_id")
    @Id
    private int userId;

    @Column(name="role_id")
    @Id
    private int roleId;

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getRoleId() {
        return roleId;
    }

    public void setRoleId(int roleId) {
        this.roleId = roleId;
    }
}