package torclms.model;

import javax.persistence.Embeddable;
import java.io.Serializable;

public class UserRoleIdentity implements Serializable {
    private int userId;
    private int roleId;

    public UserRoleIdentity () {}

    public UserRoleIdentity (int userId, int roleId) {
        this.userId = userId;
        this.roleId = roleId;
    }

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        UserRoleIdentity other = (UserRoleIdentity) o;

        return userId == other.getUserId() && roleId == other.getRoleId();
    }

    @Override
    public int hashCode() {
        return 31 * roleId + userId;
    }
}
