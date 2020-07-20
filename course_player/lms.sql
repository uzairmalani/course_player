/*
SQLyog Professional v13.1.1 (64 bit)
MySQL - 5.7.11 : Database - lms
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`lms` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `lms`;

/*Table structure for table `course` */

DROP TABLE IF EXISTS `course`;

CREATE TABLE `course` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET latin1 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `course` */

insert  into `course`(`id`,`name`) values 
(1,'40 Hour HAZWOPER OSHA Online Training');

/*Table structure for table `course_toc` */

DROP TABLE IF EXISTS `course_toc`;

CREATE TABLE `course_toc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) NOT NULL,
  `level` tinyint(2) NOT NULL,
  `position` int(11) NOT NULL,
  `type` enum('m','l','t','q') NOT NULL COMMENT 'm=module, l=lesson, t=topic, q=quize',
  `type_id` int(11) NOT NULL,
  `module_id` int(11) DEFAULT NULL,
  `lesson_id` int(11) DEFAULT NULL,
  `topic_id` int(11) DEFAULT NULL,
  `quize_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

/*Data for the table `course_toc` */

insert  into `course_toc`(`id`,`course_id`,`level`,`position`,`type`,`type_id`,`module_id`,`lesson_id`,`topic_id`,`quize_id`) values 
(1,1,1,1,'m',1,1,NULL,NULL,NULL),
(2,1,2,1,'t',1,1,NULL,1,NULL),
(3,1,2,2,'t',2,1,NULL,2,NULL),
(4,1,2,3,'t',3,1,NULL,3,NULL),
(5,1,2,4,'l',1,1,1,NULL,NULL),
(6,1,3,1,'t',7,1,1,7,NULL),
(7,1,3,2,'t',8,1,1,8,NULL),
(8,1,3,3,'t',9,1,1,9,NULL),
(9,1,3,4,'t',10,1,1,10,NULL),
(10,1,1,1,'m',2,2,NULL,NULL,NULL),
(11,1,2,1,'t',46,2,NULL,46,NULL),
(12,1,2,1,'t',47,2,NULL,47,NULL),
(13,1,2,1,'t',48,2,NULL,48,NULL),
(14,1,2,4,'l',3,2,3,NULL,NULL),
(15,1,3,1,'t',49,2,3,49,NULL),
(16,1,3,2,'t',50,2,3,50,NULL),
(17,1,3,3,'t',51,2,3,51,NULL),
(18,1,3,4,'t',52,2,3,52,NULL),
(19,1,2,5,'l',2,1,2,NULL,NULL),
(20,1,3,1,'t',26,1,2,26,NULL),
(21,1,3,2,'t',27,1,2,27,NULL),
(22,1,3,3,'t',28,1,2,28,NULL),
(23,1,3,4,'t',29,1,2,29,NULL);

/*Table structure for table `lesson` */

DROP TABLE IF EXISTS `lesson`;

CREATE TABLE `lesson` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `url` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `lesson` */

insert  into `lesson`(`id`,`name`,`url`) values 
(1,'Lesson 1: OSHA AND THE HAZWOPER STANDARD','lesson1.xml'),
(2,'Lesson 2: HAZARD COMMUNICATION','lesson2.xml'),
(3,'Lesson 3: NFPA SYSTEM AND DOT LABELS','lesson3.xml');

/*Table structure for table `module` */

DROP TABLE IF EXISTS `module`;

CREATE TABLE `module` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `url` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `module` */

insert  into `module`(`id`,`name`,`url`) values 
(1,'Module 1: REGULATORY OVERVIEW','module0.xml'),
(2,'Module 2: PLANNING AND ORGANIZATION','module1.xml');

/*Table structure for table `quize` */

DROP TABLE IF EXISTS `quize`;

CREATE TABLE `quize` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `quize` */

/*Table structure for table `topic` */

DROP TABLE IF EXISTS `topic`;

CREATE TABLE `topic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8;

/*Data for the table `topic` */

insert  into `topic`(`id`,`name`) values 
(1,'Module 1'),
(2,'Module Overview'),
(3,'Learning Objectives'),
(7,'Lesson 1:'),
(8,'Hazardous Waste Operations and Emergency Response (HAZWOPER)'),
(9,'The HAZWOPER Regulation'),
(10,'The HAZWOPER Regulation'),
(11,'Scope of the HAZWOPER Standard'),
(12,'Appendices to the HAZWOPER Regulation'),
(13,'Application of the HAZWOPER Standard'),
(14,'HAZWOPER Training'),
(15,'HAZWOPER Training'),
(16,'The HAZWOPER Standard and Other Regulations'),
(17,'Rights and Responsibilities: Employer Responsibilities'),
(18,'Rights and Responsibilities: Employer Rights'),
(19,'Rights and Responsibilities: Employer Responsibilities'),
(20,'Establishment of NIOSH'),
(21,'Hazardous Waste Legislation'),
(22,'Application of the HAZWOPER Standard to Chemical Spills'),
(23,'Application of the HAZWOPER Standard to Chemical Spills'),
(24,'Summary'),
(25,'LESSON QUIZ'),
(26,'Lesson 2:'),
(27,'Hazard Communication'),
(28,'Hazard Communication Standard (HCS)'),
(29,'Substances not covered by HCS'),
(30,'Globally Harmonized System (GHS)'),
(31,'Which substances are covered by the GHS?'),
(32,'Changes to HCS under GHS'),
(33,'Hazardous Material Labeling'),
(34,'Labeling Requirements'),
(35,'Pictograms'),
(36,'Pictograms'),
(37,'Pictograms Categories'),
(38,'Safety Data Sheets (SDSs)'),
(39,'Safety Data Sheets (SDSs) Sections'),
(40,'Safety Data Sheets (SDSs) Sections'),
(41,'Scope of the HAZWOPER Standard'),
(42,'SDSs and Employer Responsibilities'),
(43,'Employee Training'),
(44,'Summary'),
(45,'LESSON QUIZ'),
(46,'PLANNING AND ORGANIZATION'),
(47,'Module Overview'),
(48,'Learning Objectives'),
(49,'NFPA SYSTEM AND DOT LABELS'),
(50,'NFPA 704 Standard'),
(51,'NFPA 704 Standard'),
(52,'BLUE-Health Hazard');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
