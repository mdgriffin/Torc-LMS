CREATE TABLE User (
  user_id int NOT NULL auto_increment,
  firstname VARCHAR(255) NOT NULL ,
  surname VARCHAR(255) NOT NULL ,
  registered_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id)
);