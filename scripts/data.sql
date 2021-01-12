





USE `weddingguests`;
INSERT INTO `allergies`(`allergy`) values ('no allergy');
INSERT INTO `allergies`(`allergy`) values ('seafood');
INSERT INTO `allergies`(`allergy`) values ('fish');
INSERT INTO `allergies`(`allergy`) values ('egg');
INSERT INTO `allergies`(`allergy`) values ('milk');
INSERT INTO `allergies`(`allergy`) values ('peanut');
INSERT INTO `allergies`(`allergy`) values ('wheat');
INSERT INTO `foods`(`food_type`) values ('No restrictions');
INSERT INTO `foods`(`food_type`, `notes`) values ('halal', 'for muslim friends');
INSERT INTO `foods`(`food_type`, `notes`) values ('vegetarians', 'no garlic onion');


INSERT INTO `relationships`(`type`) VALUES ('bride side');
INSERT INTO `relationships`(`type`) VALUES ('groom side');




INSERT INTO `users`(`first_name`, `last_name`, `email`, `passwordHash`) values ('lukhei', 'chong', 'lukheichong@gmail.com', sha1('lukheichong'));