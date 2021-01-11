

CREATE TABLE IF NOT EXISTS `heroku_81ca0cf3689ff4d`.`foods`(
     `id` INT(3) NOT NULL AUTO_INCREMENT,
     `food_type` VARCHAR(50) NOT NULL,
     `notes` VARCHAR(100) NULL DEFAULT NULL,
     `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `heroku_81ca0cf3689ff4d`.`relationships`(
    `id` INT(3) NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(50) NULL DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `heroku_81ca0cf3689ff4d`.`allergies`(
    `id` INT(3) NOT NULL AUTO_INCREMENT,
    `allergy`VARCHAR(50) NOT NULL,
    `notes` VARCHAR(100) NULL DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 
    PRIMARY KEY (`id`)
)ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `heroku_81ca0cf3689ff4d`.`tokens`(

    `tokenId` VARCHAR(10) NOT NULL,
    `rep_name` VARCHAR(50) NOT NULL,
    `valid` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,

    PRIMARY KEY (`tokenId`)
)ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `heroku_81ca0cf3689ff4d`.`guests`(
    `id` INT(3) NOT NULL AUTO_INCREMENT,
    `food_id` INT(3) NULL DEFAULT NULL,
    `allergy_id` INT(3) NULL DEFAULT NULL,
    `relationship_id` INT(3) NULL DEFAULT NULL,
    `token_id` VARCHAR(10) NULL DEFAULT NULL,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `attending` BOOLEAN NULL DEFAULT NULL,
    `table` INT(3) NULL DEFAULT NULL,
    `email` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX (`table`),
    CONSTRAINT `fk_food`
        FOREIGN KEY (`food_id`) 
        REFERENCES `heroku_81ca0cf3689ff4d`.`foods`(`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    CONSTRAINT `fk_relationship`
        FOREIGN KEY (`relationship_id`) 
        REFERENCES `heroku_81ca0cf3689ff4d`.`relationships`(`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    CONSTRAINT `fk_token`
        FOREIGN KEY (`token_id`)
        REFERENCES `heroku_81ca0cf3689ff4d`.`tokens`(`tokenId`)
        ON DELETE NO ACTION 
        ON UPDATE NO ACTION,
    CONSTRAINT `fk_allergy`
        FOREIGN KEY (`allergy_id`)
        REFERENCES `heroku_81ca0cf3689ff4d`.`allergies`(`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
)ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

