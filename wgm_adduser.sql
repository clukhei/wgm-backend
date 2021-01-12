
DROP TABLE IF EXISTS `weddingguests`.`users`;
CREATE TABLE IF NOT EXISTS `weddingguests`.`users`(
     `id` INT(3) NOT NULL AUTO_INCREMENT,
     `first_name` VARCHAR(50) NOT NULL,
     `last_name` VARCHAR(50) NOT NULL,
     `email` VARCHAR(100) NOT NULL,
     `passwordHash` VARCHAR(100) NOT NULL,
     `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;
USE `weddingguests`;


INSERT INTO `users` (`first_name`, `last_name`, `email`, `passwordHash`) values ("lukhei", "chong", "lukheichong@gmail.com", sha1('lukheichong'));