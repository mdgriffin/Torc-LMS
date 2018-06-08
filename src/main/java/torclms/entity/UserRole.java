package torclms.entity;

public enum UserRole {
    ADMIN("Admin"),
    MANAGER("Manager"),
    TRAINEE("Trainee");

    String displayName;

    private UserRole (String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public static boolean contains(String test) {

        for (UserRole role : UserRole.values()) {
            if (role.name().equals(test)) {
                return true;
            }
        }

        return false;
    }
}
