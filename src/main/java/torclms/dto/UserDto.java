package torclms.dto;

import torclms.model.User;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;

public class UserDto {

    private Long userId;

    private String firstname;

    private String surname;

    private String email;

    public UserDto () {}

    public UserDto (User user) {
        this.userId = user.getUserId();
        this.firstname = user.getFirstname();
        this.surname = user.getSurname();
        this.email = user.getEmail();
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
