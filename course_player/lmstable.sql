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

/*Table structure for table `course_tracking` */

DROP TABLE IF EXISTS `course_tracking`;

CREATE TABLE `course_tracking` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `topic_id` int(11) NOT NULL,
  `current_time` varchar(100) DEFAULT NULL,
  `total_duration` varchar(100) DEFAULT NULL,
  `created_on` datetime NOT NULL,
  `updated_on` datetime NOT NULL,
  `is_completed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8;

/*Data for the table `course_tracking` */

insert  into `course_tracking`(`id`,`user_id`,`course_id`,`topic_id`,`current_time`,`total_duration`,`created_on`,`updated_on`,`is_completed`) values 
(47,1,1,1,'6.840794','6.840794','2020-07-25 08:43:26','2020-07-25 08:52:49',1),
(48,1,1,2,'26.687302','26.687302','2020-07-25 08:52:56','2020-07-25 10:02:17',1),
(49,1,1,3,'50.333311','50.333311','2020-07-25 09:32:06','2020-07-27 14:07:53',1),
(50,1,1,8,'55.754263','55.754263','2020-07-25 10:13:20','2020-07-27 14:18:33',1),
(51,1,1,7,'6.330204','6.330204','2020-07-27 14:08:02','2020-07-27 14:08:06',1),
(52,1,1,9,'81.766009','81.766009','2020-07-27 14:18:36','2020-07-27 15:32:15',1),
(53,1,1,10,'34.457071','69.804376','2020-07-27 15:13:38','2020-07-27 05:40:54',0),
(54,1,1,26,'5.396531','5.396531','2020-07-27 05:33:06','2020-07-27 05:33:06',1),
(55,1,1,27,'13.093157','64.357415','2020-07-27 05:33:11','2020-07-27 05:33:21',0);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
