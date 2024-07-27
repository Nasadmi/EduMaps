-- This script is for those who want to know how to make the same TypeORM database but in an SQL script.

CREATE DATABASE IF NOT EXISTS `markmaps-app`;

USE `markmaps-app`;

CREATE TABLE IF NOT EXISTS `users`
(
    id char(36) primary key default(uuid()),
    username varchar(255) not null unique,
    email varchar(255) not null unique,
    password varchar(500) not null,
    img text
);

CREATE TABLE IF NOT EXISTS `markmaps`
(
    id int primary key auto_increment,
    name varchar(255) not null,
    script text not null,
    user char(36) not null,
    public decimal(1,0) not null,
    stars int,
    created_at TIMESTAMP DEFAULT(CURRENT_TIMESTAMP),
    author varchar(255) not null,
    foreign key (user) references users(id),
    check (public >= 0 AND public <= 1)
);

DELIMITER $$
CREATE TRIGGER `check_duplicate_markmaps` BEFORE INSERT ON `markmaps` FOR EACH ROW BEGIN
	DECLARE markmaps_count INT;
    SELECT COUNT(*)
    INTO markmaps_count
    FROM markmaps
    WHERE name = NEW.name AND user = NEW.user;
    IF markmaps_count > 0 THEN
    	SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The user already has a markmap with this name.';
       END IF;
END
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `check_duplicate_markmaps_on_update` BEFORE UPDATE ON `markmaps` FOR EACH ROW BEGIN
	DECLARE markmaps_count INT;
    SELECT COUNT(*)
    INTO markmaps_count
    FROM markmaps
    WHERE name = NEW.name AND user = NEW.user;
    IF markmaps_count > 0 THEN
    	SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The user already has a markmap with this name.';
       END IF;
END
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `update_author_column` AFTER UPDATE ON 'users' FOR EACH ROW BEGIN
    IF NEW.username IS NOT NULL THEN
        UPDATE markmaps SET author = NEW.username WHERE user = NEW.id;
    END IF;
END
$$
DELIMITER ;