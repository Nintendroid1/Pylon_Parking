-- MySQL dump 10.13  Distrib 5.7.25, for Linux (x86_64)
--
-- Host: localhost    Database: db1
-- ------------------------------------------------------
-- Server version	5.7.25-0ubuntu0.18.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
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
  `questionid` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `position` tinyint(3) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `question_must_exist` (`questionid`),
  CONSTRAINT `question_must_exist` FOREIGN KEY (`questionid`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answerchoice`
--

LOCK TABLES `answerchoice` WRITE;
/*!40000 ALTER TABLE `answerchoice` DISABLE KEYS */;
INSERT INTO `answerchoice` VALUES (1,'English',0,1),(1,'Spanish',1,2),(1,'French',2,3),(1,'Japanese',3,4),(1,'Vulcan',4,5),(2,'JavaScript',0,6),(2,'Java',1,7),(2,'C++',2,8),(2,'Python',3,9),(2,'C',4,10),(2,'Ruby',5,11),(2,'R',6,12),(11,'Union',0,13),(11,'Intersection',1,14),(11,'Difference',2,15),(11,'Symmetric Difference',3,16),(3,'January',0,17),(3,'February',1,18),(3,'March',2,19),(3,'April',3,20),(3,'May',4,21),(3,'June',5,22),(3,'July',6,23),(3,'August',7,24),(3,'September',8,25),(3,'October',9,26),(3,'November',10,27),(3,'December',11,28),(8,'Alpha',0,29),(8,'Beta',1,30),(8,'Gamma',2,31),(8,'Theta',3,32),(8,'Omega',4,33),(9,'SELECT',0,34),(9,'DELETE',1,35),(9,'UPDATE',2,36),(9,'INSERT',3,37),(7,'Dinic',0,38),(7,'Ford-Fulkerson',1,39),(7,'Edmonds-Karp',2,40),(7,'Ahuja-Orlin ISAP',3,41),(7,'Goldberg\'s Push-Relabel',4,42),(5,'Superman',0,43),(5,'Wonder Woman',1,44),(5,'Asterix',2,45),(5,'Black Panther',3,46),(5,'Captain America',4,47),(5,'Catwoman',5,48),(4,'Hamburger',0,49),(4,'Cheeseburger',1,50),(4,'Pizza',2,51),(4,'French Fries',3,52),(4,'Salad',4,53),(10,'Red',0,54),(10,'White',1,55),(10,'Blue',2,56),(10,'Green',3,57),(10,'Yellow',4,58),(6,'Adventure',0,59),(6,'Thriller',1,60),(6,'Drama',2,61),(6,'Comedy',3,62),(6,'RomComs',4,63),(12,'0',0,64),(12,'1',1,65),(12,'e',2,66),(12,'π',3,67),(12,'i',4,68),(13,'Dijkstra',0,69),(13,'Bellmann-Ford',1,70),(13,'Floyd-Warshall',2,71),(14,'Winter',0,72),(14,'Spring',1,73),(14,'Summer',2,74),(14,'Fall',3,75),(15,'North America',0,76),(15,'South America',1,77),(15,'Europe',2,78),(15,'Asia',3,79),(15,'Africa',4,80),(15,'Australia',5,81),(15,'Antarctica',6,82),(16,'TON 618',0,83),(16,'IC 1101',1,84),(16,'S5 0014+81',2,85),(16,'SDSS J102325.31+514251.0',3,86),(16,'NGC 6166',4,87),(17,'Game of Thrones',0,88),(17,'Silicon Valley',1,89),(17,'The Big Bang Theory',2,90);
/*!40000 ALTER TABLE `answerchoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question` (
  `question` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `type` tinyint(2) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES ('What\'s your favorite language?','Please choose one.',1,1),('What\'s your favorite programming language?','Please choose one.',1,2),('What\'s your favorite month?','Please choose one.',1,3),('What\'s your favorite food?','Please choose one.',1,4),('Who is your favorite Superhero?','Please choose one.',1,5),('What types of movies do you like to watch?','Please choose one.',1,6),('What is your favorite maxflow algorithm?','Please choose one.',1,7),('What is your favorite greek letter?','Please choose one.',1,8),('What is your favorite SQL query?','Please choose one.',1,9),('What\'s your favorite color?','Please choose one.',1,10),('What is your favorite operation on sets?','Please choose one.',1,11),('What is your favorite complex number?','Please choose one.',1,12),('What is your favorite shortest path algorithm?','Please choose one.',1,13),('What is your favorite season?','Please choose one.',1,14),('What is your favorite continent?','Please choose one.',1,15),('What is your favorite black hole?','Please choose one.',1,16),('What\'s your favorite TV show?','Please choose one.',1,17);
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
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@gmail.com','Administrator','The',1,'$2b$12$ORzuntJ5V5UzCaX9oLLYcuzEKgJMyU3w7haZE4y3RROebttQLK.3a','admin'),(2,'petronila@petronila.com','Pando','Petronila',0,'$2b$08$HMGR2MsUMap1J9YhtK8Blu4AjCsRYvWoPkLHJCfLE3fmU6hHHr8D.','ppando'),(3,'joaquin@joaquin.com','Julia','Joaquin',0,'$2b$08$r7U8TmtBZpmnBjBUCJxZXeGeAE/5P5roosSqDzRp9XRLSRqc6dJZO','jjulia'),(4,'jeramy@jeramy.com','Jarrett','Jeramy',0,'$2b$08$11.Sb4.p/3Lp1JLgASE6Tex8gd3FyHmkxEd5ZdJsZXi15zxFn1186','jjarrett'),(5,'mitsue@mitsue.com','Mandel','Mitsue',0,'$2b$08$/u9Fh6zWa7go8ML.VkLhT.37iKTbOhCICD1tEBp3AXL1wMyFgrRGm','mmandel'),(6,'alfonso@alfonso.com','Able','Alfonso',0,'$2b$08$LSshfo2KFP03qkU01piMMuv0UTUCsG0LjhWHmAKKFwugvqQYHNqIy','aable'),(7,'rae@rae.com','Rubalcava','Rae',0,'$2b$08$Zwl9DYmIaDPl8JswYc9JZezL9pcXTppwSQW.Z2e/3.s1PFbs0EQg6','rrubalcava'),(8,'ezra@ezra.com','Edison','Ezra',0,'$2b$08$dCM67RLjgV8ZKcbLnhU/4Os5Iok4lrfr.qvlSRCxZ8pL6ME4/O6da','eedison'),(9,'dierdre@dierdre.com','Demeo','Dierdre',0,'$2b$08$QBAxUb1eZfcTYSx0RxQqQ..NUgAWHUgQPEI/lKV0DO0PqqD/41JhW','ddemeo'),(10,'marnie@marnie.com','Mendes','Marnie',0,'$2b$08$y3bhXnIJyxjRmQbNk9hZweF2x4g3KGLJzdcAmkH8OcT15FuEbVByi','mmendes'),(11,'eve@eve.com','Eller','Eve',0,'$2b$08$4MVU12g2.88xEXcI1Y1hd.gboPVLSnbquB8zdXhThDI4zHSIU5JZy','eeller'),(12,'velda@velda.com','Vogel','Velda',0,'$2b$08$GLuqUAtnuMk.VUSPrazBEuwAOutrOGp9S29rzo6j3/v.0hJU5L/ai','vvogel'),(13,'stanton@stanton.com','Sine','Stanton',0,'$2b$08$PbkKudpTdxCUgu/XYcoV7.iiELYevVySTKG5BVhJ2mzhfcIoBV5FO','ssine'),(14,'ona@ona.com','Oakland','Ona',0,'$2b$08$xbIbodsvSpqEYUjV/W20leHxk1FnqKEN5phRA8XUC12nuhdC7pkiK','ooakland'),(15,'isaura@isaura.com','Icenhour','Isaura',0,'$2b$08$psENaPbq2IZRzluMYPK0A.HUeV0.ggzXfRgHFDYWKC37Om9jca2Fa','iicenhour'),(16,'ali@ali.com','Aguillard','Ali',0,'$2b$08$PbPVs.y.GzR9Xj0Kc8XXu.qg0YMncXff7Qkq7X0bgTRhOcKH1pSCW','aaguillard'),(17,'corina@corina.com','Cleveland','Corina',0,'$2b$08$KcN9JgcrrzBVGZs7c.jhQ.Zy9QPWRc.FQuc.tGaJIU69eHv2pSaXO','ccleveland'),(18,'jacalyn@jacalyn.com','Joachim','Jacalyn',0,'$2b$08$LgkEMeUYGyeFKsZoTAHlWOxRFTu198QTHzcmwi7is7KmZfM2wAtD.','jjoachim'),(19,'lucinda@lucinda.com','Lamacchia','Lucinda',0,'$2b$08$lBFzqK9vfDJ/UuWKSjFDvu99G2TvEiCvE8P2Cj7I.jIhmGVwWrwQO','llamacchia'),(20,'donnette@donnette.com','Dorner','Donnette',0,'$2b$08$JRCC6FrnrI/HrhzbTnTSgeGSXyQPclP/I9nP9u1sU7.lDQK3pB6h2','ddorner'),(21,'mac@mac.com','Massey','Mac',0,'$2b$08$MgTMA5TO4SdAsApcY/V4SeH1NX/CQilGuNmqcyqMQsr3X/rI4YbHO','mmassey'),(22,'jc@jc.com','Justice','Jc',0,'$2b$08$6edJu2ncYKU2xllkPnQLbOFPZ6oXCaNfR2ERuixN3D9PlwYkHdBBO','jjustice'),(23,'angle@angle.com','Amador','Angle',0,'$2b$08$CWwpqtYJKM7FkvLtVhsWOO/KSgmVXoxpMVNUGSu5.69vHKnJpExAe','aamador'),(24,'roxanne@roxanne.com','Rasnake','Roxanne',0,'$2b$08$ZRZxU0egNh7kmduWBopB8.wb0nQmZ9FP1.5kY0UdaFusDh02/hTiu','rrasnake'),(25,'elliot@elliot.com','Ealy','Elliot',0,'$2b$08$xBGz7NKxNeMsDc/aX3yIFeyhb71aAIS.7x26GXUm5VXEPJ0FnRuLC','eealy'),(26,'darcie@darcie.com','Dillahunt','Darcie',0,'$2b$08$ZFDF8yjobQ2DrEdYXneizu4IQVAnnywO/gYW2O4r2Z7gDWui7ylvC','ddillahunt'),(27,'akilah@akilah.com','Arena','Akilah',0,'$2b$08$7cD42UF4fkbZq3u7iuVE6eAt9c1h37RTYC04N3kwPMLaA6XZXSKQy','aarena'),(28,'aura@aura.com','Amon','Aura',0,'$2b$08$AA1A/GVwfbYFKSFHaEwpiO9IWMs9Aep/Wxp8llVU/gACGPRj6Ba4C','aamon'),(29,'letha@letha.com','Luebke','Letha',0,'$2b$08$zGk.cRZQwkofZdWKRSkNtOgPidLC4FdBZAN7VivTaojAcEHL1aSK.','lluebke'),(30,'elias@elias.com','Ebersole','Elias',0,'$2b$08$N1Y3qIWvpbyNwUOH224ak.0qJULb860ay.QUURUFkIo6jMaGTBtTO','eebersole'),(31,'ezekiel@ezekiel.com','Ehrman','Ezekiel',0,'$2b$08$S7DKLA3ZYVZSUWPA.iHWv.G6blVxQCHfuE7WcOH2omyRLG2Tbqs4G','eehrman'),(32,'buffy@buffy.com','Bax','Buffy',0,'$2b$08$Std9zlpgScSHU7r4JNCJa.f7d.N5nHrkFcRXDngc8H3Vsb4iebt4a','bbax'),(33,'miki@miki.com','Mucha','Miki',0,'$2b$08$82QW1CfxiNNpSF439HLeDeBu7.he7FeMXs5V3lv0QLONvQEYHUc2q','mmucha'),(34,'avril@avril.com','Abshire','Avril',0,'$2b$08$Y4aXrSqq1WYf2f.XYSoZSu9Nk73fTCOfOCR2MwwjCH7h5nEf9aFcC','aabshire'),(35,'vivienne@vivienne.com','Vandervoort','Vivienne',0,'$2b$08$Bwmr2pmxaUwFeHTBLuR2Ped9Tdrov40zG1Ds.AYfToMu2z8Ux.o32','vvandervoort'),(36,'dwana@dwana.com','Danielson','Dwana',0,'$2b$08$NA9AMbHCk2Po3NPAYjc9O.TORTUj5be1lY1yT5/DeBvyaNvBVl3yG','ddanielson'),(37,'stuart@stuart.com','Sokoloski','Stuart',0,'$2b$08$rm24.paxtpeGOH/9CN0b6ezmqNQslmHwtQr/bjhvZdypwZp84keOe','ssokoloski'),(38,'samella@samella.com','Saint','Samella',0,'$2b$08$X/xbhJSAw9BGiUj0RXbUHOvCioARiTaBJ0ZqVZbZl9yqsLZs/SQHC','ssaint'),(39,'charise@charise.com','Caron','Charise',0,'$2b$08$jACh6cNl4zoIwL1bXiwklOsyuqpOoCaIR1BG5EzQGUNYSVooc/PqS','ccaron'),(40,'arnold@arnold.com','Attebery','Arnold',0,'$2b$08$dzRhG1vP2S92XO7ai3NQOOWn975ni3FHx6u2HMYTp0a/d6iQ8kwo2','aattebery'),(41,'elden@elden.com','Estell','Elden',0,'$2b$08$PmoOdRrmmdQYF5p803QvvOFIPgje6ZkCXlROzb7na36WxSAh2fCHO','eestell'),(42,'mellisa@mellisa.com','Mclennan','Mellisa',0,'$2b$08$J0h7YAC.zlvsXnMOCQUIZ.FUcABdLNBSLxzlZ9YXpKSzeqEJh4476','mmclennan'),(43,'adalberto@adalberto.com','Aquilino','Adalberto',0,'$2b$08$mNgtiu4diMC0MiyvS0cuye.oMgB4xArNbtyMcKgjCd8E872Mv7V4.','aaquilino'),(44,'karon@karon.com','Kinney','Karon',0,'$2b$08$QOHEeLLyKR5/kMErOc4WOuYOt2x7IRnuFjSKKmnl4YnkYNwn0RmOa','kkinney'),(45,'josephina@josephina.com','Jablonowski','Josephina',0,'$2b$08$7JftKM1CfLqO3JD2n632JOvBTWg2pSKPzRKB2bqSVkecR6SPivMfC','jjablonowski'),(46,'susanne@susanne.com','Shead','Susanne',0,'$2b$08$uDxZw0.OCdu6EaN8vx28dOcpwP5H9JExTzEALtf9oYcGTgyBHTiuq','sshead'),(47,'antone@antone.com','Allie','Antone',0,'$2b$08$VwlWkCq0l0IirLRfpm5GReJY6ll2TaBCCUWBPYGl26dVp7WF2zH1K','aallie'),(48,'federico@federico.com','Flach','Federico',0,'$2b$08$OdsRLuW8YrRtGI5/y9YjIe/ETH/ZfC6RheUDbfnlfeCnfX5qGgtaO','fflach'),(49,'tory@tory.com','Toles','Tory',0,'$2b$08$aDD1/Uo9vQ6jC608lHQ/qehkuPXc4xBxD7jPDadiHMp4UxZWq75Hm','ttoles'),(50,'anna@anna.com','Abramson','Anna',0,'$2b$08$w1KCzEFALUQr2B4Xa.JIKOIU/J/ZnsPD96aotBuIRjrgBWXE.Cv0y','aabramson'),(51,'gretchen@gretchen.com','Garfield','Gretchen',0,'$2b$08$RG5BecsaT7JFffNgwEP0DujPb4GF2xofkWjZ0JGxpFORvPYmfTfri','ggarfield'),(52,'s','s','s',0,'$2b$08$KLXj/7lZbDb9efM2lngf4eX9HSzOqesxCQl31vgqCm0qFpv93Hcmy','s');
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
  KEY `question_and_answer_must_exist` (`questionid`,`answerchoiceid`),
  CONSTRAINT `question_and_answer_must_exist` FOREIGN KEY (`questionid`, `answerchoiceid`) REFERENCES `answerchoice` (`questionid`, `id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_must_exist` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=875 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vote`
--

LOCK TABLES `vote` WRITE;
/*!40000 ALTER TABLE `vote` DISABLE KEYS */;
INSERT INTO `vote` VALUES (5,2,1,3),(7,2,2,2),(23,2,3,1),(53,2,4,5),(44,2,5,7),(60,2,6,6),(39,2,7,8),(29,2,8,9),(35,2,9,10),(58,2,10,4),(13,2,11,11),(65,2,12,12),(71,2,13,13),(74,2,14,14),(80,2,15,15),(83,2,16,16),(88,2,17,17),(3,3,1,172),(10,3,2,173),(17,3,3,174),(52,3,4,175),(44,3,5,177),(60,3,6,176),(42,3,7,178),(30,3,8,179),(35,3,9,180),(54,3,10,171),(14,3,11,181),(65,3,12,182),(69,3,13,183),(73,3,14,184),(80,3,15,185),(87,3,16,186),(90,3,17,187),(5,4,1,19),(12,4,2,20),(28,4,3,21),(49,4,4,22),(45,4,5,24),(60,4,6,23),(42,4,7,25),(29,4,8,26),(37,4,9,27),(56,4,10,18),(16,4,11,28),(67,4,12,29),(71,4,13,30),(74,4,14,31),(82,4,15,32),(85,4,16,33),(88,4,17,34),(2,5,1,36),(7,5,2,37),(23,5,3,38),(52,5,4,39),(44,5,5,41),(59,5,6,40),(39,5,7,42),(31,5,8,43),(36,5,9,44),(55,5,10,35),(13,5,11,45),(67,5,12,46),(69,5,13,47),(74,5,14,48),(79,5,15,49),(86,5,16,50),(88,5,17,51),(1,6,1,53),(12,6,2,54),(23,6,3,55),(51,6,4,56),(44,6,5,58),(62,6,6,57),(41,6,7,59),(30,6,8,60),(35,6,9,61),(56,6,10,52),(13,6,11,62),(65,6,12,63),(71,6,13,64),(73,6,14,65),(76,6,15,66),(84,6,16,67),(88,6,17,68),(1,7,1,70),(10,7,2,71),(17,7,3,72),(52,7,4,73),(45,7,5,75),(63,7,6,74),(39,7,7,76),(29,7,8,77),(35,7,9,78),(57,7,10,69),(14,7,11,79),(67,7,12,80),(69,7,13,81),(73,7,14,82),(80,7,15,83),(84,7,16,84),(88,7,17,85),(2,8,1,87),(10,8,2,88),(22,8,3,89),(49,8,4,90),(48,8,5,92),(63,8,6,91),(38,8,7,93),(29,8,8,94),(35,8,9,95),(56,8,10,86),(15,8,11,96),(68,8,12,97),(71,8,13,98),(75,8,14,99),(79,8,15,100),(85,8,16,101),(90,8,17,102),(3,9,1,104),(12,9,2,105),(19,9,3,106),(53,9,4,107),(47,9,5,109),(62,9,6,108),(41,9,7,110),(30,9,8,111),(37,9,9,112),(56,9,10,103),(16,9,11,113),(66,9,12,114),(71,9,13,118),(72,9,14,115),(81,9,15,116),(86,9,16,117),(89,9,17,119),(4,10,1,121),(7,10,2,122),(23,10,3,123),(51,10,4,124),(48,10,5,126),(63,10,6,125),(40,10,7,127),(30,10,8,128),(36,10,9,129),(56,10,10,120),(14,10,11,130),(65,10,12,131),(69,10,13,132),(75,10,14,133),(80,10,15,134),(87,10,16,135),(90,10,17,136),(1,11,1,155),(9,11,2,156),(20,11,3,157),(51,11,4,158),(48,11,5,160),(60,11,6,159),(39,11,7,161),(29,11,8,162),(34,11,9,163),(57,11,10,154),(13,11,11,164),(66,11,12,165),(70,11,13,166),(74,11,14,167),(80,11,15,168),(85,11,16,169),(90,11,17,170),(4,12,1,138),(12,12,2,139),(19,12,3,140),(53,12,4,141),(48,12,5,143),(60,12,6,142),(38,12,7,144),(29,12,8,145),(37,12,9,146),(54,12,10,137),(13,12,11,147),(68,12,12,148),(70,12,13,149),(74,12,14,150),(82,12,15,151),(87,12,16,152),(90,12,17,153),(4,13,1,189),(11,13,2,190),(24,13,3,191),(49,13,4,192),(47,13,5,194),(60,13,6,193),(40,13,7,195),(29,13,8,196),(35,13,9,197),(54,13,10,188),(15,13,11,198),(65,13,12,199),(70,13,13,200),(73,13,14,201),(77,13,15,202),(83,13,16,203),(90,13,17,204),(3,14,1,223),(12,14,2,224),(21,14,3,225),(53,14,4,226),(47,14,5,228),(60,14,6,227),(42,14,7,229),(29,14,8,230),(36,14,9,231),(58,14,10,222),(14,14,11,232),(65,14,12,233),(71,14,13,234),(74,14,14,235),(77,14,15,236),(83,14,16,237),(90,14,17,238),(5,15,1,206),(12,15,2,207),(20,15,3,208),(51,15,4,209),(45,15,5,211),(62,15,6,210),(38,15,7,212),(33,15,8,213),(34,15,9,214),(55,15,10,205),(14,15,11,215),(67,15,12,216),(71,15,13,217),(74,15,14,218),(79,15,15,219),(85,15,16,220),(90,15,17,221),(1,16,1,240),(12,16,2,241),(26,16,3,242),(51,16,4,243),(47,16,5,245),(59,16,6,244),(40,16,7,246),(29,16,8,247),(35,16,9,248),(56,16,10,239),(16,16,11,249),(65,16,12,250),(69,16,13,251),(75,16,14,252),(80,16,15,253),(86,16,16,254),(90,16,17,255),(1,17,1,257),(8,17,2,258),(18,17,3,259),(52,17,4,260),(45,17,5,262),(63,17,6,261),(40,17,7,263),(32,17,8,264),(37,17,9,543),(56,17,10,256),(13,17,11,542),(65,17,12,541),(70,17,13,540),(72,17,14,539),(77,17,15,538),(86,17,16,537),(89,17,17,536),(2,18,1,595),(12,18,2,596),(27,18,3,597),(49,18,4,598),(43,18,5,600),(62,18,6,599),(38,18,7,601),(29,18,8,602),(37,18,9,603),(58,18,10,698),(16,18,11,604),(66,18,12,605),(69,18,13,606),(72,18,14,607),(77,18,15,608),(85,18,16,609),(90,18,17,610),(5,19,1,682),(7,19,2,683),(17,19,3,684),(51,19,4,685),(43,19,5,687),(59,19,6,686),(41,19,7,688),(29,19,8,689),(34,19,9,690),(58,19,10,681),(14,19,11,691),(66,19,12,692),(71,19,13,693),(73,19,14,694),(80,19,15,695),(85,19,16,696),(90,19,17,697),(2,20,1,534),(10,20,2,533),(20,20,3,532),(53,20,4,531),(48,20,5,529),(59,20,6,530),(42,20,7,528),(32,20,8,527),(37,20,9,526),(55,20,10,535),(14,20,11,525),(67,20,12,524),(69,20,13,523),(72,20,14,522),(76,20,15,521),(86,20,16,520),(88,20,17,519),(2,21,1,517),(9,21,2,516),(20,21,3,515),(53,21,4,699),(45,21,5,701),(63,21,6,700),(39,21,7,702),(31,21,8,514),(34,21,9,673),(57,21,10,518),(13,21,11,674),(66,21,12,675),(70,21,13,676),(75,21,14,677),(78,21,15,678),(86,21,16,679),(88,21,17,680),(4,22,1,612),(11,22,2,613),(18,22,3,614),(50,22,4,615),(48,22,5,617),(61,22,6,616),(40,22,7,618),(30,22,8,619),(36,22,9,620),(57,22,10,611),(15,22,11,621),(64,22,12,622),(70,22,13,623),(73,22,14,624),(79,22,15,625),(83,22,16,626),(88,22,17,627),(3,23,1,629),(8,23,2,265),(22,23,3,266),(52,23,4,267),(44,23,5,269),(62,23,6,268),(39,23,7,270),(29,23,8,271),(34,23,9,272),(55,23,10,628),(16,23,11,273),(65,23,12,274),(71,23,13,275),(72,23,14,276),(76,23,15,277),(83,23,16,630),(88,23,17,631),(3,24,1,650),(6,24,2,651),(25,24,3,652),(49,24,4,653),(44,24,5,655),(60,24,6,654),(38,24,7,656),(31,24,8,657),(34,24,9,658),(54,24,10,649),(16,24,11,659),(65,24,12,660),(71,24,13,661),(75,24,14,662),(79,24,15,663),(84,24,16,664),(89,24,17,665),(3,25,1,633),(8,25,2,634),(26,25,3,635),(50,25,4,636),(43,25,5,638),(61,25,6,637),(42,25,7,639),(33,25,8,640),(34,25,9,641),(54,25,10,632),(13,25,11,642),(66,25,12,643),(71,25,13,644),(74,25,14,645),(81,25,15,646),(83,25,16,647),(89,25,17,648),(5,26,1,667),(12,26,2,668),(17,26,3,669),(49,26,4,670),(45,26,5,672),(61,26,6,671),(38,26,7,728),(33,26,8,727),(37,26,9,726),(56,26,10,666),(14,26,11,725),(64,26,12,724),(70,26,13,723),(73,26,14,722),(82,26,15,721),(85,26,16,720),(88,26,17,719),(5,27,1,717),(12,27,2,716),(18,27,3,715),(52,27,4,714),(47,27,5,712),(63,27,6,713),(41,27,7,711),(30,27,8,710),(35,27,9,709),(56,27,10,718),(16,27,11,708),(68,27,12,707),(69,27,13,706),(74,27,14,705),(76,27,15,704),(86,27,16,703),(90,27,17,591),(1,28,1,593),(10,28,2,594),(19,28,3,580),(50,28,4,581),(43,28,5,583),(63,28,6,582),(42,28,7,584),(31,28,8,585),(37,28,9,586),(58,28,10,592),(14,28,11,587),(68,28,12,588),(71,28,13,589),(75,28,14,590),(78,28,15,544),(84,28,16,545),(89,28,17,546),(3,29,1,548),(9,29,2,549),(17,29,3,550),(49,29,4,551),(45,29,5,553),(63,29,6,552),(38,29,7,554),(29,29,8,555),(35,29,9,556),(54,29,10,547),(14,29,11,557),(64,29,12,558),(70,29,13,559),(74,29,14,560),(80,29,15,561),(84,29,16,562),(89,29,17,563),(3,30,1,565),(7,30,2,566),(22,30,3,567),(53,30,4,568),(47,30,5,570),(62,30,6,569),(41,30,7,571),(31,30,8,572),(37,30,9,573),(54,30,10,564),(14,30,11,574),(65,30,12,575),(70,30,13,576),(74,30,14,577),(80,30,15,578),(84,30,16,579),(90,30,17,513),(5,31,1,511),(11,31,2,510),(19,31,3,278),(49,31,4,279),(43,31,5,281),(63,31,6,280),(42,31,7,282),(30,31,8,283),(36,31,9,284),(57,31,10,512),(16,31,11,285),(64,31,12,286),(70,31,13,287),(75,31,14,288),(76,31,15,289),(87,31,16,290),(90,31,17,291),(1,32,1,293),(8,32,2,294),(17,32,3,295),(51,32,4,296),(48,32,5,298),(59,32,6,297),(39,32,7,299),(29,32,8,300),(35,32,9,301),(58,32,10,292),(13,32,11,302),(65,32,12,303),(69,32,13,304),(72,32,14,305),(77,32,15,306),(86,32,16,307),(89,32,17,308),(2,33,1,310),(9,33,2,311),(22,33,3,312),(51,33,4,313),(43,33,5,315),(61,33,6,314),(42,33,7,316),(30,33,8,317),(36,33,9,318),(54,33,10,309),(13,33,11,319),(66,33,12,320),(70,33,13,321),(73,33,14,322),(80,33,15,323),(84,33,16,324),(90,33,17,325),(3,34,1,327),(9,34,2,509),(19,34,3,508),(52,34,4,507),(43,34,5,505),(60,34,6,506),(39,34,7,504),(33,34,8,503),(37,34,9,502),(55,34,10,326),(14,34,11,501),(68,34,12,500),(70,34,13,499),(75,34,14,498),(81,34,15,497),(83,34,16,496),(89,34,17,495),(5,35,1,493),(8,35,2,492),(23,35,3,491),(49,35,4,490),(46,35,5,488),(60,35,6,489),(39,35,7,487),(31,35,8,486),(35,35,9,485),(58,35,10,494),(14,35,11,484),(66,35,12,483),(69,35,13,482),(74,35,14,481),(77,35,15,480),(83,35,16,479),(90,35,17,478),(2,36,1,476),(8,36,2,475),(21,36,3,474),(49,36,4,473),(44,36,5,471),(63,36,6,472),(41,36,7,470),(33,36,8,469),(34,36,9,468),(57,36,10,477),(16,36,11,467),(66,36,12,466),(70,36,13,465),(73,36,14,464),(82,36,15,463),(87,36,16,462),(89,36,17,461),(3,37,1,459),(8,37,2,458),(22,37,3,457),(49,37,4,456),(48,37,5,454),(63,37,6,455),(40,37,7,453),(32,37,8,452),(34,37,9,451),(55,37,10,460),(16,37,11,450),(66,37,12,449),(69,37,13,448),(73,37,14,447),(77,37,15,446),(85,37,16,445),(89,37,17,444),(3,38,1,442),(7,38,2,441),(24,38,3,440),(50,38,4,439),(45,38,5,437),(63,38,6,438),(41,38,7,436),(31,38,8,435),(37,38,9,434),(56,38,10,443),(15,38,11,433),(67,38,12,432),(69,38,13,431),(75,38,14,430),(82,38,15,429),(83,38,16,428),(88,38,17,427),(3,39,1,425),(6,39,2,424),(27,39,3,423),(51,39,4,422),(45,39,5,420),(60,39,6,421),(39,39,7,419),(30,39,8,418),(37,39,9,417),(57,39,10,426),(13,39,11,416),(64,39,12,415),(69,39,13,414),(72,39,14,413),(81,39,15,412),(83,39,16,411),(89,39,17,410),(5,40,1,391),(7,40,2,390),(23,40,3,389),(50,40,4,388),(48,40,5,386),(61,40,6,387),(42,40,7,385),(30,40,8,328),(35,40,9,329),(55,40,10,392),(14,40,11,330),(65,40,12,331),(70,40,13,332),(72,40,14,333),(77,40,15,334),(85,40,16,335),(89,40,17,336),(3,41,1,408),(6,41,2,407),(25,41,3,406),(49,41,4,405),(46,41,5,403),(63,41,6,404),(42,41,7,402),(32,41,8,401),(36,41,9,400),(55,41,10,409),(13,41,11,399),(64,41,12,398),(71,41,13,397),(73,41,14,396),(81,41,15,395),(84,41,16,394),(88,41,17,393),(2,42,1,338),(9,42,2,339),(18,42,3,340),(51,42,4,341),(47,42,5,343),(61,42,6,342),(42,42,7,344),(32,42,8,345),(35,42,9,346),(58,42,10,337),(13,42,11,347),(65,42,12,348),(71,42,13,349),(75,42,14,350),(82,42,15,351),(85,42,16,352),(88,42,17,353),(3,43,1,355),(10,43,2,356),(18,43,3,357),(49,43,4,358),(44,43,5,360),(59,43,6,359),(40,43,7,361),(33,43,8,362),(35,43,9,363),(58,43,10,354),(14,43,11,364),(67,43,12,365),(71,43,13,366),(73,43,14,367),(79,43,15,368),(83,43,16,369),(88,43,17,370),(5,44,1,372),(12,44,2,373),(24,44,3,374),(49,44,4,375),(46,44,5,729),(62,44,6,376),(41,44,7,730),(32,44,8,731),(37,44,9,732),(55,44,10,371),(13,44,11,733),(65,44,12,734),(71,44,13,735),(73,44,14,736),(77,44,15,737),(85,44,16,738),(88,44,17,739),(4,45,1,741),(12,45,2,742),(26,45,3,743),(51,45,4,744),(47,45,5,746),(60,45,6,745),(38,45,7,747),(33,45,8,748),(37,45,9,749),(57,45,10,740),(16,45,11,750),(68,45,12,751),(71,45,13,752),(75,45,14,753),(76,45,15,754),(87,45,16,755),(90,45,17,756),(5,46,1,758),(12,46,2,759),(25,46,3,760),(53,46,4,761),(47,46,5,763),(59,46,6,762),(41,46,7,764),(31,46,8,765),(37,46,9,766),(55,46,10,757),(15,46,11,767),(68,46,12,768),(70,46,13,769),(75,46,14,770),(78,46,15,771),(87,46,16,772),(88,46,17,773),(4,47,1,775),(9,47,2,776),(26,47,3,777),(50,47,4,778),(44,47,5,780),(61,47,6,779),(41,47,7,781),(30,47,8,782),(35,47,9,783),(54,47,10,774),(16,47,11,784),(65,47,12,785),(70,47,13,786),(72,47,14,787),(79,47,15,788),(84,47,16,789),(90,47,17,790),(4,48,1,792),(8,48,2,793),(17,48,3,794),(52,48,4,795),(44,48,5,797),(62,48,6,796),(38,48,7,798),(29,48,8,799),(37,48,9,800),(57,48,10,791),(13,48,11,801),(64,48,12,802),(70,48,13,803),(74,48,14,804),(80,48,15,805),(84,48,16,806),(89,48,17,807),(1,49,1,809),(11,49,2,810),(26,49,3,811),(50,49,4,812),(45,49,5,814),(60,49,6,813),(38,49,7,815),(32,49,8,816),(35,49,9,817),(57,49,10,808),(16,49,11,818),(65,49,12,819),(69,49,13,820),(74,49,14,821),(79,49,15,822),(84,49,16,823),(90,49,17,824),(1,50,1,826),(11,50,2,827),(18,50,3,828),(49,50,4,829),(44,50,5,831),(60,50,6,830),(42,50,7,832),(33,50,8,833),(36,50,9,834),(55,50,10,825),(13,50,11,835),(68,50,12,836),(71,50,13,837),(73,50,14,838),(79,50,15,839),(86,50,16,840),(90,50,17,841),(1,51,1,843),(10,51,2,844),(19,51,3,845),(52,51,4,846),(46,51,5,848),(59,51,6,847),(38,51,7,849),(33,51,8,850),(35,51,9,377),(56,51,10,842),(15,51,11,378),(65,51,12,379),(71,51,13,380),(75,51,14,381),(78,51,15,382),(86,51,16,383),(88,51,17,384),(2,52,1,874);
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

-- Dump completed on 2019-04-26 17:27:01
