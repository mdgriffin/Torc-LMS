DROP TABLE users;
DROP TABLE user_roles;
DROP TABLE roles;

CREATE TABLE users (
  user_id int NOT NULL auto_increment,
  firstname VARCHAR(255) NOT NULL,
  surname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  registered_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id)
);

CREATE TABLE roles (
  role_id int NOT NULL AUTO_INCREMENT,
  role varchar(45) NOT NULL UNIQUE,
  CONSTRAINT pk_roles PRIMARY KEY (role_id)
);

CREATE TABLE user_roles (
  role_id int NOT NULL,
  user_id int NOT NULL,
  PRIMARY KEY (role_id, user_id),
  CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users (user_id),
  CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES users (role_id)
);