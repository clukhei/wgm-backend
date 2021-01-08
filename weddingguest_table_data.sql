

USE `weddingguests`;

INSERT INTO `foods`(`food_type`, `notes`) values ('chinese', 'teochew');
INSERT INTO `foods`(`food_type`, `notes`) values ('halal', 'for muslim friends');
INSERT INTO `foods`(`food_type`, `notes`) values ('vegetarians', 'no garlic onion');
INSERT INTO `foods`(`food_type`, `notes`) values ('western', 'french');
INSERT INTO `foods`(`food_type`, `notes`) values ('allergy-friendly', 'no seafood');
# 5 records

INSERT INTO `relationships`(`type`) VALUES ('bride side');
INSERT INTO `relationships`(`type`) VALUES ('groom side');


INSERT INTO `guests` (`food_id`,`relationship_id`, `name`,`email`) values ( 3,1,'lucy','lucy@gmail.com');
INSERT INTO `guests` (`food_id`,`relationship_id`, `name`,`email`) values ( 2,1,'mary','mary@gmail.com');