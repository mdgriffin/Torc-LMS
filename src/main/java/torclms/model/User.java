package torclms.model;

/*
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
*/

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Entity;

@Entity
//@Table(name = "users")
//@EntityListeners(AuditingEntityListener.class)
//@JsonIgnoreProperties(value = {"createdAt"}, allowGetters = true)
public class User implements Serializable {
    //@Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    //@NotBlank
    private String firstname;

    //@NotBlank
    private String surname;

    //@Column(nullable = false, updatable = false)
    //@Temporal(TemporalType.TIMESTAMP)
    //@CreatedDate
    private Date createdAt;


}