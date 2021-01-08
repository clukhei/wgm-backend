

USE `weddingguests`;

INSERT INTO `allergies`(`allergy`) values ('seafood');
INSERT INTO `allergies`(`allergy`) values ('fish');
INSERT INTO `allergies`(`allergy`) values ('egg');
INSERT INTO `allergies`(`allergy`) values ('milk');
INSERT INTO `allergies`(`allergy`) values ('peanut');
INSERT INTO `allergies`(`allergy`) values ('wheat');
INSERT INTO `foods`(`food_type`, `notes`) values ('halal', 'for muslim friends');
INSERT INTO `foods`(`food_type`, `notes`) values ('vegetarians', 'no garlic onion');


INSERT INTO `relationships`(`type`) VALUES ('bride side');
INSERT INTO `relationships`(`type`) VALUES ('groom side');


INSERT INTO `guests` (`food_id`,`relationship_id`, `name`,`email`) values ( 1,1,'lucy','lucy@gmail.com');
INSERT INTO `guests` (`food_id`,`relationship_id`, `name`,`email`) values ( 1,1,'mary','mary@gmail.com');