-- MySQL dump 10.16  Distrib 10.1.37-MariaDB, for debian-linux-gnueabihf (armv8l)
--
-- Host: localhost    Database: db2
-- ------------------------------------------------------
-- Server version	10.1.37-MariaDB-0+deb9u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answerchoice`
--

DROP TABLE IF EXISTS `answerchoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `answerchoice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `questionid` int(11) NOT NULL,
  `position` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_Questionid` (`questionid`),
  CONSTRAINT `FK_Questionid` FOREIGN KEY (`questionid`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answerchoice`
--

LOCK TABLES `answerchoice` WRITE;
/*!40000 ALTER TABLE `answerchoice` DISABLE KEYS */;
INSERT INTO `answerchoice` VALUES (6,'Hamburger',2,0),(7,'Cheeseburger',2,1),(8,'Veggieburger',2,2),(9,'Red',1,0),(10,'White',1,1),(11,'Blue',1,2),(12,'Green',1,3),(13,'Yellow',1,4),(14,'Pink',1,5);
/*!40000 ALTER TABLE `answerchoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `type` int(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (1,'What\'s your favorite color?','Choose new one.  Now with expanded choices.',1),(2,'What\'s your favorite food?','Choose only one',1);
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@gmail.com','Administator','The',1,'$2a$12$oqzC/PmLujRWeOaIPwXPfOWjpWb8KrmNEHLP5QaXK/Ap3zzUukxIy','admin'),(2,'email-2@example.com','lastname-2','firstname-2',0,'$2$....','username-2'),(3,'email-3@example.com','lastname-3','firstname-3',0,'newpass','username-3'),(4,'email-4@example.com','lastname-4','firstname-4',0,'$2$....','username-4'),(5,'email-5@example.com','lastname-5','firstname-5',0,'$2$....','username-5'),(6,'email-6@example.com','lastname-6','firstname-6',0,'$2$....','username-6'),(7,'email-7@example.com','lastname-7','firstname-7',0,'$2$....','username-7'),(8,'email-8@example.com','lastname-8','firstname-8',0,'$2$....','username-8'),(9,'email-9@example.com','lastname-9','firstname-9',0,'$2$....','username-9'),(10,'email-10@example.com','lastname-10','firstname-10',0,'$2$....','username-10'),(11,'email-11@example.com','lastname-11','firstname-11',0,'$2$....','username-11'),(12,'email-12@example.com','lastname-12','firstname-12',0,'$2$....','username-12'),(13,'email-13@example.com','lastname-13','firstname-13',0,'$2$....','username-13'),(14,'email-14@example.com','lastname-14','firstname-14',0,'$2$....','username-14'),(15,'email-15@example.com','lastname-15','firstname-15',0,'$2$....','username-15'),(16,'email-16@example.com','lastname-16','firstname-16',0,'$2$....','username-16'),(17,'email-17@example.com','lastname-17','firstname-17',0,'$2$....','username-17'),(18,'email-18@example.com','lastname-18','firstname-18',0,'$2$....','username-18'),(19,'email-19@example.com','lastname-19','firstname-19',0,'$2$....','username-19'),(20,'email-20@example.com','lastname-20','firstname-20',0,'$2$....','username-20'),(21,'email-21@example.com','lastname-21','firstname-21',0,'$2$....','username-21'),(22,'email-22@example.com','lastname-22','firstname-22',0,'$2$....','username-22'),(23,'email-23@example.com','lastname-23','firstname-23',0,'$2$....','username-23'),(24,'email-24@example.com','lastname-24','firstname-24',0,'$2$....','username-24'),(25,'email-25@example.com','lastname-25','firstname-25',0,'$2$....','username-25'),(26,'email-26@example.com','lastname-26','firstname-26',0,'$2$....','username-26'),(27,'email-27@example.com','lastname-27','firstname-27',0,'$2$....','username-27'),(28,'email-28@example.com','lastname-28','firstname-28',0,'$2$....','username-28'),(29,'email-29@example.com','lastname-29','firstname-29',0,'$2$....','username-29'),(30,'email-30@example.com','lastname-30','firstname-30',0,'$2$....','username-30'),(31,'email-31@example.com','lastname-31','firstname-31',0,'$2$....','username-31'),(32,'email-32@example.com','lastname-32','firstname-32',0,'$2$....','username-32'),(33,'email-33@example.com','lastname-33','firstname-33',0,'$2$....','username-33'),(34,'email-34@example.com','lastname-34','firstname-34',0,'$2$....','username-34'),(35,'email-35@example.com','lastname-35','firstname-35',0,'$2$....','username-35'),(38,'kevin.bacon@gmail.com','Bacon','Kevin',0,'$2b$08$LfDnWtbVONaxDNHzmJbR7uh/Bna6lp9o65yE8GeruYV.HlfGxJa2.','baconbitz'),(39,'krazykatz@gmail.com','Kat','Katharine',0,'$2b$08$T8sMFt5WpLBKmn2F/3KpDee3EzvIhz6l2XTzFKzyr3V/oNM.cgHUC','katharinekat33'),(40,'notron@pawney.gov','Silver','Duke',0,'$2b$08$oghwuHtm1y1DzZqgAEVXbOsA.6KEuhlaKWKbR2vfh/Jzo1qLmUfCa','dsilver12');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vote`
--

DROP TABLE IF EXISTS `vote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vote` (
  `answerchoiceid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `questionid` int(11) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userid` (`userid`,`questionid`,`answerchoiceid`),
  KEY `FK_Answer_Questionid` (`questionid`,`answerchoiceid`),
  CONSTRAINT `FK_Answer_Questionid` FOREIGN KEY (`questionid`, `answerchoiceid`) REFERENCES `answerchoice` (`questionid`, `id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_Userid` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vote`
--

LOCK TABLES `vote` WRITE;
/*!40000 ALTER TABLE `vote` DISABLE KEYS */;
INSERT INTO `vote` VALUES (7,1,2,2);
/*!40000 ALTER TABLE `vote` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-26 17:04:04
