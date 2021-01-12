
DROP SCHEMA IF EXISTS `weddingguests`;
CREATE SCHEMA IF NOT EXISTS `weddingguests` DEFAULT CHARACTER SET latin1;

CREATE TABLE IF NOT EXISTS `weddingguests`.`foods`(
     `id` INT(3) NOT NULL AUTO_INCREMENT,
     `food_type` VARCHAR(50) NOT NULL,
     `notes` VARCHAR(100) NULL DEFAULT NULL,
     `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `weddingguests`.`relationships`(
    `id` INT(3) NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(50) NULL DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `weddingguests`.`allergies`(
    `id` INT(3) NOT NULL AUTO_INCREMENT,
    `allergy`VARCHAR(50) NOT NULL,
    `notes` VARCHAR(100) NULL DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
)ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `weddingguests`.`tokens`(

    `tokenId` VARCHAR(10) NOT NULL,
    `rep_name` VARCHAR(50) NOT NULL,
    `valid` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`tokenId`)
)ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `weddingguests`.`guests`(
    `id` INT(3) NOT NULL AUTO_INCREMENT,
    `food_id` INT(3) NULL DEFAULT NULL,
    `allergy_id` INT(3) NULL DEFAULT NULL,
    `relationship_id` INT(3) NULL DEFAULT NULL,
    `token_id` VARCHAR(10) NULL DEFAULT NULL,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `attending` BOOLEAN NULL DEFAULT NULL,
    `arrived` BOOLEAN NULL DEFAULT NULL,
    `table` INT(3) NULL DEFAULT NULL,
    `email` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX (`table`),
    CONSTRAINT `fk_food`
        FOREIGN KEY (`food_id`) 
        REFERENCES `weddingguests`.`foods`(`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    CONSTRAINT `fk_relationship`
        FOREIGN KEY (`relationship_id`) 
        REFERENCES `weddingguests`.`relationships`(`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    CONSTRAINT `fk_token`
        FOREIGN KEY (`token_id`)
        REFERENCES `weddingguests`.`tokens`(`tokenId`)
        ON DELETE NO ACTION 
        ON UPDATE NO ACTION,
    CONSTRAINT `fk_allergy`
        FOREIGN KEY (`allergy_id`)
        REFERENCES `weddingguests`.`allergies`(`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
)ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


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

