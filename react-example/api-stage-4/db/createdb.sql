-- Insert code to drop your other tables here
-- We must drop tables in this order to avoid foreign key constraints failing
-- for instance, we cannot drop users first because 'vote' has a foreign key
-- constraint on it.
-- 
DROP TABLE IF EXISTS `vote`;
DROP TABLE IF EXISTS `answerchoice`;
DROP TABLE IF EXISTS `question`;
DROP TABLE IF EXISTS `users`;

-- Similarly, tables need to be created in this order to ensure a table
-- exists when a foreign key constraint is added that refers to it.
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  KEY `lastname` (`lastname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE  `question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `type` int(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `answerchoice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `questionid` int NOT NULL,
  `position` int NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_Questionid` 
    FOREIGN KEY (`questionid`)
    REFERENCES `question` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `vote` (
  `answerchoiceid` int NOT NULL,
  `userid` int NOT NULL,
  `questionid` int NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`userid`, `questionid`, `answerchoiceid`),
  CONSTRAINT `FK_Userid` 
    FOREIGN KEY (`userid`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `FK_Answer_Questionid`
    FOREIGN KEY (`questionid`, `answerchoiceid`)
    REFERENCES `answerchoice` (`questionid`, `id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;