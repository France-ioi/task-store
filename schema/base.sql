/*
MySQL Data Transfer
Source Host: localhost
Source Database: taskdatabase
Target Host: localhost
Target Database: review
Date: 11/01/2021 9:53:40
*/

-- -----------------------------------
-- Table structure for task database
-- -----------------------------------
DROP TABLE IF EXISTS `quickpiprojects`;
CREATE TABLE `quickpiprojects (
    `id` INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `s3uuid` VARCHAR(50) NOT NULL,
    `task_type` ENUM('quickpi', 'quickalgo'),
    `title` VARCHAR(255),
    `version` VARCHAR(50),
    `nb_access` INT(6) UNSIGNED,
    `license` VARCHAR(50),
    `authors` VARCHAR(255),
    `creation_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
