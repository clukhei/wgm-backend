
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

CREATE TABLE IF NOT EXISTS `weddingguests`.`tokens`(
    `id` INT(3) NOT NULL AUTO_INCREMENT,
    `tokenId` VARCHAR(10) NOT NULL,
    `rep_name` VARCHAR(50) NOT NULL,
    `valid` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `tokenId` (`tokenId`)

)ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `weddingguests`.`guests`(
    `id` INT(3) NOT NULL AUTO_INCREMENT,
    `food_id` INT(3) NULL DEFAULT NULL,
    `relationship_id` INT(3) NULL DEFAULT NULL,
    `token_id` INT(3) NULL DEFAULT NULL,
    `name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
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
        REFERENCES `weddingguests`.`tokens`(`id`)
        ON DELETE NO ACTION 
        ON UPDATE NO ACTION
)ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

