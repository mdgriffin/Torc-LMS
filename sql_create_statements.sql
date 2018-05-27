CREATE TABLE users (
  user_id int NOT NULL auto_increment,
  firstname VARCHAR(255) NOT NULL,
  surname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  registered_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id)
);

CREATE TABLE user_roles (
  user_role_id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  role varchar(45) NOT NULL,
  PRIMARY KEY (user_role_id),
  KEY fk_user_id (user_id),
  CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users (user_id)
);