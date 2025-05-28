-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 28, 2025 at 05:05 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `identity_service`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
('2d55f945-236f-43a3-8227-2017537ebdc4', 'Rang Ham Mat'),
('a2795a14-8232-45fd-bab7-8b9895831603', 'Kham Khoa Ngoai'),
('d473830b-b772-4483-aa38-239560edaf61', 'Kham Khoa Noi');

-- --------------------------------------------------------

--
-- Table structure for table `doctor_user`
--

CREATE TABLE `doctor_user` (
  `id` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `room_id` varchar(255) DEFAULT NULL,
  `server_clinic_id` varchar(255) NOT NULL,
  `time_work_id` varchar(255) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctor_user`
--

INSERT INTO `doctor_user` (`id`, `description`, `room_id`, `server_clinic_id`, `time_work_id`, `user_id`) VALUES
('1a92400d-8711-4d1c-908a-d107959ad339', 'Co nhieu nam kinh nghiem', 'ffe45e42-600b-45dd-a9c1-96fec95e794e', 'dcc0af48-93ac-4596-b68c-0e661d6de971', 'e0b0f972-b5d3-45ac-a72b-e8df93627c83', '4f3dbb15-b7e3-43dd-8c7b-3cc9ae6bf706'),
('72fbb81a-4079-4e55-bb3c-4a880f3c12d4', '3 nam kinh nghiem nha khoa', 'b9d0c9be-f7e4-4629-b8da-251e709c3b0d', '2ad8ac2c-3272-42e1-8fb5-8dc131a0dd01', 'e0b0f972-b5d3-45ac-a72b-e8df93627c83', 'ae78aff0-76a6-4c98-8cb0-6972fd88fd3d'),
('c8e363df-eddb-4c2f-8125-20714e805aa9', 'Chua Vay Nen Hieu Qua', 'ded74115-fd59-46d9-b472-32cb4518dfd1', '3e8c04dc-511d-47ea-bb33-ffedf43097c8', 'd5dcbe85-d905-446e-8736-dc33989917cb', 'd053ef77-51f6-4957-956f-1f8631b48b5c'),
('e06e46e2-057c-402d-99ad-7a12e2dacf82', 'Nhieu Nam Kinh Nghiem', 'f2315ef9-9292-464b-bc5e-df49d86d54d7', 'dcc0af48-93ac-4596-b68c-0e661d6de971', 'e0b0f972-b5d3-45ac-a72b-e8df93627c83', '69517d77-192c-4009-b6ed-70b670da2f88'),
('fa1641cb-14b4-4b31-a178-03929befebd4', 'Co Nhieu Nam Kinh Nghiem Tri Sau Rang', '87c91042-0d41-4c90-9dd5-84c0120e86b3', '2ad8ac2c-3272-42e1-8fb5-8dc131a0dd01', 'a2b7f53e-34a6-4768-bfe3-d8a4ac8d2b2e', '63ba589a-8f32-4cf9-9491-c26d613dc520');

-- --------------------------------------------------------

--
-- Table structure for table `file`
--

CREATE TABLE `file` (
  `id` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `bhyt` varchar(255) DEFAULT NULL,
  `birthday` varchar(255) DEFAULT NULL,
  `cccd` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `des` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `job` varchar(255) DEFAULT NULL,
  `my_file` bit(1) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) NOT NULL,
  `key_encrypted` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `file`
--

INSERT INTO `file` (`id`, `address`, `bhyt`, `birthday`, `cccd`, `country`, `des`, `email`, `fullname`, `job`, `my_file`, `phone_number`, `user_id`, `key_encrypted`) VALUES
('1447d547-bf25-4c0e-88eb-83ee136d6b47', 'TshVhn7cRPe6I1Oo84D6hw==', 'Không', '2003/05/19', 'dUyi8M3YL61zBViHJ55F1A==', 'Viet Nam', NULL, 'bUhrZNWK7qmru1ExmOjK9VsBPeHoZJAv4vErsJmqqy0=', 'eXZjmpEbb857nZ1gd7XmSQ==', 'Sinh Vien', b'1', 'mTR3vVyUS2Ua0zQGURoojw==', '3dfaf5f2-04fb-47c7-8560-94b26afb4ebe', 'U2FsdGVkX1+TDYRkgQe7uq/L4MNODHuWaLdHEWVl4uE1G1W4+AvOUd9X4p4JQEfcq1fcMYgco4GQoGrgv+ZWVw==');

-- --------------------------------------------------------

--
-- Table structure for table `invalidated_token`
--

CREATE TABLE `invalidated_token` (
  `id` varchar(255) NOT NULL,
  `expiry_time` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invalidated_token`
--

INSERT INTO `invalidated_token` (`id`, `expiry_time`) VALUES
('026d956b-7907-439b-bca3-de92b6788a4a', '2025-05-28 22:36:38.000000');

-- --------------------------------------------------------

--
-- Table structure for table `order_detail`
--

CREATE TABLE `order_detail` (
  `id` varchar(255) NOT NULL,
  `order_doctor_id` varchar(255) DEFAULT NULL,
  `order_table_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_detail`
--

INSERT INTO `order_detail` (`id`, `order_doctor_id`, `order_table_id`) VALUES
('75891d16-380d-4d6f-b043-cce4ec75b0a8', 'b1ce31d7-be6f-45ae-9a0b-fa9b8b8eaa32', '72b30bad-2476-4634-811d-b3f586fd1de3'),
('b5a76d13-414c-45b8-9a99-8f776b0611be', 'febc3448-1c3c-49fb-af5a-76ec1488d8cf', '944db57a-2759-41f4-9111-b49bb882ae01');

-- --------------------------------------------------------

--
-- Table structure for table `order_doctor`
--

CREATE TABLE `order_doctor` (
  `id` varchar(255) NOT NULL,
  `start_date` varchar(255) DEFAULT NULL,
  `start_time` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `total` double DEFAULT NULL,
  `doctor_user_id` varchar(255) NOT NULL,
  `file_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_doctor`
--

INSERT INTO `order_doctor` (`id`, `start_date`, `start_time`, `status`, `total`, `doctor_user_id`, `file_id`) VALUES
('b1ce31d7-be6f-45ae-9a0b-fa9b8b8eaa32', '2025/05/26', '21:00', 'CONFIRMED', 400000, 'c8e363df-eddb-4c2f-8125-20714e805aa9', '1447d547-bf25-4c0e-88eb-83ee136d6b47'),
('febc3448-1c3c-49fb-af5a-76ec1488d8cf', '2025/05/28', '22:00', 'CONFIRMED', 400000, 'c8e363df-eddb-4c2f-8125-20714e805aa9', '1447d547-bf25-4c0e-88eb-83ee136d6b47');

-- --------------------------------------------------------

--
-- Table structure for table `order_table`
--

CREATE TABLE `order_table` (
  `id` varchar(255) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `order_date` varchar(255) DEFAULT NULL,
  `order_time` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `file_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_table`
--

INSERT INTO `order_table` (`id`, `note`, `order_date`, `order_time`, `status`, `file_id`) VALUES
('72b30bad-2476-4634-811d-b3f586fd1de3', 'Đã xử lý', '2025/05/26', '20:34:20', 'Đã khám xong', '1447d547-bf25-4c0e-88eb-83ee136d6b47'),
('944db57a-2759-41f4-9111-b49bb882ae01', 'Đã xử lý', '2025/05/28', '21:37:00', 'Đã khám xong', '1447d547-bf25-4c0e-88eb-83ee136d6b47');

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

CREATE TABLE `permission` (
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`name`, `description`) VALUES
('ADMIN', 'Role Admin'),
('DOCTOR', 'DOCTOR role'),
('USER', 'USER role');

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `id` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`id`, `location`, `name`) VALUES
('69d097a6-f0ea-404d-8850-9f7e865d37db', 'Tang 2', 'P106'),
('87c91042-0d41-4c90-9dd5-84c0120e86b3', 'Tâng 1', 'P101'),
('b9d0c9be-f7e4-4629-b8da-251e709c3b0d', 'Tang 1', 'P103'),
('db573532-97e8-45ab-a22b-8c50a0d33f3d', 'Tầng 2', 'P103'),
('ded74115-fd59-46d9-b472-32cb4518dfd1', 'Tâng 2', 'P102'),
('f2315ef9-9292-464b-bc5e-df49d86d54d7', 'Tâng 2', 'P101'),
('ffe45e42-600b-45dd-a9c1-96fec95e794e', 'Tang 1', 'P102');

-- --------------------------------------------------------

--
-- Table structure for table `service_clinic`
--

CREATE TABLE `service_clinic` (
  `id` varchar(255) NOT NULL,
  `services_name` varchar(255) DEFAULT NULL,
  `services_price` double DEFAULT NULL,
  `category_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_clinic`
--

INSERT INTO `service_clinic` (`id`, `services_name`, `services_price`, `category_id`) VALUES
('2ad8ac2c-3272-42e1-8fb5-8dc131a0dd01', 'Kham Rang', 200000, '2d55f945-236f-43a3-8227-2017537ebdc4'),
('3e8c04dc-511d-47ea-bb33-ffedf43097c8', 'Dieu Tri Vay Nen', 400000, 'a2795a14-8232-45fd-bab7-8b9895831603'),
('4084b1da-355a-41a7-b99c-d206904d33f0', 'kham nhi', 200000, 'd473830b-b772-4483-aa38-239560edaf61'),
('dcc0af48-93ac-4596-b68c-0e661d6de971', 'Kham Tim', 250000, 'd473830b-b772-4483-aa38-239560edaf61');

-- --------------------------------------------------------

--
-- Table structure for table `statistical`
--

CREATE TABLE `statistical` (
  `id` varchar(255) NOT NULL,
  `number_order` double DEFAULT NULL,
  `sum_price` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `time_work`
--

CREATE TABLE `time_work` (
  `id` varchar(255) NOT NULL,
  `session` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `time_work`
--

INSERT INTO `time_work` (`id`, `session`) VALUES
('a2b7f53e-34a6-4768-bfe3-d8a4ac8d2b2e', 'Buoi Sang'),
('d5dcbe85-d905-446e-8736-dc33989917cb', 'Buoi Toi'),
('e0b0f972-b5d3-45ac-a72b-e8df93627c83', 'Buoi Chieu');

-- --------------------------------------------------------

--
-- Table structure for table `time_work_detail`
--

CREATE TABLE `time_work_detail` (
  `id` varchar(255) NOT NULL,
  `time_end` varchar(255) DEFAULT NULL,
  `time_start` varchar(255) DEFAULT NULL,
  `time_work_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `time_work_detail`
--

INSERT INTO `time_work_detail` (`id`, `time_end`, `time_start`, `time_work_id`) VALUES
('04821c25-7afa-4ee9-bc86-9e616defdc01', '17:00', '16:00', 'e0b0f972-b5d3-45ac-a72b-e8df93627c83'),
('390e47d8-86fc-4289-a199-0ebff5b8554e', '22:00', '21:00', 'd5dcbe85-d905-446e-8736-dc33989917cb'),
('5c2c45a2-2c9e-466b-abe9-98b1fb7cf164', '18:00', '17:00', 'e0b0f972-b5d3-45ac-a72b-e8df93627c83'),
('5cb3393b-2440-46cd-96e1-1404948b6be3', '19:00', '18:00', 'd5dcbe85-d905-446e-8736-dc33989917cb'),
('6dea6eb2-7bd5-4976-b12f-423988ff161d', '07:00', '06:00', 'a2b7f53e-34a6-4768-bfe3-d8a4ac8d2b2e'),
('7515858e-3fb1-4f66-89f3-d1dddc7591c4', '14:00', '13:00', 'e0b0f972-b5d3-45ac-a72b-e8df93627c83'),
('75272d2f-8a89-4f24-9173-40ac5e39b99b', '20:00', '19:00', 'd5dcbe85-d905-446e-8736-dc33989917cb'),
('7933cf2e-9d16-4a3e-83be-7ed4df4edadc', '15:00', '14:00', 'e0b0f972-b5d3-45ac-a72b-e8df93627c83'),
('87586390-e5c4-49d3-89f3-039f33ca7f9e', '23:00', '22:00', 'd5dcbe85-d905-446e-8736-dc33989917cb'),
('a840e0d9-28f7-477e-8216-1b01d6d5e2c5', '21:00', '20:00', 'd5dcbe85-d905-446e-8736-dc33989917cb'),
('b380a512-9aa5-4d97-b9fb-efc584ecde24', '11:00', '10:00', 'a2b7f53e-34a6-4768-bfe3-d8a4ac8d2b2e'),
('e4f40f7b-765c-4bf7-9f38-25ba6baea804', '08:00', '07:00', 'a2b7f53e-34a6-4768-bfe3-d8a4ac8d2b2e'),
('f15ad233-016f-4f6a-bb89-35f1046d82d8', '10:00', '09:00', 'a2b7f53e-34a6-4768-bfe3-d8a4ac8d2b2e'),
('f4d84a5e-fd62-44b5-80d4-c7e4fbb09d1a', '09:00', '08:00', 'a2b7f53e-34a6-4768-bfe3-d8a4ac8d2b2e'),
('f5e12128-33a2-4f60-8a32-46743a8a0611', '16:00', '15:00', 'e0b0f972-b5d3-45ac-a72b-e8df93627c83');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(255) NOT NULL,
  `dob` date DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `failed_attempts` int(11) DEFAULT 0,
  `lock_time` timestamp NULL DEFAULT NULL,
  `address_wallet` varchar(100) DEFAULT NULL,
  `private_key_encrypted` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `dob`, `email`, `full_name`, `password`, `phone`, `user_name`, `failed_attempts`, `lock_time`, `address_wallet`, `private_key_encrypted`) VALUES
('07ac8f65-d3c9-499c-bd76-47a03f624888', NULL, 'userdemo@gmail.com', 'nguyen trong tan', '$2a$10$XpKL0tyUKQePG7tw4f5xbemWAkN.Q2m8DVkDilS6aLQnzgUdP105m', '03477234333', 'userdemo', 0, NULL, '0x07B90D816e661Bdbb93331E5F9871E4Ce9A7045d', 'U2FsdGVkX1+nxFnIc+FJUCTRWdbh2mgPSuiA/sY+CzGTJq1ZhIFg3iFoE7is8aiSlB27YyAnrTPoUtjaDE2ZHhmqcYyAjSjaxbLe8Vl48hc2g/7hcj7JaY/x/B7QQ8nt'),
('3db37a1b-bea2-4863-8738-acb03c27f241', NULL, 'blockchain@gmail.com', 'nguyen trong tan', '$2a$10$fp10YehCUR6ZP1FV2oyLtec5gUA63o9Uz/Y95/8V10PTYRRaP2rgS', '03234242342', 'blockchain', 0, NULL, '0x0D7805B7239867cd5eAbAba197239704e4f8CBE0', 'U2FsdGVkX18yTJpQEgBomiKLv0dsVt+R9kVV3W03gOGJb3O8gFjYr7u69/pHCBbwZ8RoZXXIAaRjyvqIEYVBsbfbJr4yzUK15fJrXZ5x1uOmkyhuHcWjTYPjbzRBmBYN'),
('3dfaf5f2-04fb-47c7-8560-94b26afb4ebe', NULL, 'user1905@gmail.com', 'USER1905', '$2a$10$Uf5zujn.vKoRtKvg6T4Fyel0NUo3b1FA1TEdZY6Fi8I4O3p3ApZn2', '0377381111', 'user1905', 0, NULL, '0x279F7BdB73f78c918aa29e3366982e1B9A8cce15', 'U2FsdGVkX1+rIc2vjV/tINaDh2DbexTJhiuC6UPd/O7Q47s8z1cH6xeNQMoCE8CBI3ttcC8X9KtEamxGbDXsCqcHNulEZcYaJG/ECLSedHbyDRjNYIUYiuVrqaNYm81H'),
('4d151483-cf3e-4d34-a842-29b9ba0d7d0e', NULL, NULL, NULL, '$2a$10$c/w9WxRWZ7IalmpkjqeZs.8sT9FDmrGg1n6Imrb6wz1y4kP3Yryym', NULL, 'admin', 0, NULL, '0x03499d348eE91408AD41e803Cf2dd3f1704d97db', 'U2FsdGVkX1+EasqEkhZLP8d1s1AgM+JXxp8ImSasDM5RtneRqqDk0hYfQgo5of0LrNsTL88syIvvkaypB9F4I7L34OLrz/Alm2P46DmGZ1NmUr1R7gg9xpAC4TzFY0il'),
('4f3dbb15-b7e3-43dd-8c7b-3cc9ae6bf706', '2003-05-19', 'doctor4@gmail.com', 'DOCTOR4', '$2a$10$9vB7niDdUTNor1Mq1cygculimweH0VM2Gy.K3s8GE612h9j1VBwB2', '0377386123', 'doctor4', 0, NULL, '0xd94e13B85548211B3B0F04EA1A253658B9Ac5315', 'U2FsdGVkX197EAueJjyH4OUg5TEBAVPM/CnxBQo7YGk50xxW8WHUcesoX1hsE0C+vuivQBKEHoLkvKZkZtafroaOI6IcmGNCzwIKnANOuIDXneyCXtafAsGTcABE2/p5'),
('63ba589a-8f32-4cf9-9491-c26d613dc520', '2003-05-19', 'doctor1@gmail.com', 'DOCTOR12', '$2a$10$WlVM4zzyRBYX8ZzVYVVHx.KQSZEOmZ7UxP4pCfVfS4WW847tDjQeu', '0377386602', 'doctor1', 0, NULL, '0x9a79b38Da47459043CCAB50F0b14d8D79DAd392d', 'U2FsdGVkX19TjX4WLPVqmx2Og2tnWSuWXaeAnyX8PBgtH3jd6b1pLFlz8EiVNW2D3p50bQnEZdCl6H4IkEtZ+jMbFqE84FkNhnlPTQzOpXY7RtYSmISGZrHcEacVq1PZ'),
('69517d77-192c-4009-b6ed-70b670da2f88', '2003-05-19', 'doctor2@gmail.com', 'DOCTOR2', '$2a$10$pTVeqs8TxB6KgkbHNGdzn.ULDEXYCle6X/ibKNpfm./5cSmLT8EfC', '0377386603', 'doctor2', 0, NULL, '0x10705b55901702c759a9934B2C00c4d1F391Ed2D', 'U2FsdGVkX18ZEanLdAfP7OUmTJcQNuGAfqIrGZB5/AAW9FoD/SsXlKkw8PoitXvGEWu1Umostr/3YFCNuu6gIBv26r67GKHLoTFNsDdYeufx5mfhanW9J342zbhTUDvp'),
('786517d7-f132-42bf-b7d3-04fc7cc2b251', NULL, 'testaccount@gmail.com', 'nguyen trong', '$2a$10$cVrMN2/67b044YOnMQ66B.5tZ9tw87WCvcChunyAiAsTkBiWPCXYq', '0377386206', 'testaccount', 0, NULL, '0x688E952b8EE4f3Da036f63CdB4d6Bd6Ac7Da203D', 'U2FsdGVkX18Q15rroMk5m0QWpVdyIiopGhZZjb9p61pz/JcHfXSZSwjFAWjqg88nwKv7HtInpOfY4GHXCIDDzq5RxU2TZVnABnkpxKWy3j1hCL16OcOIPl+iQW77GzJS'),
('9c8489ff-d199-4762-81fb-18085716c7b0', '2003-05-19', 'user10@gmail.com', 'user10', '$2a$10$hZsw0upoezQHSfltEx1Xou7lT4QItJ.w3GuHvChmhm/wQ5vupZjma', '0377386239', 'user10', 0, NULL, '0xe62344C6637EC874Bab0D36c0a97cCa49FBc96C1', 'U2FsdGVkX1+wXVt5rvgnZs6AigO8BeHMG0uiInAENGqE910p9C2Evtz5ycqzSxAgoMcmB64ftHkKJUByTq8aGxIoClBCIMYzzFSKDUI6PMJD7CskptOjpMIpPT6mPtEP'),
('ae78aff0-76a6-4c98-8cb0-6972fd88fd3d', '2003-05-19', 'doctor5@gmail.com', 'DOCTOR5', '$2a$10$SiMcI0COoMFd.1DFWzid4Opr7LQGiaBobJWqsIphEKVIa2B2CIvZ2', '0331233233', 'doctor5', 0, NULL, '0xE5EeC5179f22C26f645e033D4cdb7E58D58ae585', 'U2FsdGVkX19N9O5W9yXfm5ySl6MFWwLQMex9Nrr7yMG382knD1gofzTEabdgaOa8ADaiqKgFbQwvsFJvpltl/BjW6oS8VNM/dAzhCQH3YMfoiH4ikdK2wOZtGDIuiK70'),
('b3e08802-7533-48e7-b41f-1c4141f6b1a2', NULL, 'test1@gmail.com', 'TEST1', '$2a$10$O8A12f8iKWS6frpjQGRszO4bYL3VDUIgEo7yMVZw06hDnRQrAHsOu', '09232323445', 'test1', 0, NULL, '0x53BFDB65a96d6006DcBa58EC96c835b786f2dD1E', 'U2FsdGVkX1/U+RjdPIgfukCAiEGBJ+83JSidcm6Vly0CgX/8JeJNLZ1ehW4yE74om1Cm2KTN97Pwjvzqj9R86DSRGnDhLw4bzvfHfS3ZGAjpqUkfL2lIEtzHnaMgl5zf'),
('bd0533a1-7d64-45f0-aa78-faec2c211073', NULL, 'test123@gmail.com', 'test123', '$2a$10$oZa5Z3f4u8KLG2AY/a.wE.2EpLt4dPzUv5jXuqRq4S/OvEuVbSFbu', '0234234234', 'test123', 0, NULL, '0x63e225B5D57BABBD55f01c8fD9b3BE0F26b2C14E', 'U2FsdGVkX1/4u6o5cx7oAmOWJFIc7Y74VHFReNG3Pr4D6G2EKJJNi95nnfRO3crnlePKqo0uZyGzVvpf2qOJrnyGih9jmw1YHGh96HOVIhhkHx+/wji7uqsTmTE+Od0j'),
('c54df15a-4de8-475f-8996-f960d317b408', NULL, 'user1@gmail.com', 'USER1', '$2a$10$nhcyX0MrpfnRTvv.qrfUNOZzqhOfs3.2nbqZssGlp/Wo.HJ4itC0.', '0377386601', 'user1', 0, NULL, '0xD979aAabBc449C28C11561eA74aa284b4290f620', 'U2FsdGVkX1+P2pVz0BLdOgiycQDZROotthOvIBgaZqszDR9qA7tW6T+/2L50vzU7wn3B8g4ty9466R0ysLvMVXTcqgLwlUIo4lBLlu5hGNxyvkqhW+ZkdNO9VhnCjPUq'),
('d053ef77-51f6-4957-956f-1f8631b48b5c', '2003-05-19', 'doctor3@gmail.com', 'DOCTOR3', '$2a$10$aeUH4VJKdwZzQ5OlAGHQIOrwUt8g/TNOF2z6Un4Sm.PJ.hEwJ1IJW', '0377386604', 'doctor3', 0, NULL, '0xAE792D8ab3c276557A44E0887d9f488Ef7875C08', 'U2FsdGVkX1/bqKKjjMsl16f30yiixiZ008erU652L2kGXyU9KoyWxFMETjXA8H2q9SvzSL5OYxR0DXdCc+Xwt+NTuB3otjMdPoVcexumbOYfuzbQlAS8Nt+4pnIqxot1'),
('e8141296-ce19-4d73-a3dc-8a55e36df180', NULL, 'user2@gmail.com', 'USER2', '$2a$10$.7kTxxccnxvK6d/lrLTuQObRAzh6grB2HlpczXw1zp18btTJgDkvi', '0337734592', 'user2', 0, NULL, '0x03A78A0526fd0C7DCF9B7092866A4E49a3bBA780', 'U2FsdGVkX1+f24WfwRTACo545LdfC9djY3LjQGX/uBXXM18vy1kUAf93suEycFEwO4GCZWKVWUU3rLyYfZg8M6p+I6J/UeCNhpAz20jOiaDnAzQPHxCnfV4i+n78SLXK');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` varchar(255) NOT NULL,
  `roles_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`user_id`, `roles_name`) VALUES
('07ac8f65-d3c9-499c-bd76-47a03f624888', 'USER'),
('3db37a1b-bea2-4863-8738-acb03c27f241', 'USER'),
('3dfaf5f2-04fb-47c7-8560-94b26afb4ebe', 'USER'),
('4d151483-cf3e-4d34-a842-29b9ba0d7d0e', 'ADMIN'),
('4f3dbb15-b7e3-43dd-8c7b-3cc9ae6bf706', 'DOCTOR'),
('63ba589a-8f32-4cf9-9491-c26d613dc520', 'DOCTOR'),
('69517d77-192c-4009-b6ed-70b670da2f88', 'DOCTOR'),
('786517d7-f132-42bf-b7d3-04fc7cc2b251', 'USER'),
('9c8489ff-d199-4762-81fb-18085716c7b0', 'USER'),
('ae78aff0-76a6-4c98-8cb0-6972fd88fd3d', 'DOCTOR'),
('b3e08802-7533-48e7-b41f-1c4141f6b1a2', 'USER'),
('bd0533a1-7d64-45f0-aa78-faec2c211073', 'USER'),
('c54df15a-4de8-475f-8996-f960d317b408', 'USER'),
('d053ef77-51f6-4957-956f-1f8631b48b5c', 'DOCTOR'),
('e8141296-ce19-4d73-a3dc-8a55e36df180', 'USER');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `doctor_user`
--
ALTER TABLE `doctor_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_jwo5wxeysknfaopcoyti0mjnv` (`room_id`),
  ADD UNIQUE KEY `UK_9eomypi5ab75mmneibx25vrcc` (`user_id`),
  ADD KEY `FKx6vs911xwubf2cmg5tksmtep` (`server_clinic_id`),
  ADD KEY `FKc9au6xwqlcgv3a3k5p10alpr2` (`time_work_id`);

--
-- Indexes for table `file`
--
ALTER TABLE `file`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKinph5hu8ryc97hbs75ym9sm7t` (`user_id`);

--
-- Indexes for table `invalidated_token`
--
ALTER TABLE `invalidated_token`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_detail`
--
ALTER TABLE `order_detail`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_pv9jkcqd5kh8loghr890lm273` (`order_doctor_id`),
  ADD UNIQUE KEY `UK_ngmop08apqdtnpxw2b5qwj5f5` (`order_table_id`);

--
-- Indexes for table `order_doctor`
--
ALTER TABLE `order_doctor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK6098ywu92v52dif166i8lxylr` (`doctor_user_id`),
  ADD KEY `FKu54mt2cx9avg9fh1na9phc77` (`file_id`);

--
-- Indexes for table `order_table`
--
ALTER TABLE `order_table`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK1fdlfgvkub03awyq5jhyp0hmf` (`file_id`);

--
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_clinic`
--
ALTER TABLE `service_clinic`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKne636cglxwyqpudsekef1wmv0` (`category_id`);

--
-- Indexes for table `statistical`
--
ALTER TABLE `statistical`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `time_work`
--
ALTER TABLE `time_work`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `time_work_detail`
--
ALTER TABLE `time_work_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK7tbeudtkd1rn0281jkpdgj52o` (`time_work_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`roles_name`),
  ADD KEY `FK6pmbiap985ue1c0qjic44pxlc` (`roles_name`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `doctor_user`
--
ALTER TABLE `doctor_user`
  ADD CONSTRAINT `FKc9au6xwqlcgv3a3k5p10alpr2` FOREIGN KEY (`time_work_id`) REFERENCES `time_work` (`id`),
  ADD CONSTRAINT `FKgcfd9jx27ccug3wc8x4oubt18` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FKt484klcw84xhes6ade1on52de` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`),
  ADD CONSTRAINT `FKx6vs911xwubf2cmg5tksmtep` FOREIGN KEY (`server_clinic_id`) REFERENCES `service_clinic` (`id`);

--
-- Constraints for table `file`
--
ALTER TABLE `file`
  ADD CONSTRAINT `FKinph5hu8ryc97hbs75ym9sm7t` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `order_detail`
--
ALTER TABLE `order_detail`
  ADD CONSTRAINT `FKcmxi950yfnf8isd1erwg0878h` FOREIGN KEY (`order_doctor_id`) REFERENCES `order_doctor` (`id`),
  ADD CONSTRAINT `FKmfxv304ffec0ptskt5ur49s1c` FOREIGN KEY (`order_table_id`) REFERENCES `order_table` (`id`);

--
-- Constraints for table `order_doctor`
--
ALTER TABLE `order_doctor`
  ADD CONSTRAINT `FK6098ywu92v52dif166i8lxylr` FOREIGN KEY (`doctor_user_id`) REFERENCES `doctor_user` (`id`),
  ADD CONSTRAINT `FKu54mt2cx9avg9fh1na9phc77` FOREIGN KEY (`file_id`) REFERENCES `file` (`id`);

--
-- Constraints for table `order_table`
--
ALTER TABLE `order_table`
  ADD CONSTRAINT `FK1fdlfgvkub03awyq5jhyp0hmf` FOREIGN KEY (`file_id`) REFERENCES `file` (`id`);

--
-- Constraints for table `service_clinic`
--
ALTER TABLE `service_clinic`
  ADD CONSTRAINT `FKne636cglxwyqpudsekef1wmv0` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `time_work_detail`
--
ALTER TABLE `time_work_detail`
  ADD CONSTRAINT `FK7tbeudtkd1rn0281jkpdgj52o` FOREIGN KEY (`time_work_id`) REFERENCES `time_work` (`id`);

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `FK55itppkw3i07do3h7qoclqd4k` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK6pmbiap985ue1c0qjic44pxlc` FOREIGN KEY (`roles_name`) REFERENCES `role` (`name`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
