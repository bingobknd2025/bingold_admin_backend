-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 14, 2026 at 02:08 PM
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
-- Database: `bingold_admin_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `dstatus` enum('0','1') NOT NULL DEFAULT '0',
  `category` varchar(100) NOT NULL,
  `meta_title` varchar(200) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keyword` text DEFAULT NULL,
  `note` text DEFAULT NULL,
  `attch` varchar(255) DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `user_id`, `title`, `slug`, `status`, `dstatus`, `category`, `meta_title`, `meta_description`, `meta_keyword`, `note`, `attch`, `cover_image`, `created_at`, `updated_at`) VALUES
(1, 1, 'How to Build Scalable APIs', 'scalable-api-guide', 'active', '0', 'Technology', 'Scalable API Guide', 'Learn how to design scalable backend APIs', 'api, backend, scalability', 'Internal note for admin', 'https://example.com/file.pdf', 'https://example.com/image.jpg', '2026-04-14 03:40:34', '2026-04-14 05:31:53'),
(2, 1, 'How to Build Scalable APIs', 'scalable-api-guide-1', 'active', '0', 'Technology', 'Scalable API Guide', 'Learn how to design scalable backend APIs', 'api, backend, scalability', 'Internal note for admin', 'https://images.unsplash.com/photo-1636587224433-3cd253788c40?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'https://images.unsplash.com/photo-1636587224433-3cd253788c40?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '2026-04-14 04:30:35', '2026-04-14 05:32:04'),
(3, 1, 'dsadasdas', 'kakmxaksak', 'active', '0', 'axsaxmaskm', 'xamslal', 'test', 'smxasxmsa', '<figure class=\"image\"><img style=\"aspect-ratio:1024/1024;\" src=\"https://res.cloudinary.com/dodrdytjq/image/upload/v1776144332/bingold/egnxmvvodjudc9uiimay.png\" width=\"1024\" height=\"1024\"></figure>', 'https://res.cloudinary.com/dodrdytjq/image/upload/v1776144370/bingold/jygrg1rbpj8xsacfhc50.png', 'https://res.cloudinary.com/dodrdytjq/image/upload/v1776144364/bingold/pltkfglbixhdpwxkrdmk.png', '2026-04-14 05:26:16', '2026-04-14 05:32:14'),
(4, 1, 'How to Build Scalable APIs', 'scalable-api-guide-2', 'active', '0', 'Technology', 'Scalable API Guide', 'Learn how to design scalable backend APIs', 'api, backend, scalability', 'Internal note for admin', 'https://images.unsplash.com/photo-1636587224433-3cd253788c40?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'https://images.unsplash.com/photo-1636587224433-3cd253788c40?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '2026-04-14 05:33:55', '2026-04-14 05:33:55');

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `short_description` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `dstatus` enum('0','1') NOT NULL DEFAULT '0',
  `category` varchar(100) NOT NULL,
  `meta_title` varchar(200) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keyword` text DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `user_id`, `title`, `slug`, `short_description`, `description`, `status`, `dstatus`, `category`, `meta_title`, `meta_description`, `meta_keyword`, `cover_image`, `published_at`, `created_at`, `updated_at`) VALUES
(1, 1, 'How to Build Scalable APIs', 'scalable-api-guide', NULL, NULL, 'published', '0', 'Technology', 'Scalable API Guide', 'Learn how to design scalable backend APIs', 'api, backend, scalability', 'https://example.com/image.jpg', NULL, '2026-04-14 06:54:26', '2026-04-14 06:54:26'),
(2, 1, 'test', 'test', NULL, NULL, 'inactive', '0', 'test', 'test', 'test', 'test', 'https://res.cloudinary.com/dodrdytjq/image/upload/v1776150341/bingold/a0jdn6dtz2kiharfxfvh.png', NULL, '2026-04-14 07:06:09', '2026-04-14 07:06:09');

-- --------------------------------------------------------

--
-- Table structure for table `otps`
--

CREATE TABLE `otps` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `type` enum('LOGIN','REGISTER','CHANGE_PASSWORD','FORGOT_PASSWORD') NOT NULL,
  `otp` int(11) NOT NULL,
  `expires_at` datetime NOT NULL,
  `attempt_count` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pda_permissions`
--

CREATE TABLE `pda_permissions` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `module` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pda_permissions`
--

INSERT INTO `pda_permissions` (`id`, `name`, `slug`, `module`, `description`, `created_at`, `updated_at`, `is_active`) VALUES
(1, 'View Permissions', 'permission.view', 'Permission', 'View Permissions', '2026-01-15 04:01:04', '2026-01-27 08:54:09', 1),
(2, 'Create Permission', 'permission.create', 'Permission', 'Create Permission', '2026-01-15 04:01:04', '2026-01-27 08:54:24', 1),
(3, 'Update Permission', 'permission.update', 'Permission', 'Update Permission', '2026-01-15 04:01:04', '2026-01-27 08:54:34', 1),
(4, 'Delete Permission', 'permission.delete', 'Permission', 'Delete Permission', '2026-01-15 04:01:04', '2026-01-27 08:54:42', 1),
(5, 'View Roles', 'role.view', 'Role', 'View Roles', '2026-01-15 04:01:04', '2026-01-27 08:54:54', 1),
(6, 'Create Role', 'role.create', 'Role', 'Create Role', '2026-01-15 04:01:04', '2026-01-27 08:55:02', 1),
(7, 'Update Role', 'role.update', 'Role', 'Update Role', '2026-01-15 04:01:04', '2026-01-27 08:55:15', 1),
(8, 'Delete Role', 'role.delete', 'Role', 'Delete Role', '2026-01-15 04:01:04', '2026-01-27 08:55:25', 1),
(9, 'Assign Permissions to Role', 'role.assign-permissions', 'Role', 'Assign Permissions to Role', '2026-01-15 04:01:04', '2026-01-27 08:55:40', 1),
(10, 'View Users', 'user.view', 'User', 'View Users', '2026-01-15 04:01:04', '2026-01-27 08:55:53', 1),
(11, 'Create User', 'user.create', 'User', 'Create User', '2026-01-15 04:01:04', '2026-01-27 08:56:15', 1),
(12, 'Update User', 'user.update', 'User', 'Update User', '2026-01-15 04:01:04', '2026-01-27 08:56:30', 1),
(13, 'Delete User', 'user.delete', 'User', 'Delete User', '2026-01-15 04:01:04', '2026-01-27 08:56:42', 1),
(14, 'Change User Status', 'user.change-status', 'User', 'Change User Status', '2026-01-15 04:01:04', '2026-01-27 08:56:54', 1),
(15, 'View Trips', 'trip.view', 'Trip', 'View Trips', '2026-01-15 04:01:04', '2026-01-27 08:57:31', 1),
(16, 'Create Trip', 'trip.create', 'Trip', 'Create Trip', '2026-01-15 04:01:04', '2026-01-27 08:57:43', 1),
(17, 'Update Trip', 'trip.update', 'Trip', 'Update Trip', '2026-01-15 04:01:04', '2026-01-27 08:57:54', 1),
(18, 'Delete Trip', 'trip.delete', 'Trip', 'Delete Trip', '2026-01-15 04:01:04', '2026-01-27 08:58:06', 1),
(19, 'View Dashboard', 'dashboard.view', 'Dashboard', 'View Dashboard', '2026-01-15 04:01:04', '2026-02-02 04:28:58', 1),
(20, 'View Profile', 'profile.view', 'Profile', 'View Profile', '2026-01-15 04:01:04', '2026-01-27 08:58:28', 1),
(21, 'Update Profile', 'profile.update', 'Profile', 'Update Profile', '2026-01-15 04:01:04', '2026-01-27 08:58:40', 1),
(26, 'User Assign Role', 'user.assign.role', 'User', 'Assign User Role', '2026-01-20 04:04:52', '2026-01-20 04:04:52', 1),
(30, 'Franchise View', 'franchise.view', 'Franchise', 'Franchise View', '2026-01-22 09:40:07', '2026-01-22 09:40:07', 1),
(31, 'Franchise Sync', 'franchise.sync', 'Franchise', 'Franchise Sync\n', '2026-01-22 09:41:49', '2026-01-27 08:53:52', 1),
(32, 'Franchise Assign', 'franchise.assign', 'Franchise', 'Franchise Assign', '2026-01-27 05:24:37', '2026-01-27 05:24:37', 1),
(33, 'Vehicle View', 'vehicle.view', 'Vehicle', 'Vehicle View', '2026-01-27 07:12:09', '2026-01-27 07:12:09', 1),
(34, 'Vehicle Create', 'vehicle.create', 'Vehicle', 'Vehicle Create', '2026-01-27 07:14:38', '2026-01-27 07:14:38', 1),
(35, 'Vehicle Update', 'vehicle.update', 'Vehicle', 'Vehicle Update', '2026-01-27 07:15:26', '2026-01-27 07:15:26', 1),
(36, 'Vehicle Delete', 'vehicle.delete', 'Vehicle', 'Vehicle Delete', '2026-01-27 07:16:00', '2026-01-27 07:16:00', 1),
(37, 'Vehicle Assign', 'vehicle.assign', 'Vehicle', 'Vehicle Assign', '2026-01-29 04:19:32', '2026-01-29 04:19:32', 1),
(38, 'Staff Create', 'staff.create', 'Staff', 'Staff Create ', '2026-01-29 09:13:49', '2026-01-29 09:13:49', 1),
(39, 'Staff Delete', 'staff.delete', 'Staff', 'Staff Delete', '2026-01-29 09:15:03', '2026-01-29 09:15:03', 1),
(40, 'Staff Update', 'staff.update', 'Staff', 'Staff Update', '2026-01-29 09:15:30', '2026-01-29 09:15:30', 1),
(41, 'Staff View', 'staff.view', 'Staff', 'Staff View', '2026-01-29 09:16:11', '2026-01-31 09:04:32', 1),
(42, 'Transport_personnel View', 'transport_personnel.view', 'Transport Personnel', 'Transport Personnel', '2026-01-30 06:41:18', '2026-01-30 06:47:07', 1),
(43, 'Transport Personnel Create', 'transport_personnel.create', 'Transport Personnel', 'Transport Personnel ', '2026-01-30 06:42:21', '2026-01-30 06:49:54', 1),
(44, 'Permission List', 'permission.list', 'Permission', 'Permission List', '2026-01-30 09:51:03', '2026-01-30 09:51:04', 1),
(45, 'List Role', 'role.list', 'Role', 'List Role', '2026-01-31 03:39:49', '2026-01-31 03:39:49', 1),
(46, 'Sidebar Permissions', 'assigned.permissions', 'Sidebar', 'Sidebar Permissions', '2026-01-31 04:19:02', '2026-01-31 09:16:58', 1),
(47, 'User List', 'user.list', 'User', 'User List', '2026-01-31 09:02:57', '2026-01-31 09:02:57', 1),
(48, 'Vehicle List', 'vehicle.list', 'Vehicle', 'Vehicle List\n', '2026-01-31 09:03:29', '2026-01-31 09:03:29', 1),
(49, 'Staff List', 'staff.list', 'Staff', 'Staff List', '2026-01-31 09:03:57', '2026-01-31 09:03:57', 1),
(50, 'Permission Group List', 'permission.group', 'Permission', 'Permission Group List', '2026-01-31 09:22:30', '2026-01-31 09:22:30', 1),
(51, 'Permission Module', 'permission.module', 'Permission', 'Permission Module', '2026-01-31 09:23:03', '2026-01-31 09:23:03', 1),
(52, 'Franchise List', 'franchise.list', 'Franchise', 'Franchise List', '2026-02-02 06:09:29', '2026-02-02 06:09:29', 1),
(53, 'Staff  Verify', 'staff.verify', 'Staff', 'Staff  Verify', '2026-02-02 10:30:56', '2026-02-02 10:30:56', 1),
(54, 'Staff Stats', 'staff.stats', 'Staff', 'Staff Stats', '2026-02-02 10:31:24', '2026-02-02 10:31:24', 1),
(55, 'Vehicle Assigned', 'vehicle.assigned', 'Vehicle', 'Vehicle Assigned', '2026-02-09 05:00:25', '2026-02-09 05:00:25', 1),
(56, 'Franchise Assigned', 'franchise.assigned', 'Franchise', 'Franchise Assigned', '2026-02-09 08:52:31', '2026-02-09 08:52:31', 1),
(57, 'Trip Start', 'trip.start', 'Trip', 'Trip Start', '2026-02-18 07:48:12', '2026-02-18 07:48:12', 1),
(58, 'Trip Available Users', 'trip.available_users', 'Trip', 'Trip Available Users', '2026-02-23 10:16:36', '2026-02-23 10:16:36', 1),
(59, 'Trip List', 'trip.list', 'Trip', 'Trip List', '2026-02-23 10:17:50', '2026-02-23 10:17:50', 1),
(60, 'Trip Cancel', 'trip.cancel', 'Trip', 'Trip Cancel', '2026-02-24 06:00:22', '2026-02-24 06:00:22', 1),
(61, 'Trip Stop Arrive', 'trip.stop.arrive', 'Trip', 'Trip Stop Arrive', '2026-02-25 09:16:09', '2026-02-25 09:16:09', 1),
(62, 'Trip Stop Complete', 'trip.stop.complete', 'Trip', 'Trip Stop Complete', '2026-02-25 09:16:49', '2026-02-25 09:16:49', 1),
(63, 'User Trip Start', 'user.trip.start', 'Trip', 'User Trip Start', '2026-03-02 05:53:07', '2026-03-02 05:53:07', 1),
(64, 'User Trip Active', 'user.trip.active', 'Trip', 'User Trip Active', '2026-03-02 06:16:40', '2026-03-02 06:16:40', 1),
(65, 'Vehicle Document Upload', 'vehicle.document.upload', 'Vehicle', 'Vehicle Document Upload', '2026-03-09 07:56:43', '2026-03-09 07:56:43', 1),
(66, 'List Panic Alert', 'list.panic_alerts', 'Panic Alert', 'List Panic Alert', '2026-03-09 10:20:32', '2026-03-09 10:20:32', 1),
(67, 'Resolve Panic Alert', 'resolve.panic_alerts', 'Panic Alert', 'Resolve Panic Alert', '2026-03-10 09:29:58', '2026-03-10 09:29:58', 1),
(68, 'Vehicle Unassign', 'vehicle.unassign', 'Vehicle', 'Vehicle Unassign', '2026-03-12 08:19:46', '2026-03-12 08:19:46', 1),
(69, 'Bank Create', 'bank.create', 'Bank', 'Bank Create', '2026-03-16 04:38:59', '2026-03-16 04:38:59', 1),
(70, 'Bank List', 'bank.list', 'Bank', 'Bank List', '2026-03-16 04:39:21', '2026-03-16 04:39:21', 1),
(71, 'Bank Verify', 'bank.verify', 'Bank', 'Bank Verify', '2026-03-16 04:39:50', '2026-03-16 04:39:50', 1),
(72, 'Bank View', 'bank.view', 'Bank', 'Bank View', '2026-03-16 04:40:13', '2026-03-16 04:40:13', 1),
(73, 'Bank Update', 'bank.upadte', 'Bank', 'Bank update', '2026-03-16 04:40:30', '2026-03-16 04:40:30', 1),
(74, 'Bank Delete', 'bank.delete', 'Bank', 'Bank delete', '2026-03-16 04:40:47', '2026-03-16 04:40:47', 1),
(75, 'Bank Branch Create', 'branch.create', 'Bank Branch', 'Bank branch Create', '2026-03-16 05:10:13', '2026-03-16 05:10:13', 1),
(76, 'Bank Branch View', 'branch.view', 'Bank Branch', 'Bank branch View', '2026-03-23 05:55:24', '2026-03-23 05:55:24', 1),
(77, 'Blog Create', 'blog.create', 'Blog', 'Blog Create', '2026-04-13 12:03:34', '2026-04-13 12:03:34', 1),
(78, 'Blog List', 'blog.list', 'Blog', 'Blog List', '2026-04-13 12:04:54', '2026-04-13 12:04:54', 1),
(79, 'Blog View', 'blog.view', 'Blog', 'Blog View', '2026-04-14 03:46:35', '2026-04-14 03:46:35', 1),
(80, 'Blog update', 'blog.update', 'Blog', 'Bolg Update', '2026-04-14 03:47:22', '2026-04-14 03:47:22', 1),
(81, 'Blog Delete', 'blog.delete', 'Blog', 'Blog Delete', '2026-04-14 03:48:13', '2026-04-14 03:48:13', 1),
(82, 'News Create', 'news.create', 'News', 'News Create', '2026-04-14 06:37:53', '2026-04-14 06:37:53', 1),
(83, 'News List', 'news.list', 'News', 'News List ', '2026-04-14 06:39:14', '2026-04-14 06:39:14', 1),
(84, 'News View', 'news.view', 'News', 'News View', '2026-04-14 07:22:00', '2026-04-14 07:22:30', 1),
(85, 'News Update', 'news.update', 'News', 'News Update', '2026-04-14 07:24:57', '2026-04-14 07:24:57', 1),
(86, 'News Delete', 'news.delete', 'News', 'News Delete', '2026-04-14 07:25:32', '2026-04-14 07:25:32', 1);

-- --------------------------------------------------------

--
-- Table structure for table `pda_roles`
--

CREATE TABLE `pda_roles` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pda_roles`
--

INSERT INTO `pda_roles` (`id`, `name`, `slug`, `description`, `is_default`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'super_admin', 'Has all system permissions', 0, 1, '2026-01-15 04:01:04', '2026-01-15 04:01:04'),
(2, 'Admin', 'admin', 'Limited system permissions', 0, 1, '2026-01-19 08:54:27', '2026-01-20 10:23:00');

-- --------------------------------------------------------

--
-- Table structure for table `pda_role_permissions`
--

CREATE TABLE `pda_role_permissions` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pda_role_permissions`
--

INSERT INTO `pda_role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES
(8255, 2, 9, '2026-02-09 07:31:36'),
(8256, 2, 14, '2026-02-09 07:31:36'),
(8257, 2, 2, '2026-02-09 07:31:36'),
(8258, 2, 6, '2026-02-09 07:31:36'),
(8259, 2, 16, '2026-02-09 07:31:36'),
(8260, 2, 11, '2026-02-09 07:31:36'),
(8261, 2, 4, '2026-02-09 07:31:36'),
(8262, 2, 8, '2026-02-09 07:31:36'),
(8263, 2, 18, '2026-02-09 07:31:36'),
(8264, 2, 13, '2026-02-09 07:31:36'),
(8265, 2, 32, '2026-02-09 07:31:36'),
(8266, 2, 52, '2026-02-09 07:31:36'),
(8267, 2, 31, '2026-02-09 07:31:36'),
(8268, 2, 30, '2026-02-09 07:31:36'),
(8269, 2, 45, '2026-02-09 07:31:36'),
(8270, 2, 50, '2026-02-09 07:31:36'),
(8271, 2, 44, '2026-02-09 07:31:36'),
(8272, 2, 51, '2026-02-09 07:31:36'),
(8273, 2, 46, '2026-02-09 07:31:36'),
(8274, 2, 53, '2026-02-09 07:31:36'),
(8275, 2, 38, '2026-02-09 07:31:36'),
(8276, 2, 39, '2026-02-09 07:31:36'),
(8277, 2, 49, '2026-02-09 07:31:36'),
(8278, 2, 54, '2026-02-09 07:31:36'),
(8279, 2, 40, '2026-02-09 07:31:36'),
(8280, 2, 41, '2026-02-09 07:31:36'),
(8281, 2, 43, '2026-02-09 07:31:36'),
(8282, 2, 42, '2026-02-09 07:31:36'),
(8283, 2, 3, '2026-02-09 07:31:36'),
(8284, 2, 21, '2026-02-09 07:31:36'),
(8285, 2, 7, '2026-02-09 07:31:36'),
(8286, 2, 17, '2026-02-09 07:31:36'),
(8287, 2, 12, '2026-02-09 07:31:36'),
(8288, 2, 26, '2026-02-09 07:31:36'),
(8289, 2, 47, '2026-02-09 07:31:36'),
(8290, 2, 37, '2026-02-09 07:31:36'),
(8291, 2, 55, '2026-02-09 07:31:36'),
(8292, 2, 34, '2026-02-09 07:31:36'),
(8293, 2, 36, '2026-02-09 07:31:36'),
(8294, 2, 48, '2026-02-09 07:31:36'),
(8295, 2, 35, '2026-02-09 07:31:36'),
(8296, 2, 33, '2026-02-09 07:31:36'),
(8297, 2, 19, '2026-02-09 07:31:36'),
(8298, 2, 1, '2026-02-09 07:31:36'),
(8299, 2, 20, '2026-02-09 07:31:36'),
(8300, 2, 5, '2026-02-09 07:31:36'),
(8301, 2, 15, '2026-02-09 07:31:36'),
(8302, 2, 10, '2026-02-09 07:31:36'),
(9568, 1, 9, '2026-04-14 10:48:22'),
(9569, 1, 75, '2026-04-14 10:48:22'),
(9570, 1, 76, '2026-04-14 10:48:22'),
(9571, 1, 69, '2026-04-14 10:48:22'),
(9572, 1, 74, '2026-04-14 10:48:22'),
(9573, 1, 70, '2026-04-14 10:48:22'),
(9574, 1, 73, '2026-04-14 10:48:22'),
(9575, 1, 71, '2026-04-14 10:48:22'),
(9576, 1, 72, '2026-04-14 10:48:22'),
(9577, 1, 77, '2026-04-14 10:48:22'),
(9578, 1, 81, '2026-04-14 10:48:22'),
(9579, 1, 78, '2026-04-14 10:48:22'),
(9580, 1, 80, '2026-04-14 10:48:22'),
(9581, 1, 79, '2026-04-14 10:48:22'),
(9582, 1, 14, '2026-04-14 10:48:22'),
(9583, 1, 2, '2026-04-14 10:48:22'),
(9584, 1, 6, '2026-04-14 10:48:22'),
(9585, 1, 16, '2026-04-14 10:48:22'),
(9586, 1, 11, '2026-04-14 10:48:22'),
(9587, 1, 4, '2026-04-14 10:48:22'),
(9588, 1, 8, '2026-04-14 10:48:22'),
(9589, 1, 18, '2026-04-14 10:48:22'),
(9590, 1, 13, '2026-04-14 10:48:22'),
(9591, 1, 32, '2026-04-14 10:48:22'),
(9592, 1, 56, '2026-04-14 10:48:22'),
(9593, 1, 52, '2026-04-14 10:48:22'),
(9594, 1, 31, '2026-04-14 10:48:22'),
(9595, 1, 30, '2026-04-14 10:48:22'),
(9596, 1, 66, '2026-04-14 10:48:22'),
(9597, 1, 45, '2026-04-14 10:48:22'),
(9598, 1, 82, '2026-04-14 10:48:22'),
(9599, 1, 86, '2026-04-14 10:48:22'),
(9600, 1, 83, '2026-04-14 10:48:22'),
(9601, 1, 85, '2026-04-14 10:48:22'),
(9602, 1, 84, '2026-04-14 10:48:22'),
(9603, 1, 50, '2026-04-14 10:48:22'),
(9604, 1, 44, '2026-04-14 10:48:22'),
(9605, 1, 51, '2026-04-14 10:48:22'),
(9606, 1, 67, '2026-04-14 10:48:22'),
(9607, 1, 46, '2026-04-14 10:48:22'),
(9608, 1, 53, '2026-04-14 10:48:22'),
(9609, 1, 38, '2026-04-14 10:48:22'),
(9610, 1, 39, '2026-04-14 10:48:22'),
(9611, 1, 49, '2026-04-14 10:48:22'),
(9612, 1, 54, '2026-04-14 10:48:22'),
(9613, 1, 40, '2026-04-14 10:48:22'),
(9614, 1, 41, '2026-04-14 10:48:22'),
(9615, 1, 43, '2026-04-14 10:48:22'),
(9616, 1, 42, '2026-04-14 10:48:22'),
(9617, 1, 58, '2026-04-14 10:48:22'),
(9618, 1, 60, '2026-04-14 10:48:22'),
(9619, 1, 59, '2026-04-14 10:48:22'),
(9620, 1, 57, '2026-04-14 10:48:22'),
(9621, 1, 61, '2026-04-14 10:48:22'),
(9622, 1, 62, '2026-04-14 10:48:22'),
(9623, 1, 3, '2026-04-14 10:48:22'),
(9624, 1, 21, '2026-04-14 10:48:22'),
(9625, 1, 7, '2026-04-14 10:48:22'),
(9626, 1, 17, '2026-04-14 10:48:22'),
(9627, 1, 12, '2026-04-14 10:48:22'),
(9628, 1, 26, '2026-04-14 10:48:22'),
(9629, 1, 47, '2026-04-14 10:48:22'),
(9630, 1, 64, '2026-04-14 10:48:22'),
(9631, 1, 63, '2026-04-14 10:48:22'),
(9632, 1, 37, '2026-04-14 10:48:22'),
(9633, 1, 55, '2026-04-14 10:48:22'),
(9634, 1, 34, '2026-04-14 10:48:22'),
(9635, 1, 36, '2026-04-14 10:48:22'),
(9636, 1, 65, '2026-04-14 10:48:22'),
(9637, 1, 48, '2026-04-14 10:48:22'),
(9638, 1, 68, '2026-04-14 10:48:22'),
(9639, 1, 35, '2026-04-14 10:48:22'),
(9640, 1, 33, '2026-04-14 10:48:22'),
(9641, 1, 19, '2026-04-14 10:48:22'),
(9642, 1, 1, '2026-04-14 10:48:22'),
(9643, 1, 20, '2026-04-14 10:48:22'),
(9644, 1, 5, '2026-04-14 10:48:22'),
(9645, 1, 15, '2026-04-14 10:48:22'),
(9646, 1, 10, '2026-04-14 10:48:22');

-- --------------------------------------------------------

--
-- Table structure for table `pda_users`
--

CREATE TABLE `pda_users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `last_login_at` datetime DEFAULT NULL,
  `otp_secret` varchar(100) DEFAULT NULL,
  `otp_enabled` tinyint(1) DEFAULT 0,
  `failed_login_attempts` int(11) DEFAULT 0,
  `account_locked_until` datetime DEFAULT NULL,
  `mfa_method` enum('TOTP','EMAIL','SMS') DEFAULT 'TOTP',
  `backup_codes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `vehicle_id` int(11) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `aadhaar_number` varchar(20) DEFAULT NULL,
  `aadhaar_file` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`aadhaar_file`)),
  `aadhaar_status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `device_token` varchar(500) DEFAULT NULL COMMENT 'FCM/APNS device token',
  `device_type` enum('ANDROID','IOS','WEB') DEFAULT NULL COMMENT 'Device platform'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pda_users`
--

INSERT INTO `pda_users` (`id`, `name`, `email`, `phone`, `address`, `password`, `role_id`, `is_active`, `last_login_at`, `otp_secret`, `otp_enabled`, `failed_login_attempts`, `account_locked_until`, `mfa_method`, `backup_codes`, `vehicle_id`, `profile_image`, `dob`, `aadhaar_number`, `aadhaar_file`, `aadhaar_status`, `created_by`, `updated_by`, `created_at`, `updated_at`, `device_token`, `device_type`) VALUES
(1, 'System Administrator', 'work.adityasahgal@gmail.com', NULL, NULL, '$2b$10$5GGm9j7Papp0oLNw/489pe33QkTBlgzTuudAfUtRgph4m2agLm.EC', 1, 1, '2026-04-14 10:47:34', 'NVDGSOBJHFKHGN3SG4RXOP23GFOTEWR6', 1, 0, NULL, 'TOTP', NULL, NULL, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-01-15 04:01:04', '2026-04-14 10:47:34', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pda_user_tokens`
--

CREATE TABLE `pda_user_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `pda_user_id` bigint(20) UNSIGNED NOT NULL,
  `refresh_token_hash` varchar(255) NOT NULL,
  `device_id` varchar(100) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `expires_at` datetime NOT NULL,
  `revoked_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pda_user_tokens`
--

INSERT INTO `pda_user_tokens` (`id`, `pda_user_id`, `refresh_token_hash`, `device_id`, `ip_address`, `user_agent`, `expires_at`, `revoked_at`, `created_at`, `updated_at`) VALUES
(26, 1, '24b8a5f4b08255646bc754f37ae7a7ef3899370e24b2c2fb3b0b8119a2b83cc5', NULL, '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2026-01-29 04:21:27', NULL, '2026-01-15 04:21:27', '2026-01-15 08:33:17'),
(27, 1, '1038fce0a1f1a39d9724d997862c679ab98c04c809df1ea280ad1067093ff7cc', NULL, '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2026-01-29 06:03:40', NULL, '2026-01-15 06:03:40', '2026-01-15 08:33:17'),
(28, 1, 'e7f9c9c6fd5ee9885ce88f22168e57384668d8d96c5a63661ead5006fac7bbed', NULL, '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2026-01-29 06:22:31', NULL, '2026-01-15 06:22:31', '2026-01-15 08:33:17'),
(29, 1, '4c3155b9eb6e42a80b3ed57d94bb2256917202f9989837b64ea066927cc714c1', NULL, '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2026-01-29 06:46:49', NULL, '2026-01-15 06:46:49', '2026-01-15 08:33:17'),
(30, 1, '2b6e2b7cd3beebc8f835f7b371247708e479a408068ad190a40ee8f648ce879f', NULL, '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2026-01-29 06:52:15', NULL, '2026-01-15 06:52:15', '2026-01-15 08:33:17'),
(31, 1, '8709377b8ca8b3a4008a994092ae5cc57a5f176dcd1030f71a8d2f394d3c3ca2', NULL, '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2026-01-29 07:09:57', NULL, '2026-01-15 07:09:57', '2026-01-15 08:33:17'),
(32, 1, '044420f141cd514b4e78d7b8cc05a9f79077069fd2ab1ddc9f7df2a2489f1add', NULL, '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2026-01-29 07:24:11', NULL, '2026-01-15 07:24:11', '2026-01-15 08:33:17'),
(33, 1, 'd336e810aa5ef9d6b17aafd97379eebe2d23891079514aec94bc801d5365c118', NULL, '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2026-01-29 08:23:11', NULL, '2026-01-15 08:23:11', '2026-01-15 08:33:17'),
(34, 1, 'c2563ce73ac9052ea2b4fcf1dc33d53939c6c6a2032c7efdbd3fda717a0846ba', NULL, '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2026-01-29 08:35:05', '2026-01-15 08:36:40', '2026-01-15 08:35:05', '2026-01-15 08:36:40'),
(35, 1, '630920187efb5a8fa63426e9d19be7602b12c31b10eac9cef551aa36b32b7968', NULL, '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2026-01-29 08:36:40', NULL, '2026-01-15 08:36:40', '2026-01-15 08:36:40'),
(37, 1, '7d52224705a49733741539dc92a1eed068950e3a985f230c9af0817793bb1d97', NULL, '106.219.162.64', 'PostmanRuntime/7.51.0', '2026-01-29 10:28:58', NULL, '2026-01-15 10:28:58', '2026-01-15 10:28:58'),
(38, 1, '8fdef2f779af40c913f4360886b7d853750aaabe847118f54b174172d77ad173', NULL, '106.219.162.64', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-29 12:00:08', '2026-01-15 12:00:35', '2026-01-15 12:00:08', '2026-01-15 12:00:35'),
(39, 1, 'b55794cb3abc67ef5a4a771a81cc395fcc2c5b88f23bc023d2888ce021888359', NULL, '106.219.161.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-30 03:27:38', NULL, '2026-01-16 03:27:38', '2026-01-16 03:27:38'),
(40, 1, '5f65a0326c1d36b1d1a15bdff98f460bf4f5bd85f602ea5e8b0b9865a1c508ae', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 03:49:10', NULL, '2026-01-16 03:49:10', '2026-01-16 03:49:10'),
(41, 1, '1d99c999dcdb25a1cf8529d1675b3482f267f13cfdc1fc585934e59938430e6a', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 03:49:31', '2026-01-16 03:49:41', '2026-01-16 03:49:31', '2026-01-16 03:49:41'),
(42, 1, 'bec4658447a1d5af3aaf85934f164b68034f406ab44428cf620c992e63f6809e', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 03:55:37', NULL, '2026-01-16 03:55:37', '2026-01-16 03:55:37'),
(43, 1, '1f7daa12576cee05f086195449c8c72fa3a9b9a2e350201652dff88cdad98b85', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 03:57:52', NULL, '2026-01-16 03:57:52', '2026-01-16 03:57:52'),
(44, 1, 'e9fff58b418ef4b709ac5e1900412ee275a9f5901c854c83cc9a472786e26ef5', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 03:58:09', NULL, '2026-01-16 03:58:09', '2026-01-16 03:58:09'),
(45, 1, '73357821cc189c587f73a82f8a6c4184532e92c0fc9a923083283a118fefe9b8', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 04:02:41', NULL, '2026-01-16 04:02:41', '2026-01-16 04:02:41'),
(47, 1, 'f68a490dacea65b0790271305e3b0ff2a8e0adbfd43e0efa0ef5fc5c5960d7d9', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 04:15:23', NULL, '2026-01-16 04:15:23', '2026-01-16 04:15:23'),
(48, 1, 'f03c217bb6ef724621e05e904d8b1cafe896bd0db9d623b2e78530fe707babf9', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 04:23:50', NULL, '2026-01-16 04:23:50', '2026-01-16 04:23:50'),
(49, 1, 'be7c3d2fe03271885a193773eb0cded4a8e387741696211fab5a758d1304214d', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 04:26:33', NULL, '2026-01-16 04:26:33', '2026-01-16 04:26:33'),
(50, 1, '4336ee41ab9d13fe0b65c6aee3b13301ee50fc430579d39e8562c2e908839667', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 04:29:22', NULL, '2026-01-16 04:29:22', '2026-01-16 04:29:22'),
(51, 1, 'fdd4ae5828b8529309d0f5fdeb28ecf84946d07e983e01105cd24b5e173be273', NULL, '106.219.161.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-30 05:00:30', NULL, '2026-01-16 05:00:30', '2026-01-16 05:00:30'),
(52, 1, 'a1a21b59863cdadbe3c5340c25acbf2e43689b4e63d9f82b1a976756ebe02775', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 05:01:24', NULL, '2026-01-16 05:01:24', '2026-01-16 05:01:24'),
(55, 1, 'a5f47737ce125955c7c5d2fbdd61fa1bc117427c5d71d8f5b2f0e68c297f4d40', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 05:14:37', NULL, '2026-01-16 05:14:37', '2026-01-16 05:14:37'),
(58, 1, 'f8be3b7d91a88be8c21aba497e9ac69cf278ea938b7da2466fbc69bb27aef909', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 05:32:37', NULL, '2026-01-16 05:32:37', '2026-01-16 05:32:37'),
(59, 1, 'd7f9ad328959a6d3843a2862552457586d7c15a549f2205ed47b1b13efaf7ce2', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 05:35:32', NULL, '2026-01-16 05:35:32', '2026-01-16 05:35:32'),
(60, 1, 'ee13bf28b0f1ef20c7b5a9a077eb9306208668d897db42a4e0935e48f27067e7', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 05:43:43', NULL, '2026-01-16 05:43:43', '2026-01-16 05:43:43'),
(61, 1, 'd9bf237c635890419c6c51975124310d3e1f4b06c5632093738c0b021cfb0e0e', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 05:45:16', NULL, '2026-01-16 05:45:16', '2026-01-16 05:45:16'),
(62, 1, '6daefb2ccc1abedfb9de1997a727615f6067d33fbf18792a44c8ea4bfbb48842', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 05:48:32', NULL, '2026-01-16 05:48:32', '2026-01-16 05:48:32'),
(63, 1, '139f99de6eaf693f50f503294709ca17c17110af2bece13ec74213d86bc4ea83', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 05:50:39', '2026-01-16 05:51:31', '2026-01-16 05:50:39', '2026-01-16 05:51:31'),
(64, 1, 'caf7083f7f55d7118a024eb910b51944791d24acaff364d66c73e261536f7cdf', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 05:51:49', '2026-01-16 05:51:52', '2026-01-16 05:51:49', '2026-01-16 05:51:52'),
(65, 1, 'd4dc3a9377a3e395e217cd306e1f651a0966364d54e317ace38b0b209fb32ac8', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 05:52:08', NULL, '2026-01-16 05:52:08', '2026-01-16 05:52:08'),
(66, 1, '22482650ee81978eac1613933a03416ed7e2abb5bcc9c4f92cf03377f6d80da3', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 05:52:59', NULL, '2026-01-16 05:52:59', '2026-01-16 05:52:59'),
(67, 1, '24bf47375212ba8ca6ad4985f24bb82ad30b2d5489654f52b90283a1e444c7c8', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 05:53:54', NULL, '2026-01-16 05:53:54', '2026-01-16 05:53:54'),
(68, 1, 'b35323f0ffe438eed27a3ec78ccb57ef2482aa3ded94fd619ef87988eed8b6fc', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 05:57:58', NULL, '2026-01-16 05:57:58', '2026-01-16 05:57:58'),
(69, 1, 'f30f97efc0dac7ef1d584197b5564518e18a9ed7e8ad0fc1eb37f1f8e8ddfa5f', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 05:59:26', NULL, '2026-01-16 05:59:26', '2026-01-16 05:59:26'),
(70, 1, 'a3bd8c0aafe69891e9222b10e54fe2b13a5e396c1f7bafd44ad24e6809687b07', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 06:00:18', NULL, '2026-01-16 06:00:18', '2026-01-16 06:00:18'),
(73, 1, '138ebccd5c9b6a49b377812366644cd440343c420d922efb8bf9ed984397ec9c', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 06:03:28', NULL, '2026-01-16 06:03:28', '2026-01-16 06:03:28'),
(74, 1, '6921431518175e531f97eca3e9ab66e7ca81a70ea064b8555d4221e62a13d222', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 06:05:20', NULL, '2026-01-16 06:05:20', '2026-01-16 06:05:20'),
(75, 1, '35097f4f83b358c957444c6279e5bd0f42fa647dfd2f069e1e1acf2bbd9e4a8f', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 06:05:55', NULL, '2026-01-16 06:05:55', '2026-01-16 06:05:55'),
(76, 1, '1614b8b9e2641292420a672672b64ee55978d3e5b677ff8e70f912dbdded16f7', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 06:07:40', NULL, '2026-01-16 06:07:40', '2026-01-16 06:07:40'),
(77, 1, 'b0c8c90a4b28b1e466edf76e8f7cf80e59edef2981f56365c543f545aa4d80b8', NULL, '106.219.161.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-30 06:09:59', NULL, '2026-01-16 06:09:59', '2026-01-16 06:09:59'),
(83, 1, '07ad741d752ebc976ecdf94c26265e59aeb5dc09cdd1822853712fbaeeedff08', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 07:11:38', NULL, '2026-01-16 07:11:38', '2026-01-16 07:11:38'),
(84, 1, '5c4b39f38f2cf7a40369914f3cf8af1b794267d58260640f8947bed88d64e324', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 07:27:27', NULL, '2026-01-16 07:27:27', '2026-01-16 07:27:27'),
(86, 1, '50a379ea0fca1b290ed3114bf1ae4273cf60eee71460f7885db1250bb43c7481', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 08:27:49', '2026-01-16 09:03:17', '2026-01-16 08:27:49', '2026-01-16 09:03:17'),
(87, 1, '97fb3b0abb1af9809bd4fd2c644a0f86eafa78245ac04382d5fe12f8a6166aa4', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 09:03:17', NULL, '2026-01-16 09:03:17', '2026-01-16 09:03:17'),
(89, 1, 'de5c12762a9cb871c02a68e910bc7c8420ab704ab2fcaabf88b9346c1555438f', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 09:22:29', NULL, '2026-01-16 09:22:29', '2026-01-16 09:22:29'),
(91, 1, 'b3b513891e51390fa49c2fb3783b6208bbc89e314fa01ffcd29a8f3849848361', NULL, '106.219.161.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-30 09:33:37', NULL, '2026-01-16 09:33:37', '2026-01-16 09:33:37'),
(92, 1, '620566ff9af1efa51e22f97f46a807ee9cbb642ed63dce2378a362cf7b48aaae', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 09:34:06', NULL, '2026-01-16 09:34:06', '2026-01-16 09:34:06'),
(93, 1, '76f34713704722b285308d4403ebefb8d8fdf55e67fa251ff61516540944ce0c', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 09:35:21', '2026-01-16 09:39:55', '2026-01-16 09:35:21', '2026-01-16 09:39:55'),
(94, 1, 'f46557d8ae4cdcad9ec106ffe039c738ed4b7c583be213a74c6eb71251db161c', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 09:40:08', NULL, '2026-01-16 09:40:08', '2026-01-16 09:40:08'),
(95, 1, '0b9188e13c389bc23c0a0e2d80f6b169e41f02b5c3388580acba179d2441ec43', NULL, '106.219.161.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-30 09:48:26', NULL, '2026-01-16 09:48:26', '2026-01-16 09:48:26'),
(96, 1, '197784e3bef35ccd07f5aa7221f3dcd03248bc7d1080773a2f6607d3a76bb6f1', NULL, '106.219.161.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-30 09:49:08', NULL, '2026-01-16 09:49:08', '2026-01-16 09:49:08'),
(97, 1, '595ee65972f181849d0d915b000990b900a2bba118112535ad645361dd68fdaf', NULL, '106.219.161.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-30 09:52:29', '2026-01-16 10:12:23', '2026-01-16 09:52:29', '2026-01-16 10:12:23'),
(99, 1, '8bbdc60396d8c30f0ebc05ff5a52dc94b80b2ea1f6efddbc0de0d7e90f991fc7', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 10:12:23', NULL, '2026-01-16 10:12:23', '2026-01-16 10:12:23'),
(104, 1, '319acadf67e8932cf4c160b7b65cb9d579aefa6ff9749179be506f86bb2b7428', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 11:10:37', '2026-01-16 11:26:57', '2026-01-16 11:10:37', '2026-01-16 11:26:57'),
(105, 1, 'd6afc72bea2d30bad7e21099b76cb7a785b384df34b69dff535b3c2e20ddaedd', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 11:26:57', NULL, '2026-01-16 11:26:57', '2026-01-16 11:26:57'),
(106, 1, 'c47e513ac23c47ce072f2fcd367831c708297be25a4ca48609e89ebebadc555c', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 11:27:18', NULL, '2026-01-16 11:27:18', '2026-01-16 11:27:18'),
(107, 1, '6bbea350d85f7e6c742793bce308472cc1ddb343173dc79204405305622a8c98', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 11:27:40', NULL, '2026-01-16 11:27:40', '2026-01-16 11:27:40'),
(108, 1, '79ff85d6010fdeb271c55be9c453f9eaac081d766d9dd8f98c6a8848d8ae1f84', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 11:28:18', NULL, '2026-01-16 11:28:18', '2026-01-16 11:28:18'),
(109, 1, 'cf759e16580b721f1a9e3a29a32c4c5862cccf266ee08bc5e7cb9e7010710f35', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 11:29:33', NULL, '2026-01-16 11:29:33', '2026-01-16 11:29:33'),
(110, 1, 'a1d5675ea206cd078ea17532a2124f0cf68e99e8961872b2e40d1c250650b2c7', NULL, '106.219.161.89', 'PostmanRuntime/7.51.0', '2026-01-30 11:31:07', NULL, '2026-01-16 11:31:07', '2026-01-16 11:31:07'),
(111, 1, '3de837ea36fc955f5664ac5679656e8e24b76d484de1854b6f5a1d1619df8cb0', NULL, '106.219.161.89', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-01-30 11:32:38', NULL, '2026-01-16 11:32:38', '2026-01-16 11:32:38'),
(112, 1, 'cab9e0c357da5bd56135bac0f904e9b7188f1b75502378bd620c06ad15d19297', NULL, '106.219.161.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-30 11:50:26', '2026-01-16 11:50:55', '2026-01-16 11:50:26', '2026-01-16 11:50:55'),
(117, 1, '6b29f44b4e99977d4804cb1b61038e5a10519f73c968242cbfb9e81f34a7647f', NULL, '106.219.163.245', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-02-02 02:57:36', '2026-01-19 03:13:26', '2026-01-19 02:57:36', '2026-01-19 03:13:26'),
(118, 1, '9fcdb6611a090df7d476cb4029a815059c0dc5404e162d8ec894863e4ed80e29', NULL, '106.219.163.245', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-02-02 03:13:26', NULL, '2026-01-19 03:13:26', '2026-01-19 03:13:26'),
(119, 1, '3a3c6ba73c1d033b63a2edcd61130b2278f90f9a5baee2a44f0014f5039c86c8', NULL, '106.219.163.245', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-02-02 03:13:44', NULL, '2026-01-19 03:13:44', '2026-01-19 03:13:44'),
(120, 1, 'fb79e7cb7bfbb4031d01e3eb44d042f10507ec70d2714b31bf5f30fe89c16986', NULL, '106.219.163.245', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-02-02 03:13:58', '2026-01-19 03:29:03', '2026-01-19 03:13:58', '2026-01-19 03:29:03'),
(121, 1, '00ec497194345a81359c87418170672b8f686e25bbe228098ac49e9be6bcdfcb', NULL, '106.219.163.245', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-02-02 03:16:26', '2026-01-19 03:34:06', '2026-01-19 03:16:26', '2026-01-19 03:34:06'),
(122, 1, 'f863d4cb0b0e8a84773353d1fa5a75511dafe90c91566ef39577fc7e31d3edf2', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-02 03:29:03', NULL, '2026-01-19 03:29:03', '2026-01-19 03:29:03'),
(123, 1, '7387f2e4d361ba4e35442636d3ca6cdc5a493c878d3e81367aaca0fb5047ce64', NULL, '106.219.163.245', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-02-02 03:34:06', NULL, '2026-01-19 03:34:06', '2026-01-19 03:34:06'),
(124, 1, '49a6bb51f8e62dd05358dc9ebcdfadaf35e73b91781dc2f521f778125bee152d', NULL, '106.219.163.245', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-02-02 03:44:41', '2026-01-19 04:32:20', '2026-01-19 03:44:41', '2026-01-19 04:32:20'),
(125, 1, '8877924b98b87574a732ef164d0bc7c0a07bda38832e00acc676939051e11aba', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-02 04:02:48', '2026-01-19 04:21:52', '2026-01-19 04:02:48', '2026-01-19 04:21:52'),
(126, 1, '29101ef9b38dc33984721f1f01cf548d63e0b1746a1c86acd4d79fbec7f1cc6c', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-02-02 04:21:52', NULL, '2026-01-19 04:21:52', '2026-01-19 04:21:52'),
(127, 1, 'ebc655ac9a627156a45a53ffca174c9827cf7c1af67b001ae80e696dbcd24754', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-02 04:22:37', '2026-01-19 05:09:37', '2026-01-19 04:22:37', '2026-01-19 05:09:37'),
(128, 1, 'f1742612113db050ba7178467f58c3bd701a7fae1afebd37cc06d561b7d75c0e', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-02 04:32:20', NULL, '2026-01-19 04:32:20', '2026-01-19 04:32:20'),
(129, 1, '1b6688828c54d77de16e485a6f20a7c5209f621b8cbf4de9b4c87f5d1498b7f5', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-02 04:33:47', '2026-01-19 05:02:06', '2026-01-19 04:33:47', '2026-01-19 05:02:06'),
(130, 1, 'a5c9df1816ae795fe91abf46bdb6b31094b3468d66ff6a96f0fb6b62593bd4c5', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-02 05:02:06', NULL, '2026-01-19 05:02:06', '2026-01-19 05:02:06'),
(131, 1, '3dfd4a8c2cfcd3330799706b8398f612b89eeda60355d0aba4410c9d8f5b4786', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-02 05:07:03', '2026-01-19 05:33:30', '2026-01-19 05:07:03', '2026-01-19 05:33:30'),
(132, 1, 'f324883ec4d2e30d1755bd3661fee91b7b58b0286173a4b437a9b31b65017f55', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-02 05:09:37', NULL, '2026-01-19 05:09:37', '2026-01-19 05:09:37'),
(133, 1, '738ab9f1024c7fe514593f67e0b9499281b75286b3d6ef57e3d8552218210aaa', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-02 05:25:24', '2026-01-19 05:57:08', '2026-01-19 05:25:24', '2026-01-19 05:57:08'),
(134, 1, '97cfadac16ed3e5903040d5d62df6fd2e0d7f6864114f964425e92ba976739b0', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-02 05:33:30', NULL, '2026-01-19 05:33:30', '2026-01-19 05:33:30'),
(135, 1, '20c6818fa9b0d1ad4f41f9e4a85e555cce72485b073e0b5f55da7b337c85b91c', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-02 05:34:04', '2026-01-19 05:57:08', '2026-01-19 05:34:04', '2026-01-19 05:57:08'),
(136, 1, 'fe51031ae1037553965e3a3aa675a0958da030bfab57139ce7ffc2fa6ae85991', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-02 05:57:08', NULL, '2026-01-19 05:57:08', '2026-01-19 05:57:08'),
(137, 1, '160dcd7d9117ee35eaba20b578d5c88c9825dbda54d3ef751028b6fa560338c8', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-02 05:57:08', NULL, '2026-01-19 05:57:08', '2026-01-19 05:57:08'),
(138, 1, '0c0dd22ec9408326ae1bd1f44e3fcf6bb522f70f7fbe69f045500afcfef72f50', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-02 05:59:14', NULL, '2026-01-19 05:59:14', '2026-01-19 05:59:14'),
(139, 1, 'a9088e909831444fee70bc3e24009d187b9055ecb4f416a8bd8db440ca0f7efa', NULL, '106.219.163.245', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-02-02 06:47:10', NULL, '2026-01-19 06:47:10', '2026-01-19 06:47:10'),
(140, 1, '68b18d3dbacfab0ed2cd370578b7c269e6f781f32cbde31bf428de5e52d04237', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-02 06:57:09', '2026-01-19 07:14:28', '2026-01-19 06:57:09', '2026-01-19 07:14:28'),
(141, 1, 'd7857577dfd9f36062a5aac57960e52dd5698ae0f7d4adbdec878c6e7b6298de', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-02 07:14:28', NULL, '2026-01-19 07:14:28', '2026-01-19 07:14:28'),
(142, 1, 'd36914c8ca69b71b30a12f15662ede8a466b90366ab60c851006cb72b3df3e38', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-02 07:14:52', '2026-01-19 08:18:42', '2026-01-19 07:14:52', '2026-01-19 08:18:42'),
(143, 1, 'cfa45de5acef498637f23e8956fcafa83585bc1b3b3d54d6378d57d84ad884bc', NULL, '106.219.163.245', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-02-02 08:18:42', NULL, '2026-01-19 08:18:42', '2026-01-19 08:18:42'),
(144, 1, '608916853eecffcb9ed2aa1fa0adfb2057ad92705ba58158b35d149bc54ae23d', NULL, '106.219.163.245', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-02-02 08:20:39', '2026-01-19 08:49:33', '2026-01-19 08:20:39', '2026-01-19 08:49:33'),
(145, 1, '13e8a1173ec5af483eb4f30e3b34797a6e0e47be7e53dd3d08fe16f2d64b1409', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-02 08:49:33', NULL, '2026-01-19 08:49:33', '2026-01-19 08:49:33'),
(146, 1, 'fd05f413c1d9425a72f126669b5972e1a231d848eb07195a501208f9fae0a197', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-02 08:50:07', NULL, '2026-01-19 08:50:07', '2026-01-19 08:50:07'),
(148, 1, '451e7b3eaf2e4ee58f34fd23c0c47bf15520fa7db474631a7967321cfba137b1', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-03 03:28:02', NULL, '2026-01-20 03:28:02', '2026-01-20 03:28:02'),
(149, 1, '8893a4c0e13e458df832e36622e1a91663ae63a01bd5b0afedd8c0241dee5c08', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-03 03:31:28', NULL, '2026-01-20 03:31:28', '2026-01-20 03:31:28'),
(150, 1, '0e8495b05e5b2c993e05d5db87a7ef4acf7b537988170b12ebb28ae238b4c8ad', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-03 03:41:07', '2026-01-20 03:56:27', '2026-01-20 03:41:07', '2026-01-20 03:56:27'),
(151, 1, 'e9c8b22743cde12199e9e90f1fe535a1148422795f94010718764be159590e6f', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-03 03:56:27', NULL, '2026-01-20 03:56:27', '2026-01-20 03:56:27'),
(152, 1, 'b0e24f8afa5ae08621f0eb4a4b3d24719263ab357caaec0e8a4c3947a897cd64', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-03 03:56:47', '2026-01-20 04:31:05', '2026-01-20 03:56:47', '2026-01-20 04:31:05'),
(153, 1, '185525d74a2ff7654b8980423cbb5db154e62a8d18795bb80f8916461f61f33d', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-03 04:31:05', NULL, '2026-01-20 04:31:05', '2026-01-20 04:31:05'),
(154, 1, '4cd0a604f6c3d367147253c45c55fb33004fe88521b072dec8f2426ad638b091', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-03 04:33:53', '2026-01-20 05:07:22', '2026-01-20 04:33:53', '2026-01-20 05:07:22'),
(155, 1, '78687476d69a2b0edc6f21a067c164c1e2fe59a8085b38a6c859beb7c9fc7b8d', NULL, '106.219.163.245', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-02-03 05:07:22', NULL, '2026-01-20 05:07:22', '2026-01-20 05:07:22'),
(156, 1, 'd4b09c1be3f00016f5206fe8ae5f33c5a60e192481419d66eafae8d74e9c5da6', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-03 05:09:09', '2026-01-20 05:25:13', '2026-01-20 05:09:09', '2026-01-20 05:25:13'),
(157, 1, 'c77bfcc8d516506d784112ef1846041e48e4f03047b1588869a66a4de9cfda13', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-03 05:25:13', NULL, '2026-01-20 05:25:13', '2026-01-20 05:25:13'),
(158, 1, '21c80a9783ed841922f7debc15f7af1058f807a52710ecf1fba4026db4a84700', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-03 05:26:31', NULL, '2026-01-20 05:26:31', '2026-01-20 05:26:31'),
(159, 1, '8614285c9fb917b44ce146e9beb9122d76cf2f2c50de80c2d9613f7148a9cdd8', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-03 05:55:25', '2026-01-20 06:11:03', '2026-01-20 05:55:25', '2026-01-20 06:11:03'),
(160, 1, 'a64eeddfc2480ec6ab9cf0dd7c7d5ca4b5087f712c62636f9b731b33f7dbba26', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-03 06:11:03', NULL, '2026-01-20 06:11:03', '2026-01-20 06:11:03'),
(161, 1, '8a259b09ed3b8c013917e6f3f9c0296bb02309433fe75fb2875dee78604ad524', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-03 06:12:31', '2026-01-20 06:30:03', '2026-01-20 06:12:31', '2026-01-20 06:30:03'),
(162, 1, '5edab7c7f74a37237431a1f013c388c9497331061ad9e7c3985f554720a5f0a6', NULL, '106.219.163.245', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-02-03 06:30:03', NULL, '2026-01-20 06:30:03', '2026-01-20 06:30:03'),
(163, 1, 'bcc8d45b7bf7c4a59142bc20f6d00159b0c4effafe0fd8ccdc3caafcb9614be9', NULL, '106.219.163.245', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-02-03 06:31:02', '2026-01-20 06:46:03', '2026-01-20 06:31:02', '2026-01-20 06:46:03'),
(164, 1, '3457421d8adae225a7eff5bdd5508738e9243cced828f1c2e722bffeb51a3c24', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-03 06:46:03', NULL, '2026-01-20 06:46:03', '2026-01-20 06:46:03'),
(165, 1, '4bf228bfedf302d29da108eef1113bc65fb10e55b216ce06d79c885016efe41a', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-03 06:46:23', NULL, '2026-01-20 06:46:23', '2026-01-20 06:46:23'),
(166, 1, '00216e5d2fdbc9b8e85e599e228e12f679df82e68f8b9ca3acaec8258216d7c5', NULL, '106.219.163.245', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-02-03 06:51:14', '2026-01-20 06:54:57', '2026-01-20 06:51:14', '2026-01-20 06:54:57'),
(167, 1, 'a3ece2e4f1cfec93e7347cb1f3142c4cf3467306ddb579077d47c317490241b0', NULL, '106.219.163.245', 'PostmanRuntime/7.51.0', '2026-02-03 06:56:47', NULL, '2026-01-20 06:56:47', '2026-01-20 06:56:47'),
(169, 1, '721ca15768113a51dd4fbe7cd242f0fc228f4ea3aeb51dcdb1418ed8e02d0e48', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-03 07:12:44', '2026-01-20 07:28:25', '2026-01-20 07:12:44', '2026-01-20 07:28:25'),
(170, 1, 'd9112a77195f8343bb6717b3bb87df3e7de22df671d61d9901fc632b3c8bcda4', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-03 07:28:25', NULL, '2026-01-20 07:28:25', '2026-01-20 07:28:25'),
(216, 1, '8f22ae57f7013d283d098c2f0329a10f58f62d8184998dedb8c6c4c016ea2cbf', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-04 09:05:25', '2026-01-21 09:21:38', '2026-01-21 09:05:25', '2026-01-21 09:21:38'),
(217, 1, '65b064abc775e27df683c4432beb545559436488c47026b1d9a848cb3c2cabcf', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-04 09:21:38', NULL, '2026-01-21 09:21:38', '2026-01-21 09:21:38'),
(266, 1, 'fb756a5d6934f4d5faaeaee7207d0a0b1e4b8ccf393de890d4d915ce024d331b', NULL, '106.219.163.245', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-02-05 04:58:39', '2026-01-22 05:25:51', '2026-01-22 04:58:39', '2026-01-22 05:25:51'),
(270, 1, '25d991fb08268a26decf7d60e70885ff8f6e2aabaf04b54f90ac36cc1439869e', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-05 05:25:51', '2026-01-22 05:46:37', '2026-01-22 05:25:51', '2026-01-22 05:46:37'),
(273, 1, 'bb456d3680d4d810d162881a4b3e20336bdb7477c0b25f9acfba10148634a11e', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-05 05:46:37', '2026-01-22 06:01:53', '2026-01-22 05:46:37', '2026-01-22 06:01:53'),
(275, 1, 'a3620b85ce3dd06197dffe0e38c37256ea4bca957b2c175c30c154cce31083ad', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-05 06:01:53', '2026-01-22 06:45:00', '2026-01-22 06:01:53', '2026-01-22 06:45:00'),
(280, 1, '27e617cc15e88bd65f36d749bf5b86081ed5b8e683ce8d439035ca3606a3610c', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-05 06:45:00', '2026-01-22 08:20:53', '2026-01-22 06:45:00', '2026-01-22 08:20:53'),
(286, 1, '98c6360942c6ddf095b0cc412cf18b3679eb83a9b485415b585fb47cbcc44263', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-05 08:20:53', '2026-01-22 08:48:31', '2026-01-22 08:20:53', '2026-01-22 08:48:31'),
(290, 1, '4b5273cea1b92c16c9f36e7759006ecd9d0fa476bacb92248e113ec4899bafd6', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-05 08:48:31', '2026-01-22 09:14:16', '2026-01-22 08:48:31', '2026-01-22 09:14:16'),
(292, 1, '163c2b49d22df94d3013a7e3c7a6d5f1daa1a8a1e11d8962e2a3b7f1902013a5', NULL, '106.219.163.245', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-02-05 09:14:16', '2026-01-22 09:37:01', '2026-01-22 09:14:16', '2026-01-22 09:37:01'),
(295, 1, '56488a4adb232c2fe498031a324dab4553a2e83fc974fabc0dcade77d72d5ee0', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '2026-02-05 09:37:01', NULL, '2026-01-22 09:37:01', '2026-01-22 09:37:01'),
(322, 1, 'b29bebd233de53faa0555bf3ea07aa1fc95cd2ef287655b19f7e1fdad26da81f', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-06 04:10:06', '2026-01-23 04:26:10', '2026-01-23 04:10:06', '2026-01-23 04:26:10'),
(324, 1, '38b5cedcd7a7a0abd8bd94f6e38cea82a6af21a9909438106ced271b265f194b', NULL, '106.219.163.245', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-06 04:26:10', NULL, '2026-01-23 04:26:10', '2026-01-23 04:26:10'),
(374, 1, '55a9d87f691da8e2bcd7059bf07a9ab9c7c678f02a1def20661451d961193f20', NULL, '54.86.50.139', 'PostmanRuntime/7.51.0', '2026-02-06 16:08:45', NULL, '2026-01-23 16:08:45', '2026-01-23 16:08:45'),
(381, 1, '64ff2474bc36f629941aab9a82edc3a82896b350f62058c735e49451064181ef', NULL, '54.86.50.139', 'PostmanRuntime/7.51.0', '2026-02-06 17:00:46', NULL, '2026-01-23 17:00:46', '2026-01-23 17:00:46'),
(391, 1, 'e2e17a4917917880b3e31d39d0dfd902aae4bf6fda368d3cb519fec92c66a1e4', NULL, '106.215.103.13', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-10 02:57:46', NULL, '2026-01-27 02:57:46', '2026-01-27 02:57:46'),
(399, 1, '73a10364a76cb088867c65d80150f968c2d388811ab6007cc586c5c9ad7d6963', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-10 07:20:37', '2026-01-27 08:12:05', '2026-01-27 07:20:37', '2026-01-27 08:12:05'),
(400, 1, '7b8d8bf09d4149043bfef8f3cf328cfa003afe01b0ad97d1155b45c20b01f4a9', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-10 08:12:05', '2026-01-27 08:44:54', '2026-01-27 08:12:05', '2026-01-27 08:44:54'),
(401, 1, '1c6f9b66248b6788cdb4937247c90349558158290d5223162d7ff8eb1c2f72e0', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-10 08:44:54', '2026-01-27 09:00:51', '2026-01-27 08:44:54', '2026-01-27 09:00:51'),
(402, 1, '3454fdaa05f5fa3742a0d096d53d0c6cd51f308e87f2af8abda485d3b4ea3fba', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-10 09:00:51', '2026-01-27 09:16:03', '2026-01-27 09:00:51', '2026-01-27 09:16:03'),
(403, 1, 'f056b75b868803f6ce4964661eaa6cde20f676a5befce96c39e24244cb40f8cd', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-10 09:16:03', '2026-01-27 09:52:05', '2026-01-27 09:16:03', '2026-01-27 09:52:05'),
(406, 1, '210c199260477dd6609ede55dfd2f6b63387986be65ba3edb1f8cf244a3b72e6', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-10 09:52:05', '2026-01-27 10:11:31', '2026-01-27 09:52:05', '2026-01-27 10:11:31'),
(407, 1, 'd85a4339c59d8a0abf78feaecf95356b1b85bcb6fd9c8871fb787b3b4172ea78', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-10 10:11:31', '2026-01-27 10:27:41', '2026-01-27 10:11:31', '2026-01-27 10:27:41'),
(408, 1, '7e9ec4f7e20cfd888c9027978986c7bdafc4beca7ef7987b1090ea8d84e09301', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-10 10:27:41', '2026-01-27 10:50:30', '2026-01-27 10:27:41', '2026-01-27 10:50:30'),
(410, 1, '473771888a888733778c185979ff4d3c101d6bdf51ebab4147e3c4a9ec8155d0', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-10 10:50:30', '2026-01-27 11:05:31', '2026-01-27 10:50:30', '2026-01-27 11:05:31'),
(412, 1, '4d3ab7752be5b3456ec141b99a00df3b3d2b5e58266d2cf0f74a642388a71511', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-10 11:05:31', '2026-01-27 11:20:56', '2026-01-27 11:05:31', '2026-01-27 11:20:56'),
(413, 1, '2a4c316105176a950909b3e2bd3afcb33f8c940440e4af86e3dca9505962283c', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-10 11:20:56', NULL, '2026-01-27 11:20:56', '2026-01-27 11:20:56'),
(440, 1, '6f6a3d9c47cc83e99128a5e18bcfff1c908518487c7c4ebd23be0610a23d7a08', NULL, '106.219.161.27', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-11 05:10:19', '2026-01-28 05:26:23', '2026-01-28 05:10:19', '2026-01-28 05:26:23'),
(442, 1, '4b8f1a9295a4e9f74368059fb4f4839a3691f920548df714c718bf3c100a1786', NULL, '106.219.164.188', 'PostmanRuntime/7.51.0', '2026-02-11 05:15:24', NULL, '2026-01-28 05:15:24', '2026-01-28 05:15:24'),
(443, 1, 'fc31951b0794036c66731aec3b2d79eaf4824e4e50202d5d349469455644e411', NULL, '106.219.161.27', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-11 05:26:23', NULL, '2026-01-28 05:26:23', '2026-01-28 05:26:23'),
(461, 1, 'c532825611addd4bf91c64acff9cf31bf1340dc1b7a23870ae0eb9ae0d1cb5a7', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-11 06:55:23', '2026-01-28 07:11:55', '2026-01-28 06:55:23', '2026-01-28 07:11:55'),
(463, 1, 'ef39ec5074490de37c0d041fa728d866e7ddf99b73e793896151663fe7a4990a', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-11 07:11:55', '2026-01-28 07:27:23', '2026-01-28 07:11:55', '2026-01-28 07:27:23'),
(464, 1, '8989c1aeaeab86fdfa540b554099f20bb1acd6450cddc556981a5c38bcff7e82', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-11 07:27:23', '2026-01-28 08:23:07', '2026-01-28 07:27:23', '2026-01-28 08:23:07'),
(467, 1, 'c3f18d78ad09ee61aa794ac522d741b5f0ebf4e3ac28d96979676b5ace6f9112', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-11 08:23:07', '2026-01-28 08:38:13', '2026-01-28 08:23:07', '2026-01-28 08:38:13'),
(468, 1, '8a38cedb2be05830a0bc1037386305e80a3204456eff238b6339035a60fab019', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-11 08:38:13', NULL, '2026-01-28 08:38:13', '2026-01-28 08:38:13'),
(470, 1, 'cbc7742205258ef09bd82ece1bb1039ec30cb65e3160a41d120f920f84a1fc22', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-11 08:50:22', '2026-01-28 09:05:40', '2026-01-28 08:50:22', '2026-01-28 09:05:40'),
(471, 1, '6ad3c257bb4dfcd4b2a74ac3aed5a96c1f052f28969030e6e9c48746ad4333af', NULL, '106.219.164.188', 'PostmanRuntime/7.51.0', '2026-02-11 08:55:02', NULL, '2026-01-28 08:55:02', '2026-01-28 08:55:02'),
(473, 1, 'aab6edc9ae8e0ea7103fe36d941ad0b9361ec99335e335c686ce14a0f208cb3d', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-11 09:05:40', '2026-01-28 09:20:54', '2026-01-28 09:05:40', '2026-01-28 09:20:54'),
(474, 1, '38585f4ece887d00a4782e314f41c93ac11452c486a6653022f49d055be9773d', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-11 09:20:54', '2026-01-28 09:36:16', '2026-01-28 09:20:54', '2026-01-28 09:36:16'),
(476, 1, '542e87d216253e54a1a552473bd2e81dc151475af2fe42d596ef6d541508536d', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-11 09:36:16', '2026-01-28 09:57:45', '2026-01-28 09:36:16', '2026-01-28 09:57:45'),
(477, 1, 'df57940d7010ed5a7a63d0a7fe80aeed78414419ff15a55d32f413b0c3104547', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-11 09:57:45', '2026-01-28 10:14:37', '2026-01-28 09:57:45', '2026-01-28 10:14:37'),
(479, 1, 'f06165ead11619317f97ed5e1cafe0abd1c731db10da651104fa7314b0358ece', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-11 10:14:37', '2026-01-28 10:33:01', '2026-01-28 10:14:37', '2026-01-28 10:33:01'),
(482, 1, '5fc9ff3b77534865db3bc377cf08d2d978840704d964801e58271bf66b247978', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-11 10:33:01', '2026-01-28 10:55:53', '2026-01-28 10:33:01', '2026-01-28 10:55:53'),
(485, 1, '94864d72c2a206e4cca80537846b9faea62312ca48bc7799f83be315e8cc1fc0', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-11 10:55:53', '2026-01-28 11:11:09', '2026-01-28 10:55:53', '2026-01-28 11:11:10'),
(487, 1, 'a1aae80aea4d0f140fc58c9d188621510d4cd5c9d570de436bff4a8d58ac2c09', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-11 11:11:10', NULL, '2026-01-28 11:11:10', '2026-01-28 11:11:10'),
(490, 1, '051ece71abffe6a5abc7281c2bd560d0c09cbbb50ceb679c9666bcacbe55df7f', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-12 03:05:45', '2026-01-29 03:21:24', '2026-01-29 03:05:45', '2026-01-29 03:21:24'),
(494, 1, 'e8358110ef7c9cbc036131357debbdee1350003e7c108f93572114e873530f66', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-12 03:21:24', '2026-01-29 04:09:22', '2026-01-29 03:21:24', '2026-01-29 04:09:22');
INSERT INTO `pda_user_tokens` (`id`, `pda_user_id`, `refresh_token_hash`, `device_id`, `ip_address`, `user_agent`, `expires_at`, `revoked_at`, `created_at`, `updated_at`) VALUES
(502, 1, '4d178a10cd94801fa41aeef2fd097fa4191a3156001c1918c41b90f9c8122632', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-12 04:09:22', '2026-01-29 04:29:32', '2026-01-29 04:09:22', '2026-01-29 04:29:32'),
(504, 1, '19a9fd6b6ea19fadc1e7e343ce2eb5376d630a7f717827bc18d9ed0bde71f663', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-12 04:29:32', '2026-01-29 04:53:13', '2026-01-29 04:29:32', '2026-01-29 04:53:13'),
(505, 1, 'da5c897286c7c8e34fd308ba9a097d6053df1e57ecfca183f27105976d8c052a', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-12 04:53:13', '2026-01-29 05:34:49', '2026-01-29 04:53:13', '2026-01-29 05:34:49'),
(508, 1, '98ff30e97babc6f3b806ed01b1c9c75e6e8f10430042e1e3bbdbfd654bf067ff', NULL, '106.219.164.188', 'PostmanRuntime/7.51.0', '2026-02-12 05:04:11', NULL, '2026-01-29 05:04:11', '2026-01-29 05:04:11'),
(509, 1, '1f07ad5486ff80fb377d06a82d8eb9aca01ee94fd38de7652f1242a2dfa3b80d', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-12 05:34:49', '2026-01-29 06:09:45', '2026-01-29 05:34:49', '2026-01-29 06:09:45'),
(513, 1, '6552138ef287230d625053de5e103974ab4c1ef43883b2db5b93ee945872e90d', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-12 06:09:45', '2026-01-29 06:25:48', '2026-01-29 06:09:45', '2026-01-29 06:25:48'),
(515, 1, 'fe9746e0cdc825b0f0c255b9d9aa21021ee0408a8aeb766f0bb14d055a821973', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-12 06:25:48', '2026-01-29 07:01:51', '2026-01-29 06:25:48', '2026-01-29 07:01:51'),
(520, 1, '6b86560817ec866a71966f17e33076517d827eab17d1c1c560cdb304a58d5dde', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-12 07:01:51', '2026-01-29 07:20:50', '2026-01-29 07:01:51', '2026-01-29 07:20:50'),
(524, 1, '8f18b60a23f4754ae7742b5c87d10015aa962014ded019bcacf2e565fd4d40ea', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-12 07:20:50', '2026-01-29 08:24:37', '2026-01-29 07:20:50', '2026-01-29 08:24:37'),
(527, 1, '15611e059f7f1a7c3d68c3e6d8431df83b53051b9ad33ed2336fb0e91421e176', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-12 08:24:37', '2026-01-29 08:46:35', '2026-01-29 08:24:37', '2026-01-29 08:46:35'),
(530, 1, '1817247b370d95d1710aa6871804ebb850c705602521c6b3b1dc0fdccdcae3a4', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-12 08:46:35', '2026-01-29 09:12:49', '2026-01-29 08:46:35', '2026-01-29 09:12:49'),
(535, 1, '8e99163af4d5e2e6a47c549d3628ce54defdf75ca062e12f5386b6764a57e6a5', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-12 09:12:49', '2026-01-29 09:41:38', '2026-01-29 09:12:49', '2026-01-29 09:41:38'),
(541, 1, 'd859293bbb7438b79d4018f5dd3a160c5512d622d54f5b62dd44683b2ebcad86', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-12 09:41:38', '2026-01-29 10:00:19', '2026-01-29 09:41:38', '2026-01-29 10:00:19'),
(542, 1, '081c53c910dab4b0e14a1616f8e2581a9308862a8040d6cb316e916267f4f627', NULL, '106.219.164.188', 'PostmanRuntime/7.51.0', '2026-02-12 09:43:34', NULL, '2026-01-29 09:43:34', '2026-01-29 09:43:34'),
(544, 1, 'c55ce36fd9796a9c2eccb7f8c274042c0770e90b2c6489a527487444faa15add', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-12 10:00:19', '2026-01-29 10:18:11', '2026-01-29 10:00:19', '2026-01-29 10:18:11'),
(547, 1, 'bcb5fc762f675eed1d362dc8d618e57f7f334511f61e3c4d3f73bafe3c6ed165', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-12 10:18:11', '2026-01-29 10:35:51', '2026-01-29 10:18:11', '2026-01-29 10:35:51'),
(549, 1, '942259bc854bb94e8cef3151fd00fb760ab828d8f5b563408db5239783f57c69', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-12 10:35:51', '2026-01-29 11:06:19', '2026-01-29 10:35:51', '2026-01-29 11:06:19'),
(552, 1, '9e9fac9cdc3e6485b27539a034d9020e23efbc7e7d3e149689dda0d84989ce55', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-12 11:06:19', NULL, '2026-01-29 11:06:19', '2026-01-29 11:06:19'),
(555, 1, '99c814832b569e0511c409b0a322cc7072a499bc4ee4f34a556e623eaca9f04e', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 02:55:44', '2026-01-30 03:11:49', '2026-01-30 02:55:44', '2026-01-30 03:11:49'),
(557, 1, '8b9b671cf58b12ec7596b11b7f4e0011e5d0b67d611766aefa63f77d4c062775', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-13 03:11:49', NULL, '2026-01-30 03:11:49', '2026-01-30 03:11:49'),
(558, 1, '0bda18b0b526050325d777b6269159984a5dccabef9904d658a4759ffcecfdac', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 03:13:07', '2026-01-30 03:30:42', '2026-01-30 03:13:07', '2026-01-30 03:30:42'),
(559, 1, 'f67bb61bb124ad70aadec77a24b41bb7658327e12f7bc90a4e170e76bae5ec19', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-13 03:30:42', NULL, '2026-01-30 03:30:42', '2026-01-30 03:30:42'),
(561, 1, '1a3c63cb8df84295536f041b0b842b2da8efecf0be5bcaa254536ed6af5e609d', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-13 03:39:42', '2026-01-30 04:02:31', '2026-01-30 03:39:42', '2026-01-30 04:02:31'),
(563, 1, '82b6d5cf2fdf120ef91a46b5a15eeab99960274beb15acce9a18fe304ea3d728', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-13 04:02:31', '2026-01-30 04:18:58', '2026-01-30 04:02:31', '2026-01-30 04:18:58'),
(564, 1, 'acc159bf805e9a49cc9fbba339fc0794ddeda66bb0f7422fad655700169e9b82', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 04:04:52', '2026-01-30 04:13:34', '2026-01-30 04:04:52', '2026-01-30 04:13:34'),
(566, 1, '7ef2bad586142a6de833b4a5d4826e96a5ada2e72ee8e8e45a846e10d28c86a8', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-13 04:13:48', '2026-01-30 05:26:27', '2026-01-30 04:13:48', '2026-01-30 05:26:27'),
(567, 1, 'e34d038923ed345a2025228d33d998653ee9ab01f5872d65969d83f1975cbbe3', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-13 04:18:58', '2026-01-30 04:20:34', '2026-01-30 04:18:58', '2026-01-30 04:20:34'),
(572, 1, 'bb969475a5a251f5580014b398b407fbb5a4c0feb0619fb1f3619c7ec14bb0a7', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-13 05:26:27', '2026-01-30 05:56:20', '2026-01-30 05:26:27', '2026-01-30 05:56:20'),
(574, 1, '538669bdc3a0a8ac4931bafd576db42b5681cb9a7ee94b2033fa126952e5a0ca', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-13 05:56:20', '2026-01-30 06:13:34', '2026-01-30 05:56:20', '2026-01-30 06:13:34'),
(576, 1, '8333fee7c94484bc5100c358dc8361b3cc3bf7a30b3ec56cec2f74b9a75fce63', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-13 06:13:34', '2026-01-30 06:38:18', '2026-01-30 06:13:34', '2026-01-30 06:38:18'),
(578, 1, 'fa41c51f72764539d92eb3f61ffc2ce64220a67228c5d2dbd3baf4d93cbd54e4', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 06:32:12', '2026-01-30 06:48:14', '2026-01-30 06:32:12', '2026-01-30 06:48:14'),
(579, 1, 'f006dd4879adae2f326eddf993ef547632505ad1a444492d0b4cf59c504093d9', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 06:38:18', '2026-01-30 06:53:34', '2026-01-30 06:38:18', '2026-01-30 06:53:34'),
(581, 1, 'e4c0968d669e343289f799b972c60a5fa8cae0a8a32d8d8baaeaa1e45d7d6240', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 06:48:14', '2026-01-30 07:03:29', '2026-01-30 06:48:14', '2026-01-30 07:03:29'),
(582, 1, '219cd3fa4d9b7304861fa07821ebcfcb3c689d2f12e3cfd87a0c482996b3b3d4', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 06:53:34', '2026-01-30 07:15:00', '2026-01-30 06:53:34', '2026-01-30 07:15:00'),
(585, 1, '8d43834074a15bbd286b8c2d92a7feda64e6a97689d533bb660ce72b5f58e547', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 07:03:29', '2026-01-30 08:36:46', '2026-01-30 07:03:29', '2026-01-30 08:36:46'),
(586, 1, 'e5ee9a653ac5e40b6a44dc3e5a0424fde19b255a4ff9fd3aa070ac1e8f456fd9', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 07:15:00', '2026-01-30 07:30:29', '2026-01-30 07:15:00', '2026-01-30 07:30:29'),
(588, 1, '8e6760347c658cbe873a5d061d2b707b29b35c5cec96f6018711a0bae4ee0984', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 07:30:29', '2026-01-30 08:24:48', '2026-01-30 07:30:29', '2026-01-30 08:24:48'),
(591, 1, 'd87e0e108c915dd80a1c63cbe90dc4eefaa9daeeffebbc16801fa9c24ebe4b7d', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 08:24:48', '2026-01-30 08:31:54', '2026-01-30 08:24:48', '2026-01-30 08:31:54'),
(592, 1, '5ecc936d2ba232a35a5026082cae217b34d9d6f6488387cc6c4bd4ff4fe70594', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 08:32:40', '2026-01-30 09:16:26', '2026-01-30 08:32:40', '2026-01-30 09:16:26'),
(594, 1, 'c3f6d7758fbb20cf3c02538d4b813fb5efe5ad219c1b09f068758b8427344854', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 08:36:46', '2026-01-30 08:37:14', '2026-01-30 08:36:46', '2026-01-30 08:37:14'),
(595, 1, '562dfb587e87e686cd3bc9b3e2dfc0599ad9c89c9c182af6fe61799b8cd1b34c', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-13 08:37:32', '2026-01-30 08:52:55', '2026-01-30 08:37:32', '2026-01-30 08:52:55'),
(597, 1, 'b5d134cf467ae6fc94954784b683a4ecac329cbf74fdd28d89edc22b30b4bf41', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 08:39:06', '2026-01-30 08:39:49', '2026-01-30 08:39:06', '2026-01-30 08:39:49'),
(598, 1, '243e7e72d6874fea544d389cdef2de415f63d12ea6b2904c30788b52d7c6225c', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 08:44:15', '2026-01-30 09:04:37', '2026-01-30 08:44:15', '2026-01-30 09:04:37'),
(600, 1, '0e4098a865de524db13da245722c33852df11e169c197de394af3efa2fab0262', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-13 08:52:55', '2026-01-30 09:08:06', '2026-01-30 08:52:55', '2026-01-30 09:08:06'),
(602, 1, '7bae804a16ea80b2d5616cd656d1cd923ac764b5afcd2b3708b81c3b6c180d79', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 09:04:37', '2026-01-30 09:19:51', '2026-01-30 09:04:37', '2026-01-30 09:19:51'),
(603, 1, '1a3a9d42a9024046a499e115fe6ed00393172fcbacf0521942d61e79741aa95c', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-13 09:08:06', '2026-01-30 09:23:11', '2026-01-30 09:08:06', '2026-01-30 09:23:11'),
(606, 1, '4eafe1ff0cefffc39856c90220da488ee2d3bb9aadf18ab553c43cfcb4fcf1bf', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 09:16:26', '2026-01-30 09:41:10', '2026-01-30 09:16:26', '2026-01-30 09:41:10'),
(608, 1, '694225c8cde5e3c9d1371a0e37aba04141daee7903db1ac91b50f004e6b6db79', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 09:19:51', '2026-01-30 10:42:36', '2026-01-30 09:19:51', '2026-01-30 10:42:36'),
(610, 1, '10dabfc8b37515bc97361877047de2890dcdfba2e259c1ed9683aa84db19555c', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-13 09:23:11', '2026-01-30 09:39:30', '2026-01-30 09:23:11', '2026-01-30 09:39:30'),
(612, 1, '18dc142083d7fe8932c30a511ad97d6769e4e42e8c89b04a304b77f8bb44bb45', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-13 09:39:30', '2026-01-30 09:55:18', '2026-01-30 09:39:30', '2026-01-30 09:55:18'),
(613, 1, 'bee6d69ff01045908d80feca68131022b618abbb0aeca9b5d736edd2a1e7f148', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 09:41:10', '2026-01-30 10:01:38', '2026-01-30 09:41:10', '2026-01-30 10:01:38'),
(616, 1, '303f9bb303fa51a243fa45e642930267eb545395811a41eaf569e67cb0365ff0', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-13 09:55:18', '2026-01-30 10:11:37', '2026-01-30 09:55:18', '2026-01-30 10:11:37'),
(619, 1, 'aefc1b367cbab2fb9e20efb3f96b3ab3ddfed02865de0e1030e1d4e57ab4aeea', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 10:01:38', '2026-01-30 10:23:46', '2026-01-30 10:01:38', '2026-01-30 10:23:46'),
(620, 1, 'cadb9103bb3821f3749b81bcf3874d1627e27000d5b8bd23bfccab70cb05fc4c', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 10:11:37', '2026-01-30 10:27:19', '2026-01-30 10:11:37', '2026-01-30 10:27:19'),
(622, 1, '1b49df852089b2d00da27feaa99eb12a62f8f33a17595aee661fed14ab699fe1', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 10:23:46', '2026-01-30 11:02:16', '2026-01-30 10:23:46', '2026-01-30 11:02:16'),
(624, 1, '16358b5c8e8e0c1a363c4af9901d8ee8963555981ecfce542b7ad7b79d63ec6d', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-13 10:27:19', '2026-01-30 11:09:44', '2026-01-30 10:27:19', '2026-01-30 11:09:44'),
(627, 1, '03d065cd8a9fe33fb215cef7e34e468fadd5effafe61a48d773f0f2963726ded', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 10:42:36', '2026-01-31 02:33:24', '2026-01-30 10:42:36', '2026-01-31 02:33:24'),
(630, 1, '8e9e34e0564eec79918e8dc7a43c8d82d3916d9958c0b114c1267c348b8a6337', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-13 11:02:16', NULL, '2026-01-30 11:02:16', '2026-01-30 11:02:16'),
(633, 1, 'd297f2138ed3872656da27d7461244f814fd4896f2aa45afd55b499babf9533e', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-13 11:09:44', '2026-01-30 11:31:28', '2026-01-30 11:09:44', '2026-01-30 11:31:28'),
(635, 1, 'dfbe74f2c9fb70e788166323e169c39d7f73423b29efadcd14b57c8eb3177279', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-13 11:31:28', NULL, '2026-01-30 11:31:28', '2026-01-30 11:31:28'),
(636, 1, '173371de53f6835767b99df7d0e0f50b49095b2d02bf2065308f5e3dd679b1a4', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-14 02:33:24', '2026-01-31 08:33:54', '2026-01-31 02:33:24', '2026-01-31 08:33:54'),
(639, 1, '82449b68276e20daea39054fe4dffb4d0f8e2f16811f6820838022be83a2a8b5', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-14 02:50:36', NULL, '2026-01-31 02:50:36', '2026-01-31 02:50:36'),
(641, 1, '3b2c50d389c6f4eb53c39b7dac17f309fca15ef35d0b827da49338fb663473b8', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-14 03:08:48', '2026-01-31 03:32:13', '2026-01-31 03:08:48', '2026-01-31 03:32:13'),
(642, 1, '6be37e98b19e418f20a7a9fbea5098e4c780b8f4ce5ca69c107750b3e31217d1', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-14 03:32:13', '2026-01-31 03:48:42', '2026-01-31 03:32:13', '2026-01-31 03:48:42'),
(645, 1, '5b511a5dc98f5bc3e06adeb621387cae87d7248a06f9b80a97a2231acf94a062', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-14 03:48:42', '2026-01-31 04:26:51', '2026-01-31 03:48:42', '2026-01-31 04:26:51'),
(647, 1, '51504b68b2d045f925c20199f21091a4992c208427ca6a7a22b301541dfdb790', NULL, '106.219.164.188', 'PostmanRuntime/7.51.1', '2026-02-14 03:59:32', NULL, '2026-01-31 03:59:32', '2026-01-31 03:59:32'),
(651, 1, '5a824c48145d93579a00d184913cce2fd30f783515b7d55c04bc5d71c3deb9c8', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-14 04:15:21', NULL, '2026-01-31 04:15:21', '2026-01-31 04:15:21'),
(652, 1, '957fa2c18eef3e15f2144e8481eeafad1a47154aa8306a10edce4ed6148924de', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-14 04:16:49', '2026-01-31 06:35:21', '2026-01-31 04:16:49', '2026-01-31 06:35:21'),
(653, 1, '514ab273c24b826d22747ebe6c4c09958d5fdbc814ab2adca289b2b5b63cf1e1', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-14 04:26:51', '2026-01-31 05:57:27', '2026-01-31 04:26:51', '2026-01-31 05:57:27'),
(656, 1, '9f9fdd590680a4ca7c111a19fceae4457f173c90d1150fc1fea0cd3ed2524263', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-14 05:57:27', '2026-01-31 07:00:33', '2026-01-31 05:57:27', '2026-01-31 07:00:33'),
(658, 1, 'c98f9c3c85ace113cccfd2f5cf936d79f1fd13ef04746ac7c23b4c512ccb436b', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-14 06:35:21', NULL, '2026-01-31 06:35:21', '2026-01-31 06:35:21'),
(660, 1, '0cd8443e4d00322f7540350d58e2501d93cec01be2716bac150e981ecaaaafa7', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-14 07:00:33', '2026-01-31 07:18:49', '2026-01-31 07:00:33', '2026-01-31 07:18:49'),
(662, 1, '507c18774cd772fa6d671ab5c9296335650891a4e8630526eb71923e84cb750d', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-14 07:18:49', '2026-01-31 08:23:32', '2026-01-31 07:18:49', '2026-01-31 08:23:32'),
(663, 1, '448a9c305195aa4357992f309e8e583b2c18daa6a5ce75b10ce1552904a5e94b', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-14 08:23:32', NULL, '2026-01-31 08:23:32', '2026-01-31 08:23:32'),
(665, 1, '1a0b3b7db2586a4d29b87cf0543b03efd304eceb5da837af9742f9bd4e6b246f', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-14 08:28:05', '2026-01-31 09:02:15', '2026-01-31 08:28:05', '2026-01-31 09:02:15'),
(666, 1, '41ece7823cf7e39f41f238879ca2af64ad37df462b1f81931bfd0f361a732fbc', NULL, '106.219.167.58', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-14 08:33:54', '2026-02-01 02:51:17', '2026-01-31 08:33:54', '2026-02-01 02:51:17'),
(667, 1, '845b4353eba8885735abbf44a0c7f1fa37f4142bc365d31bf0bf7e2d1f3d5e91', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-14 09:02:16', '2026-01-31 09:17:20', '2026-01-31 09:02:16', '2026-01-31 09:17:20'),
(670, 1, '1f21cd9f91238c21874d74893a7bccbf2519ef1710958356943c9ae6eb15a7b9', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-14 09:17:20', '2026-01-31 09:34:55', '2026-01-31 09:17:20', '2026-01-31 09:34:55'),
(674, 1, 'c5ca8dcb71b9f402958a190953d3c2c483250b442f7eacbdca37a958ed8139ee', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-14 09:34:55', '2026-01-31 10:03:38', '2026-01-31 09:34:55', '2026-01-31 10:03:38'),
(675, 1, '164fcdbe1b705e15b972b1d0c98a5373ef51eeaab3f2cdad340550a624071b11', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-14 09:38:38', NULL, '2026-01-31 09:38:38', '2026-01-31 09:38:38'),
(676, 1, 'da36f4df0c41bbff4190c091f515423c1c8ca928c3596a0ef3d5c520e661ed48', NULL, '106.219.164.188', 'PostmanRuntime/7.51.1', '2026-02-14 09:40:57', NULL, '2026-01-31 09:40:57', '2026-01-31 09:40:57'),
(678, 1, 'a20e66e26e7b03bb1b9e5072230b0018bfa5ec3dbb523829eb9d05ac62c5665e', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-14 10:03:38', NULL, '2026-01-31 10:03:38', '2026-01-31 10:03:38'),
(681, 1, 'd582293396bd403dc904a76c8069983c3cb6ed9f02c4c6d98c7955b99a988f8c', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-14 10:26:59', '2026-01-31 10:48:30', '2026-01-31 10:26:59', '2026-01-31 10:48:30'),
(685, 1, '8e2cd00f2f17078e7f03b8d7d5e8ced1e2a646112090b94309c2d2981da21a27', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-14 10:48:30', '2026-01-31 11:04:36', '2026-01-31 10:48:30', '2026-01-31 11:04:36'),
(687, 1, 'b307231ba99de9e53065027e800d94598dd3570ee908116112d7066a3ace4566', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-14 11:04:36', NULL, '2026-01-31 11:04:36', '2026-01-31 11:04:36'),
(696, 1, '66e559ca7932da772fb0543683f92d39ce73580e79bef90f7e3a7584a6d5f718', NULL, '106.219.167.58', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-15 02:51:17', NULL, '2026-02-01 02:51:17', '2026-02-01 02:51:17'),
(699, 1, '237d7ecc191fc1207bb3e066201fbd2202a2edb8a4ac06a49a97fbb6bee75643', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-15 03:56:44', '2026-02-01 04:46:58', '2026-02-01 03:56:44', '2026-02-01 04:46:58'),
(702, 1, 'e6ecd89fe7877bd5896e1a7bbbd312b22f9d3c9bd08ea4aa123270313de49fcf', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-15 04:46:58', '2026-02-01 05:34:10', '2026-02-01 04:46:58', '2026-02-01 05:34:10'),
(705, 1, '947af9bd71560000d728b8e1439e093e745b5f2b13baadb515821c619e7995ba', NULL, '106.219.164.188', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-15 05:34:10', NULL, '2026-02-01 05:34:10', '2026-02-01 05:34:10'),
(710, 1, 'f25d239667bde1537d36d07171fe59baa84f97fba021307e57acaf1c8df48861', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', '2026-02-15 08:51:40', NULL, '2026-02-01 08:51:40', '2026-02-01 08:51:40'),
(711, 1, '1a406ee488255073e8a23995c4a8b903d3a1e95f13de49f6bd0f92c2d526f4f9', NULL, '106.219.164.188', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-15 08:53:01', '2026-02-01 08:56:01', '2026-02-01 08:53:01', '2026-02-01 08:56:01'),
(712, 1, '2277b61332143c9aa9b35a029422f344b3c4a2a2b7245ee9fecb93c04c0a536b', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 02:58:24', '2026-02-02 04:17:26', '2026-02-02 02:58:24', '2026-02-02 04:17:26'),
(715, 1, '75213c5d56899c175caf2f058fd061bce249155454f09283c55fc792ec03332d', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 04:17:26', '2026-02-02 04:24:35', '2026-02-02 04:17:26', '2026-02-02 04:24:35'),
(716, 1, 'e1236449ca0982dfef169f0817c4ee38d99662051537cf09ff5746556c97399e', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 04:19:46', '2026-02-02 04:20:06', '2026-02-02 04:19:46', '2026-02-02 04:20:06'),
(718, 1, 'b7d62891b01d4478b8a27fd98c2f1f60c615be9024df3cb0ba55860411bb202e', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 04:24:54', '2026-02-02 04:41:01', '2026-02-02 04:24:54', '2026-02-02 04:41:01'),
(720, 1, '94baffe3a4245f930c297000877dfc243e156395c353150297a82371cb4cf656', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 04:41:01', '2026-02-02 04:56:20', '2026-02-02 04:41:01', '2026-02-02 04:56:20'),
(722, 1, 'f8528720682182e96b08cdfde2aa65b43e69a188690ae954ff77f476b10263b8', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 04:56:20', '2026-02-02 05:11:36', '2026-02-02 04:56:20', '2026-02-02 05:11:36'),
(724, 1, '1d301290df80f430c34afe6673d111c719a5390e2bcf0dea251e274bc7385b9b', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 05:11:36', '2026-02-02 05:34:25', '2026-02-02 05:11:36', '2026-02-02 05:34:25'),
(726, 1, '9bb7612467dbd9dad2bbcfb65a5ec587a0fe4205b27b3f7c4f7d64b176a0bd3b', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 05:34:25', '2026-02-02 05:50:01', '2026-02-02 05:34:25', '2026-02-02 05:50:01'),
(728, 1, 'c99b2a1e6130b648a4bfbf6eb6ce338562f9cdb4e5e42d0480eb1988d9c89ce2', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 05:50:01', '2026-02-02 06:15:48', '2026-02-02 05:50:01', '2026-02-02 06:15:48'),
(731, 1, 'adc945f3e83886eb54feff79cfbcea42f565e7ead2663fb06b0c41d74894e89d', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 05:59:18', '2026-02-02 06:20:41', '2026-02-02 05:59:18', '2026-02-02 06:20:41'),
(733, 1, '2aac1d2b305c202637bef865f33edf872d70c37af7608d6b113d5a1e7034050a', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 06:15:48', '2026-02-02 06:45:34', '2026-02-02 06:15:48', '2026-02-02 06:45:34'),
(735, 1, '19e5496e90262ba0feb48b3fb0c062bbb35d95ce289f422a2e56e05608caabee', NULL, '106.219.162.139', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-16 06:20:41', '2026-02-02 06:38:19', '2026-02-02 06:20:41', '2026-02-02 06:38:19'),
(737, 1, 'e23e3e82a4c0e5abb4f0f0c1f7cba8c1f0e9755b3701f3ce1e62cbafe7228a49', NULL, '106.219.162.139', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-16 06:38:19', NULL, '2026-02-02 06:38:19', '2026-02-02 06:38:19'),
(739, 1, 'f65c483a7086f5e8c3a5de492687f4c7cd0a717ef817a9c6b3e8d539292f0298', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 06:45:34', '2026-02-02 07:02:51', '2026-02-02 06:45:34', '2026-02-02 07:02:51'),
(743, 1, 'db69485293b31abd88ec97d46942310a036bdd7e998aca6e8951fb99d7350873', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 07:02:51', '2026-02-02 07:18:16', '2026-02-02 07:02:51', '2026-02-02 07:18:16'),
(746, 1, 'b5aa94bcb7de6bd1fb252b2c7a9f75f65de30ef414e33386b79c29b968d90c17', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 07:18:16', '2026-02-02 08:19:28', '2026-02-02 07:18:16', '2026-02-02 08:19:28'),
(751, 1, '77ad15f3722c41dc112800bb446a90bf24897340828df06c9d57edbc79318f8f', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 08:19:28', '2026-02-02 08:36:15', '2026-02-02 08:19:28', '2026-02-02 08:36:15'),
(754, 1, '753df29f7adbce6fa7a9da5a1c9f9226de33ae564c3527eb4aa67ddd9a7428e8', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 08:32:20', '2026-02-03 02:44:26', '2026-02-02 08:32:20', '2026-02-03 02:44:26'),
(756, 1, 'fbba27aa44da35fa8279e6cb1095a13a52e3e520afbfb9b3fb602376c9d1097c', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 08:36:15', '2026-02-02 09:04:34', '2026-02-02 08:36:15', '2026-02-02 09:04:34'),
(760, 1, 'fb52f3ff4ee280666ddccea6ce48443f9b8e955fccc6cbbe6a4058d3b7d46e98', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 09:04:34', '2026-02-02 09:53:08', '2026-02-02 09:04:34', '2026-02-02 09:53:08'),
(766, 1, '53670b456b855cc10286608d4244ccd799ba671296c2d97bc6eb42d554ab3c44', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 09:35:57', '2026-02-02 09:51:24', '2026-02-02 09:35:57', '2026-02-02 09:51:24'),
(769, 1, 'eb3e405bded09d002cb9ca405e2e849ad127df78384665ba839a2951e3cc0189', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 09:51:24', '2026-02-02 11:01:00', '2026-02-02 09:51:24', '2026-02-02 11:01:00'),
(770, 1, '72a509442eea85f17591c3835e4166d717fe5ecdeac694cdd9fa83b3aaa9970d', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 09:53:08', '2026-02-02 10:09:37', '2026-02-02 09:53:08', '2026-02-02 10:09:37'),
(771, 1, '6b0a4ad42302f69ec6f089eaa1d3230018c18766280b9f3f5d5cdf2d70572c18', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 10:09:37', '2026-02-02 10:29:30', '2026-02-02 10:09:37', '2026-02-02 10:29:30'),
(773, 1, 'b00aaa87fc85d354f84c62e5a034e7e856cb637364d187a67edd57b25442a730', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 10:29:30', '2026-02-02 10:44:34', '2026-02-02 10:29:30', '2026-02-02 10:44:34'),
(776, 1, '6e89e70c2d3871c948760bb8a779795c912692bfbb6bd9913855f1694324a46a', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 10:44:34', NULL, '2026-02-02 10:44:34', '2026-02-02 10:44:34'),
(778, 1, '41305393db8498c58114efa06ccff3a223261b958eaded98b1c1fb8544635aa4', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 11:01:00', '2026-02-02 11:22:10', '2026-02-02 11:01:00', '2026-02-02 11:22:10'),
(779, 1, '31bcb209375995d04897f765d8ceab5b4f06e42695f8c14f6a6477b7eda0b9bd', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-16 11:22:10', NULL, '2026-02-02 11:22:10', '2026-02-02 11:22:10'),
(784, 1, 'c08112575bf287bfed9c46084848177555eb3c34ca29087baa6fa40262220973', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 02:44:26', '2026-02-03 03:02:46', '2026-02-03 02:44:26', '2026-02-03 03:02:46'),
(786, 1, '9aa96471106f5132de3c82bf921f7db7bf5464fd9ad94f58357c437401f549c4', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 02:54:18', '2026-02-03 03:16:24', '2026-02-03 02:54:18', '2026-02-03 03:16:24'),
(787, 1, '5456f698f3afa4e3f4f95f4eb5c3f8f61b58c2aaaab7314c7a28c1d45f9ec87f', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 03:02:46', '2026-02-03 03:03:17', '2026-02-03 03:02:46', '2026-02-03 03:03:17'),
(788, 1, '2fea35875b301022feb12bd217a85da8ad3570319bf3fd464a75f7f0c754a5c1', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 03:06:06', NULL, '2026-02-03 03:06:06', '2026-02-03 03:06:06'),
(790, 1, '61c0f50a17aeef39471a48e0e8f2a57b6cf33d357fdd4b1d5484e4b7ec2a4de3', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 03:16:24', '2026-02-03 03:52:04', '2026-02-03 03:16:24', '2026-02-03 03:52:04'),
(794, 1, 'f5bc747c6b8cb211ba39f2c46f8d11700a26410398e2afcaaca58d6cb13e54d0', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 03:52:04', '2026-02-03 05:10:27', '2026-02-03 03:52:04', '2026-02-03 05:10:27'),
(795, 1, 'a39ed8c35b735337521ab5175ab50404493a29491b265ffec72baedb0e43a125', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 03:52:49', '2026-02-03 05:10:27', '2026-02-03 03:52:49', '2026-02-03 05:10:27'),
(800, 1, '92529d86bdc894cfa8d57a8343bfc26ba822d1dcd760649e9d631f8483743e15', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 05:10:27', '2026-02-03 06:17:48', '2026-02-03 05:10:27', '2026-02-03 06:17:48'),
(801, 1, 'a9e308b949a9e4dd81a002e38f56239463acaf05be982e1632724623865fc31d', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 05:10:27', '2026-02-03 05:10:28', '2026-02-03 05:10:27', '2026-02-03 05:10:28'),
(802, 1, 'fdb981a011ac1b231a0e5d175a7634b9b10a584603b3a21897043d9673cf2430', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 05:10:28', '2026-02-03 05:28:28', '2026-02-03 05:10:28', '2026-02-03 05:28:28'),
(804, 1, '3c28e4edf2101d8b3ade793915a1a410b1dedc617cb1eaf38ca50d9dae719f04', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 05:28:28', '2026-02-03 05:46:02', '2026-02-03 05:28:28', '2026-02-03 05:46:02'),
(805, 1, '6f86fabd214a498f1b12119af7aa4a3d6f50a1fc379bf17f62596006d990316d', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 05:46:02', '2026-02-03 06:31:30', '2026-02-03 05:46:02', '2026-02-03 06:31:30'),
(810, 1, '3600174de77f8cb7bdfa2ed294bb0e7b2bfe9c428c6b8c95c18cddd57bcf0f39', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 06:17:48', '2026-02-03 06:33:40', '2026-02-03 06:17:48', '2026-02-03 06:33:40'),
(811, 1, '96b4ef709819b9da616bf10785ede52fa0c7b9ddc8530887de076f7585b31ba1', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 06:31:30', NULL, '2026-02-03 06:31:30', '2026-02-03 06:31:30'),
(813, 1, '03a87998cdab59e9ccc092e7655ac68ea0c120960b84862cb5696cee9aa7adba', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 06:33:40', '2026-02-03 06:55:22', '2026-02-03 06:33:40', '2026-02-03 06:55:22'),
(816, 1, '297ac61bb963fb4aee3d762d0bdd166291eac54d24c274002577e13ab369df4a', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 06:55:22', '2026-02-03 08:20:26', '2026-02-03 06:55:22', '2026-02-03 08:20:26'),
(817, 1, '7fe9f3743c70e77685f565f7cf8850f4707f37e44558d8bac34bf00fb89b16be', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 06:58:43', '2026-02-03 08:20:26', '2026-02-03 06:58:43', '2026-02-03 08:20:26'),
(821, 1, 'd766148ad91e038c4555b4c353f6b3915111cd25caf84883f1efed95a13d23db', NULL, '106.219.162.139', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 07:21:26', '2026-02-04 02:46:27', '2026-02-03 07:21:26', '2026-02-04 02:46:27'),
(822, 1, 'fb48503f031b0fae9e46fd4d3e784d6033effb08b6221ffd1953d462715a45ea', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 07:28:22', '2026-02-03 08:34:37', '2026-02-03 07:28:22', '2026-02-03 08:34:37'),
(826, 1, 'b5d9420364695b904b702714d3697ff822c830fe6ddcc129b1f7ebfc17b120f7', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 08:20:26', '2026-02-03 08:36:42', '2026-02-03 08:20:26', '2026-02-03 08:36:42'),
(827, 1, '13ea160c8283ad28dbc421cc8691c7b838042a1686f4ca2dfcce1e8092528709', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 08:20:26', '2026-02-03 08:51:44', '2026-02-03 08:20:26', '2026-02-03 08:51:44'),
(829, 1, '0046cc194805ebc9228cb3826d7dd37379eeabb724760721cbb6c34cc05aecc5', NULL, '106.219.162.139', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-17 08:34:37', '2026-02-03 08:50:36', '2026-02-03 08:34:37', '2026-02-03 08:50:36'),
(830, 1, 'b9c95f30b7b1a05c60f19e5a2b441aa0573c916131519a3c366af47767d4d3b9', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 08:36:42', '2026-02-03 08:51:44', '2026-02-03 08:36:42', '2026-02-03 08:51:44'),
(834, 1, 'cf4faf936482f4530773e942896ecfabdeb9b0e252af680f33c1f817c3ce6e02', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 08:50:36', '2026-02-03 09:06:15', '2026-02-03 08:50:36', '2026-02-03 09:06:15'),
(835, 1, 'eefaeecc09e3bbcc140b4e1e5a0a8b02205dac013fecf0d151126217aa91d343', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 08:51:44', '2026-02-03 09:07:19', '2026-02-03 08:51:44', '2026-02-03 09:07:19'),
(836, 1, '4867e1cc09886d10660ad0fa9cea3a1667aaff51ff4491762300ea72e3fe5a6a', NULL, '106.219.162.139', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-17 08:51:44', '2026-02-03 10:16:14', '2026-02-03 08:51:44', '2026-02-03 10:16:14'),
(839, 1, '34abc5fe8b1d3b96264851290e91112db03c42c90cfa94aa37a5da990201be8a', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 09:00:44', '2026-02-04 02:37:33', '2026-02-03 09:00:44', '2026-02-04 02:37:33'),
(840, 1, 'a5c539fd791ff7e30e117337abd2da22f07d1a2aae88290f2a9e6967c0bb5f9e', NULL, '106.219.162.139', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-17 09:06:15', '2026-02-03 09:28:41', '2026-02-03 09:06:15', '2026-02-03 09:28:41'),
(841, 1, 'f3e8a73b59d12ac104aabd619e1e95b1f2958040c48cd439fbdb96f9c25abf98', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 09:07:19', '2026-02-03 09:25:02', '2026-02-03 09:07:19', '2026-02-03 09:25:02'),
(842, 1, '8ed7197ccba3e1bc3cf6161b72fa1be1edf97f05a24df03af097bf510c5b37ce', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 09:25:02', '2026-02-03 10:06:17', '2026-02-03 09:25:02', '2026-02-03 10:06:17'),
(843, 1, '7717cd6425f415866f517ac69a890d843222482b3b5b5e5c6461b434dee61aef', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 09:28:42', '2026-02-03 11:00:28', '2026-02-03 09:28:42', '2026-02-03 11:00:28'),
(847, 1, 'a383377c533ee96657b52134cb42eeab1a64825c6a3010e3ee4b5aeeb4af1b13', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 10:06:17', '2026-02-03 10:28:33', '2026-02-03 10:06:17', '2026-02-03 10:28:33'),
(849, 1, 'd464ac607392ba681b62d7268531508fdcfffc7f5ac2e1a213c929df6011eb56', NULL, '106.219.162.139', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-17 10:16:14', '2026-02-03 10:31:27', '2026-02-03 10:16:14', '2026-02-03 10:31:27'),
(851, 1, 'f7dc2ba1357b44a1bc373cef543063e96120e58514123311cc87f0c223fa045c', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 10:28:33', '2026-02-03 10:51:26', '2026-02-03 10:28:33', '2026-02-03 10:51:26'),
(852, 1, '9768ce697e91a6321eaeed719c932b028d40c5abc1ca9a3e4477d0d71b9d0eb3', NULL, '106.219.162.139', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-17 10:31:27', '2026-02-03 10:51:26', '2026-02-03 10:31:27', '2026-02-03 10:51:26'),
(853, 1, 'eb0f99a90713460c1e40988d2f5b2d4b3669cf44cfcc31531b21a5becb3e644f', NULL, '106.219.162.139', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-17 10:51:26', '2026-02-03 11:19:26', '2026-02-03 10:51:26', '2026-02-03 11:19:26'),
(854, 1, '7a62a723b0ed99de237890bc1a9c8b0de98aafe78ac3f90ea1bd862673528911', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 10:51:26', '2026-02-03 11:07:58', '2026-02-03 10:51:26', '2026-02-03 11:07:58'),
(855, 1, 'ffaad1252881baa6e03c902aef43dcdc67e00bee181b3a6ee401210ac75004ff', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 11:00:28', '2026-02-03 11:24:02', '2026-02-03 11:00:28', '2026-02-03 11:24:02'),
(856, 1, 'f3747404182aace60f21ccc5acd9b78fa61b37ecdfb01e66fc0930ef8e95d5a1', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 11:07:58', '2026-02-03 11:30:05', '2026-02-03 11:07:58', '2026-02-03 11:30:05'),
(858, 1, 'acb6227f53ce921716cec27f58d5d1cba5eeb9a8a84b613cdc7ee5adafbe4548', NULL, '106.219.162.139', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-17 11:19:26', NULL, '2026-02-03 11:19:26', '2026-02-03 11:19:26'),
(859, 1, '150cd18436e48bf0cea6b5114502a8943c6f2ec559aa8a2fb5da68094fba588c', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 11:24:02', NULL, '2026-02-03 11:24:02', '2026-02-03 11:24:02'),
(860, 1, 'b20656d711e3549935896fa62fa67d91f221c6336f0ea37e42d9298d71b9ae40', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-17 11:30:05', NULL, '2026-02-03 11:30:05', '2026-02-03 11:30:05');
INSERT INTO `pda_user_tokens` (`id`, `pda_user_id`, `refresh_token_hash`, `device_id`, `ip_address`, `user_agent`, `expires_at`, `revoked_at`, `created_at`, `updated_at`) VALUES
(862, 1, 'c169d8c4a5d40143b01dff1533460411984420be83b71b9a84c0a17b6b4cf4bf', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 02:37:33', '2026-02-04 03:54:44', '2026-02-04 02:37:33', '2026-02-04 03:54:44'),
(863, 1, 'd563b44bf52f896502b8be0692e5f83989ef4a38e089fb4087af6c9881af0cd6', NULL, '54.65.183.106', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 02:46:27', NULL, '2026-02-04 02:46:27', '2026-02-04 02:46:27'),
(864, 1, '839681d1ca975d2deb54eb5df31683f8392293fd6da70c1bec965509e3bf80c4', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 02:56:22', '2026-02-04 03:19:26', '2026-02-04 02:56:22', '2026-02-04 03:19:26'),
(865, 1, '343cef799768a61f754d4085cd2f6263059468dba603f6fdc9db385045687a26', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 03:19:26', '2026-02-04 03:34:47', '2026-02-04 03:19:26', '2026-02-04 03:34:47'),
(867, 1, 'e33d88dd110c299f83d62c71c4c2cd3b2221e8456c9135497067e44b73b8e5dc', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 03:34:47', '2026-02-04 03:51:24', '2026-02-04 03:34:47', '2026-02-04 03:51:24'),
(870, 1, 'b5602005f03e18e5ca01fc0f9daf1c9eb191e9b34f90ebf9d2f7eff41fd50299', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 03:51:24', '2026-02-04 04:09:39', '2026-02-04 03:51:24', '2026-02-04 04:09:39'),
(871, 1, '11eb696acdd8abbf7cc8afc548fa58e12f62c91475f53bf6720287feeac1c885', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 03:54:44', NULL, '2026-02-04 03:54:44', '2026-02-04 03:54:44'),
(874, 1, '04268d8582ad1f265e02807c9aeb59cfe8a8bb08ec9e529db60397af66839530', NULL, '106.219.165.155', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 04:09:39', '2026-02-04 04:24:44', '2026-02-04 04:09:39', '2026-02-04 04:24:44'),
(877, 1, 'c8477f4ab5e27702a7739bba1aef0ce21f83145ba111457f86fad52fb7b9bfa2', NULL, '106.219.165.155', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 04:24:44', '2026-02-04 04:48:51', '2026-02-04 04:24:44', '2026-02-04 04:48:51'),
(880, 1, '2901c77064048ac96bf7c410541d9dfa407af6f883dc32d23eb4ae433374dacf', NULL, '106.219.165.155', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 04:48:51', '2026-02-04 05:22:24', '2026-02-04 04:48:51', '2026-02-04 05:22:24'),
(883, 1, 'dd158143a21d4c84464a839c481ed0a8d8131690aab07196ba1c89a1d4450dd3', NULL, '106.219.165.155', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 05:22:24', '2026-02-04 06:33:36', '2026-02-04 05:22:24', '2026-02-04 06:33:36'),
(888, 1, '14d999f90341bd5d4b0660a4cc6a1538e1d54de8649d345a3f4741e610201eff', NULL, '106.219.165.155', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 06:33:36', '2026-02-04 06:48:36', '2026-02-04 06:33:36', '2026-02-04 06:48:36'),
(890, 1, 'e1f58b4be8bfd7fde625cf3e225973cfe932e0e828ddde2f43282430f44c0799', NULL, '106.219.165.155', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 06:48:36', '2026-02-04 07:03:51', '2026-02-04 06:48:36', '2026-02-04 07:03:51'),
(893, 1, '8b7944631dbeed8e7da55615b3c2787239029f327ab691e660f72ec74e0969ca', NULL, '106.219.165.155', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 07:03:51', '2026-02-04 07:19:08', '2026-02-04 07:03:51', '2026-02-04 07:19:08'),
(895, 1, 'b438910ca6b1957ae2e645cb7208fc84f893a47c1c9cbf88ce7cdf8f9f4a818e', NULL, '106.219.165.155', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 07:19:08', '2026-02-04 08:24:14', '2026-02-04 07:19:08', '2026-02-04 08:24:14'),
(896, 1, '498fb83d20cd354bd7ee12eee1b522f6bb95e5f79778e73da4cf0c0447142b7c', NULL, '106.219.165.155', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 08:24:14', '2026-02-04 08:45:59', '2026-02-04 08:24:14', '2026-02-04 08:45:59'),
(897, 1, '1273e6602963951039e38f2970a788ff0a56e2ba3671c13f82204ce1fcaebe8a', NULL, '106.219.165.155', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 08:27:18', '2026-02-04 08:45:14', '2026-02-04 08:27:18', '2026-02-04 08:45:14'),
(899, 1, '17e34da2e93ea1ba2659f22f1d9c336002815e27c3707ab50fd62232fafbdf1e', NULL, '106.219.165.155', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-18 08:45:14', '2026-02-04 09:08:44', '2026-02-04 08:45:14', '2026-02-04 09:08:44'),
(900, 1, 'a640b90ed0f4bc39f264a637bcadff7ef65b0f5067de8edcc7af89f6af75276d', NULL, '106.219.165.155', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 08:45:59', '2026-02-04 09:02:11', '2026-02-04 08:45:59', '2026-02-04 09:02:11'),
(901, 1, '6c3ab5b5446feeeb9ad4e2758c68e86eb1ef2f34b21a4d35b593390f6bca9b31', NULL, '106.219.165.155', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 09:02:11', '2026-02-04 09:05:58', '2026-02-04 09:02:11', '2026-02-04 09:05:58'),
(902, 1, 'b2c9119f57926fcc2f3db0e80c9b09cb3ca20e8cd8fa870ec4a3d8b15841d62e', NULL, '106.219.165.155', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 09:07:16', '2026-02-04 09:22:49', '2026-02-04 09:07:16', '2026-02-04 09:22:49'),
(903, 1, '5dec430757342940e292077027b618bfb7de81d74101dae68c9d77d14da37e01', NULL, '106.219.165.155', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-18 09:08:44', '2026-02-04 09:24:02', '2026-02-04 09:08:44', '2026-02-04 09:24:02'),
(904, 1, '7363240804de7aed700017208a7fc631ad237fae06a7b2435b2e8b87fb98ad6f', NULL, '106.219.165.155', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-18 09:22:49', '2026-02-04 09:53:29', '2026-02-04 09:22:49', '2026-02-04 09:53:29'),
(905, 1, '6102be38be43a25edbac635b77ae255060b820d7b0347968053b664b60125d33', NULL, '106.219.165.155', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 09:24:02', '2026-02-04 09:53:29', '2026-02-04 09:24:02', '2026-02-04 09:53:29'),
(906, 1, 'e72e2c6fcc654b62de0f7521cb7715a3a93fbad1be6b8ec6e28f6c29057e2ef5', NULL, '106.219.162.139', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 09:32:55', '2026-02-05 02:45:19', '2026-02-04 09:32:55', '2026-02-05 02:45:19'),
(907, 1, 'f53042091b95eb3ee0686958436b06613551aaab927b75a6446a6c001e6a18b1', NULL, '106.219.165.155', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-18 09:53:29', '2026-02-04 11:04:30', '2026-02-04 09:53:29', '2026-02-04 11:04:30'),
(908, 1, '3acd66785f666fdffcb521c76f0df550e869c6b32381ab3473e57d3b41fd8fac', NULL, '106.219.165.155', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 09:53:29', '2026-02-04 10:12:57', '2026-02-04 09:53:29', '2026-02-04 10:12:57'),
(910, 1, '6ad0abf033a6a64b040612a775273d25aff9a6ba35eb31d727a4d003f2c8d919', NULL, '106.219.165.155', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-18 10:12:57', '2026-02-04 10:28:13', '2026-02-04 10:12:57', '2026-02-04 10:28:13'),
(911, 1, 'ce79d468373b8737fcb321ae27b3bb1d84c324ed3b5e4c0bb63974e81ec186ab', NULL, '106.219.165.155', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-18 10:28:13', '2026-02-04 10:43:20', '2026-02-04 10:28:13', '2026-02-04 10:43:20'),
(912, 1, 'd2d805e4a723f70b84626fdfd751f4dc2c07208ed04a6c1ee2da20dd059bd84b', NULL, '106.219.165.155', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 10:43:20', '2026-02-04 11:04:30', '2026-02-04 10:43:20', '2026-02-04 11:04:30'),
(913, 1, 'cb1fbae4dc68e98a74a840d384a887ec4f1c852a39547993c0dc5fcc583de0ad', NULL, '106.219.165.155', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-18 11:04:30', NULL, '2026-02-04 11:04:30', '2026-02-04 11:04:30'),
(914, 1, 'f3845bf78c1fea0171e73843fbb1e785842f6993a982a0593bb56c90fa914a20', NULL, '106.219.165.155', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 11:04:30', '2026-02-04 11:29:25', '2026-02-04 11:04:30', '2026-02-04 11:29:25'),
(915, 1, '5d40941c3da3f660a2ca1f0193eccc848caf01e2ada8b0e48c8cc042b26ad565', NULL, '106.219.165.155', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-18 11:29:25', NULL, '2026-02-04 11:29:25', '2026-02-04 11:29:25'),
(916, 1, 'f32ff6b8001a23f0dff067f5a7aa9a94c4e3ee2bbb5d10a354d91004d0dffdae', NULL, '106.219.166.222', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-19 02:45:19', '2026-02-05 04:01:37', '2026-02-05 02:45:19', '2026-02-05 04:01:37'),
(917, 1, '3b019328fd1b32d0506a940a11f77a3501bc5e5e2adbe670717647924a4d12a6', NULL, '106.219.167.165', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-19 03:13:42', '2026-02-05 03:40:33', '2026-02-05 03:13:42', '2026-02-05 03:40:33'),
(918, 1, 'cf58c6c9cb82a8ab076a7d0cbf0ad3f75fd548f5e5b80c66e8850f5ec732a34f', NULL, '106.219.167.165', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-19 03:21:40', '2026-02-05 03:40:33', '2026-02-05 03:21:40', '2026-02-05 03:40:33'),
(919, 1, '0989004b8791dc14dbcc14f8192cc0f0a86f7977b9c239fe96f5552221ae4c80', NULL, '106.219.167.165', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-19 03:40:33', '2026-02-05 04:01:00', '2026-02-05 03:40:33', '2026-02-05 04:01:00'),
(920, 1, '857f0e8f3745ce2093def58c65d2f264676fb3e57c7aee6f8c27c1a619fb4aae', NULL, '106.219.167.165', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 03:40:33', '2026-02-05 04:00:57', '2026-02-05 03:40:33', '2026-02-05 04:00:57'),
(921, 1, '343b068b51be2db7f40352d5db38017436e9dae74ae8c785a894e00d064c4ee4', NULL, '106.219.167.165', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 04:00:57', '2026-02-05 04:18:17', '2026-02-05 04:00:57', '2026-02-05 04:18:17'),
(922, 1, '84218ad6c41f5f5472f2384389539df7df4bb863479999fcf6e11a64d9e34007', NULL, '106.219.167.165', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 04:01:00', '2026-02-05 04:18:17', '2026-02-05 04:01:00', '2026-02-05 04:18:17'),
(923, 1, '12cc54da54d88cbba72e05b21bfcacf65db9a807ded4682fdd713dc40dc2cb53', NULL, '106.219.166.222', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-19 04:01:37', '2026-02-05 05:33:10', '2026-02-05 04:01:37', '2026-02-05 05:33:10'),
(924, 1, '06e60c506c7eeba8fd2db0d6b3ae61666ec707cd81e59baef2663e6eeab1b6f3', NULL, '106.219.167.165', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 04:18:17', '2026-02-05 04:33:42', '2026-02-05 04:18:17', '2026-02-05 04:33:42'),
(925, 1, 'e9e721d8bf1b15e1dbb7858245710d9b4f5eb88fb02a38b5cda9960dfd738e23', NULL, '106.219.167.165', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 04:18:17', '2026-02-05 04:33:42', '2026-02-05 04:18:17', '2026-02-05 04:33:42'),
(926, 1, '9920b1222743e277e35acfbdaa830f774e7d9a535d88320ee25b09a23568d706', NULL, '106.219.167.165', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 04:33:42', '2026-02-05 05:10:01', '2026-02-05 04:33:42', '2026-02-05 05:10:01'),
(927, 1, '576a9f1cbdb56b9eeef10793f0a943507f27a05234ede6205a7eaf893fa37282', NULL, '106.219.167.165', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-19 04:33:42', '2026-02-05 05:10:01', '2026-02-05 04:33:42', '2026-02-05 05:10:01'),
(928, 1, 'faf5bcb4f831d76705d0ffb76db4d966fc61877d814ebe17cbb2e49068b6e853', NULL, '106.219.167.165', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 05:10:01', '2026-02-05 05:26:13', '2026-02-05 05:10:01', '2026-02-05 05:26:13'),
(929, 1, '3555ca87e6e7b3f011fbdb0b61616109cf7a2a664d7b13187e41710ee62bd25e', NULL, '106.219.167.165', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 05:10:01', '2026-02-05 05:38:30', '2026-02-05 05:10:01', '2026-02-05 05:38:30'),
(930, 1, 'a67474e911c1237d3eac446e0235432369aeaf21c24969aeabba61bf5fb2ef57', NULL, '106.219.167.165', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 05:26:13', '2026-02-05 05:46:10', '2026-02-05 05:26:13', '2026-02-05 05:46:10'),
(931, 1, '3a6056e6f7af2e4275086ddbc55596c8459af058c485f8a0868bec84f9242a4a', NULL, '106.219.167.165', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-19 05:33:10', '2026-02-05 10:44:44', '2026-02-05 05:33:10', '2026-02-05 10:44:44'),
(932, 1, 'ae50df90a3116e68d59df8c6d98eb0774e31c093664c56e4c5288fb5533c342b', NULL, '106.219.167.165', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 05:38:30', '2026-02-05 05:53:35', '2026-02-05 05:38:30', '2026-02-05 05:53:35'),
(933, 1, '2319f426ed8b06253853e2238502606b768f524ece53f5e7d6227150b8be3c74', NULL, '106.219.167.165', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 05:46:10', '2026-02-05 06:07:32', '2026-02-05 05:46:10', '2026-02-05 06:07:32'),
(934, 1, '5b776a9a735f25db838c039497ffeeb4145244ea8a2434d9d6b4c9d9db3d2481', NULL, '106.219.167.165', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 05:53:35', '2026-02-05 06:38:52', '2026-02-05 05:53:35', '2026-02-05 06:38:52'),
(935, 1, '4f02e9a40ef0798e352e48a06e4fd8d0f5ee6cd4e3449de523fea9d41df97c21', NULL, '106.219.167.165', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-19 06:07:32', '2026-02-05 06:47:40', '2026-02-05 06:07:32', '2026-02-05 06:47:40'),
(936, 1, 'c21b3010bcaca50e5d46c9fb2b7af1b8c9924239e8ec38c11c6fd2257f03beeb', NULL, '106.219.167.165', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 06:38:52', '2026-02-05 06:56:31', '2026-02-05 06:38:52', '2026-02-05 06:56:31'),
(937, 1, '18e79532fde7c17dc23763073ae25e53567729671aaedb4a4efce39f554d8b80', NULL, '106.219.167.165', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-19 06:47:40', '2026-02-05 07:03:06', '2026-02-05 06:47:40', '2026-02-05 07:03:06'),
(938, 1, '2f473031717e007e898aee8a8c9787e71ce8aa82e0ec88467b8dc4975e000f0b', NULL, '106.219.167.165', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 06:56:31', '2026-02-05 07:01:50', '2026-02-05 06:56:31', '2026-02-05 07:01:50'),
(939, 1, '37cf9391fc217d5647562b41001d2297bd9fba04adca6e0ae68699b6d88b9927', NULL, '106.219.167.165', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-19 07:03:06', '2026-02-05 08:19:14', '2026-02-05 07:03:06', '2026-02-05 08:19:14'),
(940, 1, 'b4e844725c0f4ea1443b54f339e373fef702e1fb7636acec5635a97bdba43ce3', NULL, '106.219.167.165', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 07:13:19', '2026-02-05 07:28:31', '2026-02-05 07:13:19', '2026-02-05 07:28:31'),
(941, 1, 'c29b06c2317d3ac5b54f9b536984f3f533cc2af45ec9a837f2023cc951c8a191', NULL, '106.219.167.165', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 07:28:31', '2026-02-05 08:19:14', '2026-02-05 07:28:31', '2026-02-05 08:19:14'),
(942, 1, 'd96e6a4977d21698b4174dbaf6ced39578e1dc9d757c71f72baf99295a3b1b9d', NULL, '106.219.163.5', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 08:19:14', '2026-02-05 08:34:17', '2026-02-05 08:19:14', '2026-02-05 08:34:17'),
(943, 1, 'c418aa17b90f6f144812a720690872dd3d2681a69768a39498101432e78a599b', NULL, '106.219.163.5', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 08:19:14', '2026-02-05 08:56:17', '2026-02-05 08:19:14', '2026-02-05 08:56:17'),
(944, 1, 'c8178fef812ed1a0a638433f2aa514fd747a4f94bbe1240e97c30d2f1fd56fb4', NULL, '106.219.163.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-19 08:34:17', '2026-02-05 08:53:43', '2026-02-05 08:34:17', '2026-02-05 08:53:43'),
(945, 1, '2fd0b1e600200cf784fea151347e12c6ffa7fc8ee067e1802a4fab0b9ddf4083', NULL, '106.219.163.5', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 08:53:43', '2026-02-05 09:08:45', '2026-02-05 08:53:43', '2026-02-05 09:08:45'),
(946, 1, 'a625b943dcfa513067c49adb551790a16ac997f0b5820ffcd695776de18a1b16', NULL, '106.219.163.5', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 08:56:17', '2026-02-05 09:49:06', '2026-02-05 08:56:17', '2026-02-05 09:49:06'),
(947, 1, '55aeaf016d8fb901f0b7c50bb541b61c5b4f04e4e6ae12e137611d02caad7569', NULL, '106.219.163.5', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 09:08:45', '2026-02-05 09:26:52', '2026-02-05 09:08:45', '2026-02-05 09:26:52'),
(948, 1, 'c4024fbca98168377d9ed9608b8e7afd72439c7a158a4f94ac37e087fcc69912', NULL, '106.219.163.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-19 09:26:52', '2026-02-05 09:49:06', '2026-02-05 09:26:52', '2026-02-05 09:49:06'),
(949, 1, '97e4cafdb6739c86564c50a5151de6783acf355b532090a881f70fb8178baf27', NULL, '106.219.163.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-19 09:49:06', '2026-02-05 10:04:30', '2026-02-05 09:49:06', '2026-02-05 10:04:30'),
(950, 1, 'c594c4bfa5f3c091247d7bbd4a7306cbe65d734e815943581e99f987dd9839b4', NULL, '106.219.163.5', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 09:49:06', '2026-02-05 11:08:36', '2026-02-05 09:49:06', '2026-02-05 11:08:36'),
(951, 1, 'a08d3fffca35ec36dbb398bf05ec292c43e84cc64eca161a1d806032e795cec1', NULL, '106.219.163.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-19 10:04:30', '2026-02-05 10:19:58', '2026-02-05 10:04:30', '2026-02-05 10:19:58'),
(952, 1, 'ffe9dca3cf2cdf4b178810223112ab6b3d03d9590eb9c9e76318fb2ce73adad0', NULL, '106.219.163.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-19 10:19:58', NULL, '2026-02-05 10:19:58', '2026-02-05 10:19:58'),
(953, 1, 'b1d8b1f9fdc9fc5c2f00c8d045115f9fc8a3d401caca0da1320598653587098b', NULL, '106.219.163.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-19 10:40:48', '2026-02-05 10:56:15', '2026-02-05 10:40:48', '2026-02-05 10:56:15'),
(954, 1, 'b80f1732ab3f0fa8bf4fd9df8fcc9b24c5609f75af1a668b314740fa3dccaa52', NULL, '106.219.163.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-19 10:44:44', '2026-02-06 03:42:53', '2026-02-05 10:44:44', '2026-02-06 03:42:53'),
(955, 1, 'dc4894367e5350c380772833f0d3d33c520a33e6181ff70a6e4448700b4f974a', NULL, '106.219.163.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-19 10:56:15', '2026-02-05 11:12:04', '2026-02-05 10:56:15', '2026-02-05 11:12:04'),
(956, 1, '6d42555de65e90217db55a1417a5c15e467417c89bab7e0fe977da6b8b868f59', NULL, '106.219.163.5', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 11:08:36', '2026-02-05 11:58:27', '2026-02-05 11:08:36', '2026-02-05 11:58:27'),
(957, 1, '1d342faf45aee46e55bb829c99e9161712a67682c27af8275bbe21398c71b37d', NULL, '106.219.163.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-19 11:12:04', '2026-02-05 11:29:03', '2026-02-05 11:12:04', '2026-02-05 11:29:03'),
(958, 1, 'acd973ec825a91123e13e1aaeeb61ffa813deaa1f37015527431a42499393c16', NULL, '106.219.163.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-19 11:29:03', NULL, '2026-02-05 11:29:03', '2026-02-05 11:29:03'),
(959, 1, 'a2a63df7c71b83c44f0b7c2c4e04a63364720fd2d95b94cfff2f2e618e82e1e2', NULL, '106.219.160.29', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-19 11:48:12', NULL, '2026-02-05 11:48:12', '2026-02-05 11:48:12'),
(960, 1, 'cf5f49d6326fe8b77da38966a0dcdeb103e4c3037993908be8a51db389dd343f', NULL, '106.219.163.5', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-19 11:58:27', NULL, '2026-02-05 11:58:27', '2026-02-05 11:58:27'),
(961, 1, '78a42b3cef66c4a9fe9fb038609bfa9f0a38191263f4682a35957ba6db2e2a6e', NULL, '106.219.163.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-20 03:06:36', '2026-02-06 03:27:08', '2026-02-06 03:06:36', '2026-02-06 03:27:08'),
(962, 1, '8029cadff671a43b31c72efece6d529196f21a7833397fb46907ced3624bf98a', NULL, '106.219.163.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-20 03:27:08', NULL, '2026-02-06 03:27:08', '2026-02-06 03:27:08'),
(964, 1, '77e3c979a5f01a3f32d773c7718c5402fe37e46b1d4203461f4d8d06c0f2641f', NULL, '106.219.163.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-20 03:39:57', '2026-02-06 04:49:34', '2026-02-06 03:39:57', '2026-02-06 04:49:34'),
(965, 1, 'eaf4d7f4f3a1daf3181b3fa5ac72f13d3873416a9afab13ae04fd26a71258eab', NULL, '106.219.160.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-20 03:42:53', '2026-02-06 05:45:17', '2026-02-06 03:42:53', '2026-02-06 05:45:17'),
(966, 1, '926e467a9fafbf9d46d71877479694485611c983f951601b31754ff1ac1759e6', NULL, '106.219.163.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-20 04:49:34', '2026-02-06 05:05:25', '2026-02-06 04:49:34', '2026-02-06 05:05:25'),
(967, 1, '48d35002e2929f72785bef096466b5280135611a3e9b923888759282823f2bb7', NULL, '106.219.160.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-20 05:04:09', NULL, '2026-02-06 05:04:09', '2026-02-06 05:04:09'),
(968, 1, 'ae9de245d04271df491c9b12e985e4f45fbaec57529c5e65b32c9ec6da7e0a6c', NULL, '106.219.163.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-20 05:05:25', '2026-02-06 05:20:27', '2026-02-06 05:05:25', '2026-02-06 05:20:27'),
(969, 1, '72910a389cb6e8871b3d0f3729e63628b369add4022da91ad60d5b08e4050358', NULL, '106.219.163.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-20 05:20:27', '2026-02-06 05:36:56', '2026-02-06 05:20:27', '2026-02-06 05:36:56'),
(970, 1, 'c242d1596662a0d923b550fe16557b4032d23e3a16118907fd3ea316bd0bc9ed', NULL, '106.219.163.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-20 05:36:56', '2026-02-06 05:55:40', '2026-02-06 05:36:56', '2026-02-06 05:55:40'),
(971, 1, '44ae684092ef794be48d8c3c725c7c9dc44e1482c6bdb6994aaf9676fe3dd520', NULL, '106.219.160.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-20 05:45:17', '2026-02-09 02:45:19', '2026-02-06 05:45:17', '2026-02-09 02:45:19'),
(972, 1, '96f6a15853ab30dffebcbef8a8925620dacd647ca79329103d7cacfeee4e0c51', NULL, '106.219.163.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-20 05:55:40', '2026-02-06 06:21:14', '2026-02-06 05:55:40', '2026-02-06 06:21:14'),
(973, 1, 'af6edbb083b57889690b63007cf2029eafc5873111f36ea7f63bbfc44e4e115e', NULL, '106.219.163.225', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-20 06:21:14', '2026-02-06 08:52:15', '2026-02-06 06:21:14', '2026-02-06 08:52:15'),
(984, 1, '65be83fbd51b86b8976120814c82b28fa403eb27965186bc1a3006f910356fe8', NULL, '106.219.165.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-20 08:52:15', '2026-02-06 08:52:19', '2026-02-06 08:52:15', '2026-02-06 08:52:19'),
(985, 1, '05712862b3d899fdf4c559998fbf3fdfd957b133a9ca510125df3c0063edffc3', NULL, '106.219.160.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-20 09:03:47', '2026-02-06 09:33:01', '2026-02-06 09:03:47', '2026-02-06 09:33:01'),
(987, 1, 'f83321fcff5d8ca229374cc33d98fc0bf5a155e9e671ac389260a61a66178195', NULL, '106.219.165.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-20 09:26:50', '2026-02-06 11:21:49', '2026-02-06 09:26:50', '2026-02-06 11:21:49'),
(988, 1, 'f83d55c3b8c9803f105677f271a75325bcd7a5b2dd72204d7789528220895e9c', NULL, '106.219.165.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-20 09:33:01', NULL, '2026-02-06 09:33:01', '2026-02-06 09:33:01'),
(989, 1, '5508e57cfaed8588dee733565473c9fae253c9c7f95f37e9ca32a79528dddf5c', NULL, '106.219.165.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-20 10:27:22', '2026-02-06 10:49:06', '2026-02-06 10:27:22', '2026-02-06 10:49:06'),
(991, 1, 'fddae732f8768780fcd07bb0c18009f50be84aaef18513478984a7be1e385cbb', NULL, '106.219.165.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-20 10:49:06', '2026-02-06 11:04:22', '2026-02-06 10:49:06', '2026-02-06 11:04:22'),
(992, 1, '6431ce1ccee296b8ad6a83713225e230b7912fcf20e9f6120d654f5583a3b89d', NULL, '106.219.165.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-20 11:04:22', '2026-02-06 11:22:15', '2026-02-06 11:04:22', '2026-02-06 11:22:15'),
(994, 1, '7e9aee52c3d619d5cb5e74ec17d26c77ca72bc7c46722349dc8c3df322b7dd17', NULL, '106.219.165.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-20 11:21:49', NULL, '2026-02-06 11:21:49', '2026-02-06 11:21:49'),
(995, 1, '10aa54b285ec1623d341fdcc2b526e0fb844bb5db1c1097cbfccf2439e818384', NULL, '106.219.165.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-20 11:22:15', NULL, '2026-02-06 11:22:15', '2026-02-06 11:22:15'),
(996, 1, 'd505162ffca8c7f6b163f53a20fb22333ac0803cd84efdf412f3aeedb47481af', NULL, '106.219.160.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-23 02:45:19', '2026-02-09 05:52:55', '2026-02-09 02:45:19', '2026-02-09 05:52:55'),
(997, 1, '3763a951502d484eb4dda463bcad70588d10c1bcf1802ebcf0f703cd106dda5d', NULL, '106.219.164.236', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-23 02:49:26', '2026-02-09 03:11:56', '2026-02-09 02:49:26', '2026-02-09 03:11:56'),
(998, 1, 'e2c0fa2f515b8c8c707c86ec5399cbe85967cd3e31197a2597000b636885f322', NULL, '106.219.164.236', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-23 03:11:56', '2026-02-09 03:28:28', '2026-02-09 03:11:56', '2026-02-09 03:28:28'),
(999, 1, '6c02371128f24d7e98914070a0ca38a143652aa63a9ecb9f550a3b45b8bd2828', NULL, '106.219.164.236', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-23 03:28:28', '2026-02-09 04:13:10', '2026-02-09 03:28:28', '2026-02-09 04:13:10'),
(1000, 1, '2d4bf7eb67ee5a84448f1d707e78d9d30105f581df035a1661387e0afbf1bb5b', NULL, '106.219.164.236', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-23 04:13:10', '2026-02-09 04:33:14', '2026-02-09 04:13:10', '2026-02-09 04:33:14'),
(1001, 1, '697c18234d1578715ae4b2f5edf9caf427a53f3036108a626b1eb8b6cc07cf63', NULL, '106.219.160.29', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-23 04:33:14', '2026-02-09 04:59:21', '2026-02-09 04:33:14', '2026-02-09 04:59:21'),
(1002, 1, 'a819a8e7eb5699ba2572643fe66b459cf2849a0093ede2a3bc2451e53a7feb3c', NULL, '106.219.160.29', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-23 04:59:21', '2026-02-09 06:02:36', '2026-02-09 04:59:21', '2026-02-09 06:02:36'),
(1003, 1, 'be942a120cfb4a887cad6292f3168244a7f6678f028a0169997a600ae81f8749', NULL, '106.219.160.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-23 05:52:55', '2026-02-09 07:37:51', '2026-02-09 05:52:55', '2026-02-09 07:37:51'),
(1004, 1, '947cf1da5e58ea2be7dadf53a958b38061f5cd2104ac4ef2fc22904459e03f21', NULL, '106.219.160.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-23 06:02:25', '2026-02-09 06:55:06', '2026-02-09 06:02:25', '2026-02-09 06:55:06'),
(1005, 1, '0e2633c0b523e5669a834303e2e4e180a1d87af824061d6c00a9b5962d6d1455', NULL, '106.219.160.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-23 06:02:36', '2026-02-09 06:19:05', '2026-02-09 06:02:36', '2026-02-09 06:19:05'),
(1006, 1, 'b0e2c05d4d6b0e5a5f26169b66b8f5dbc0add6a1da54715242ddae11df15cf53', NULL, '106.219.160.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-23 06:19:05', '2026-02-09 06:57:49', '2026-02-09 06:19:05', '2026-02-09 06:57:49'),
(1007, 1, 'f433cc09fb8714c6fca404916c8926b5dd469396becc809139d8a6813d1e2793', NULL, '106.219.160.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-23 06:55:06', '2026-02-09 08:26:57', '2026-02-09 06:55:06', '2026-02-09 08:26:57'),
(1008, 1, 'e17296cd9ad39d3c5094cfd54469d68f890bda5d85dbf4ef81089180e79433c7', NULL, '106.219.160.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-23 06:57:49', '2026-02-09 07:20:14', '2026-02-09 06:57:49', '2026-02-09 07:20:14'),
(1009, 1, '5f4f7fa51c39072950310b9d06adfaac515ac62d5103358ff0a98350a87b0db5', NULL, '106.219.160.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-23 07:20:14', '2026-02-09 08:26:57', '2026-02-09 07:20:14', '2026-02-09 08:26:57'),
(1011, 1, '4f14b76228a54424a2c5d8930c322763b413bc1c1ffd1b72441dfd6c82928b1a', NULL, '106.219.160.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-23 07:37:51', '2026-02-09 08:27:00', '2026-02-09 07:37:51', '2026-02-09 08:27:00'),
(1012, 1, 'a2107dc3185c7d367816d39bd73d1d9c6a652483ac0548bf5e983f91b3e0c0aa', NULL, '106.219.160.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-23 08:26:57', '2026-02-09 08:51:57', '2026-02-09 08:26:57', '2026-02-09 08:51:57'),
(1013, 1, 'cc277ce0c3e33ba66a409507512714352a6c22a7440ce4da1f29e5c04ee2f437', NULL, '106.219.160.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-23 08:26:57', NULL, '2026-02-09 08:26:57', '2026-02-09 08:26:57'),
(1014, 1, '1a6e6c7d21bf5890f1333cec952706f3cc829273cd84335322d561227a1b2b00', NULL, '106.219.160.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-23 08:27:00', NULL, '2026-02-09 08:27:00', '2026-02-09 08:27:00'),
(1017, 1, '128953d1c2cc075838a16786a44043abd157900fb0e1cb7d7ddca28f12ce265f', NULL, '106.219.160.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-23 08:51:57', '2026-02-09 09:10:42', '2026-02-09 08:51:57', '2026-02-09 09:10:42'),
(1019, 1, '489063117aca13f0cb37b3c145d9e450c6b3c346f632cdbda63388dbe26c1486', NULL, '106.219.160.29', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-23 09:10:42', '2026-02-09 09:29:10', '2026-02-09 09:10:42', '2026-02-09 09:29:10'),
(1021, 1, '7e560475de9ca84dc07e4c4ae59c6ac888f1a0d73f8f209df7e12babbee6f3c2', NULL, '106.219.160.29', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-23 09:29:10', '2026-02-09 10:08:24', '2026-02-09 09:29:10', '2026-02-09 10:08:24'),
(1023, 1, 'd1e95f81153c8ce33925cb18ae194e741194fb8325a9f959051e4758cecf0556', NULL, '106.219.160.29', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-23 10:08:24', '2026-02-09 10:24:57', '2026-02-09 10:08:24', '2026-02-09 10:24:57'),
(1025, 1, 'aa07ff5c4e138df14bd2568ce501eebfb1d0092fd8454692940d137aa4d98cef', NULL, '106.219.160.29', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-23 10:24:57', '2026-02-09 10:50:27', '2026-02-09 10:24:57', '2026-02-09 10:50:27'),
(1029, 1, '2edbb2ebaec86aa7ef9773f2e2a927b819b0c14702bb3228fd6e41ea181cc7d8', NULL, '106.219.160.29', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '2026-02-23 10:50:27', '2026-02-09 11:09:30', '2026-02-09 10:50:27', '2026-02-09 11:09:30'),
(1031, 1, 'f16f1124019371ee3a05d7ea0cefb85534243d82d58aac88f38af0d705bffa51', NULL, '106.219.160.29', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '2026-02-23 11:09:30', NULL, '2026-02-09 11:09:30', '2026-02-09 11:09:30'),
(1045, 1, 'ab1c910b13f224a16788ddc8d90bef0a0531efee34eca9c76d294750243d6f46', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-02-27 04:19:57', NULL, '2026-02-13 04:19:57', '2026-02-13 04:19:57'),
(1046, 1, '0483dc0839caad97549b5a27658c770c081bb2fc6b95d67578449a650cb5b38b', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-02-27 07:22:49', NULL, '2026-02-13 07:22:49', '2026-02-13 07:22:49'),
(1047, 1, '2c18291b9e58201ce6b51ca04ee877d1f8e29822034ca205d6917694a5ef7bf9', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-02-27 07:22:51', NULL, '2026-02-13 07:22:51', '2026-02-13 07:22:51'),
(1048, 1, 'd5f251da92547d219d5b4c864357efd2d701274f84f589bf0ba396e55af4d92b', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-02-27 07:23:10', NULL, '2026-02-13 07:23:10', '2026-02-13 07:23:10'),
(1049, 1, '46fb4b4a0696ae501b41bad8875d521b2525e41bdd5a3ed0f343e962d0d08ae3', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-02-27 07:25:22', NULL, '2026-02-13 07:25:22', '2026-02-13 07:25:22'),
(1050, 1, 'ef95c7bb6d78bcbea94fe7fb3cefae960ce055251ecfe6447fd815118731a603', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-02-27 07:25:26', NULL, '2026-02-13 07:25:26', '2026-02-13 07:25:26'),
(1051, 1, '126c48b0ac4d1d9ddfbc2a09ef73a67ea5c5013f0bd6a286e86acea1ff226d89', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-02-27 07:25:39', NULL, '2026-02-13 07:25:39', '2026-02-13 07:25:39'),
(1052, 1, 'c01305c36c21668999733ebd4cd0792e1cd0043b0f6d023a70ecc00189a645b0', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-02 06:00:05', NULL, '2026-02-16 06:00:05', '2026-02-16 06:00:05'),
(1065, 1, '3f3060be8d4b6f34b48423689e3d0a2f9456a69f1ee49a5ff413d19e2ba7a18c', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-04 05:37:41', NULL, '2026-02-18 05:37:41', '2026-02-18 05:37:41'),
(1073, 1, 'cad06104352bac1771c4ea60fe3f256c41900d3c632553e23e76b9eec3863868', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-04 10:37:41', '2026-02-18 11:05:10', '2026-02-18 10:37:41', '2026-02-18 11:05:10'),
(1074, 1, '57dde1ed268f0572dbd69710a555d73653e2f1c8447dbccfcb190cd967120bc8', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-04 11:05:10', '2026-02-18 11:23:11', '2026-02-18 11:05:10', '2026-02-18 11:23:11'),
(1075, 1, '2b3176b7c2e1b1a12e79a7062377aedcab0a0680c52d184f1c27e16be3b15cfa', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-04 11:23:11', NULL, '2026-02-18 11:23:11', '2026-02-18 11:23:11'),
(1076, 1, 'a071fae7867b1fa0d8b87d2e485a4e236b83bd433ceaf0adbe663005b3d7fae4', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-05 08:38:08', '2026-02-19 09:22:56', '2026-02-19 08:38:08', '2026-02-19 09:22:56'),
(1077, 1, '00ef7b0ba66661fb375a0d48c0b777a12eaa235ded3b98f864643f01a4c534dd', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-05 09:22:56', '2026-02-19 09:44:03', '2026-02-19 09:22:56', '2026-02-19 09:44:03'),
(1078, 1, 'ec19e125cd9cd84e6df46f152679769a4d0c67b87c8b875d516f3cde048d690f', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-05 09:44:03', '2026-02-19 10:34:21', '2026-02-19 09:44:03', '2026-02-19 10:34:21'),
(1079, 1, '292c5de86c94a3a01d154938cd9541ecfcfd4fd6965fcac2b74d6d4e2c957864', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-05 10:34:21', NULL, '2026-02-19 10:34:21', '2026-02-19 10:34:21'),
(1080, 1, '8bae62b8dab30e16d96c450edc03c882cbe107ebcfda48891361f935362117bd', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-09 04:09:04', '2026-02-23 04:26:23', '2026-02-23 04:09:04', '2026-02-23 04:26:23'),
(1081, 1, 'df19beb083c69bfc1a3b17f8ae5d399990b3591c8f47c8ba3b768699cc4bc4e0', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-09 04:26:23', '2026-02-23 06:14:17', '2026-02-23 04:26:23', '2026-02-23 06:14:17'),
(1082, 1, '8ecd700c133de9476aa287a5805793eb54dbc01dbadcdd03ec011fec9e12e8e0', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-09 06:14:17', '2026-02-23 09:25:15', '2026-02-23 06:14:17', '2026-02-23 09:25:15'),
(1083, 1, '253922e1d699901e08163216a775ab2a2f7fb2a97a737680a8ad8af8a56a34d8', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-09 09:25:15', '2026-02-23 10:14:37', '2026-02-23 09:25:15', '2026-02-23 10:14:37'),
(1084, 1, 'dd0e8711a844a4d0e17237236e08a29e8f3b71358341fa74a2d65d871163647b', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-09 10:14:37', '2026-02-23 10:57:50', '2026-02-23 10:14:37', '2026-02-23 10:57:50'),
(1085, 1, 'df27d846b188dbaa447ebb8d2a126436e09d20a3df6d6316eab54871ed0524bf', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-09 10:57:50', '2026-02-24 03:25:42', '2026-02-23 10:57:50', '2026-02-24 03:25:42'),
(1086, 1, '9986ce14652c6349ee7d4f0ec20c904dc87c9debad71c3eeecaf18c8e84189b6', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-10 03:25:42', '2026-02-24 03:56:52', '2026-02-24 03:25:42', '2026-02-24 03:56:52'),
(1087, 1, '87ca9faa559e66d844d4f7616f2907b08605f9761bfe5ad5eca2c670f757d391', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-10 03:56:52', NULL, '2026-02-24 03:56:52', '2026-02-24 03:56:52'),
(1088, 1, '076348de607aec2afeb7879473446801bf97cd73ca37e362838644eb58c3eeff', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-10 05:23:33', '2026-02-24 07:13:01', '2026-02-24 05:23:33', '2026-02-24 07:13:01'),
(1089, 1, 'edbeaaa9dab072cc18539d8a4a6f4d4f912b8835750f2ddc5dbe4c4c34e19be1', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-10 07:13:01', '2026-02-24 08:58:43', '2026-02-24 07:13:01', '2026-02-24 08:58:43'),
(1090, 1, '440f37d0323a1362e40f072d124f81cf5eead0582fe14cb89c419dddb254465c', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-10 08:58:43', '2026-02-24 09:03:50', '2026-02-24 08:58:43', '2026-02-24 09:03:50'),
(1091, 1, 'faf1c0c9d95f844038ac5745d33a0fae5ed5ce9ba102f1dcb95fb0964c22cb8b', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-10 09:03:50', NULL, '2026-02-24 09:03:50', '2026-02-24 09:03:50'),
(1092, 1, '5c9e24c7c1e8c833a95ad885e3903b35997d6c561f1e05e9f672c02bfb39a0bb', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-11 09:14:12', NULL, '2026-02-25 09:14:12', '2026-02-25 09:14:12'),
(1098, 1, '354b6d0841fd3ea3444554bb1befd3f657baf4aced9b82d5c237455a8d3cb4af', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-16 07:11:12', '2026-03-02 10:35:27', '2026-03-02 07:11:12', '2026-03-02 10:35:27'),
(1099, 1, '070da581ce50c650796e2fc58dc71949987e150dc133e8df028e3ed82189811d', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-16 10:35:27', '2026-03-03 03:04:54', '2026-03-02 10:35:27', '2026-03-03 03:04:54'),
(1100, 1, '15bd97fb65d76f45275040c64305e5fe8bc37fbf87c5ad16df6e7f87d4ec0292', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-17 03:04:54', '2026-03-03 04:04:09', '2026-03-03 03:04:54', '2026-03-03 04:04:09'),
(1101, 1, 'e66b5d445f64cec5c96effbb659360716ff7c74ee4bfeb97428f261421424533', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-17 04:04:09', '2026-03-03 04:32:52', '2026-03-03 04:04:09', '2026-03-03 04:32:52'),
(1103, 1, '7c208cf08ea6f6dd1e3649c3e84e415ef2b99bbbd3e66a1d1951f4a7c7181d98', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-17 04:32:52', NULL, '2026-03-03 04:32:52', '2026-03-03 04:32:52'),
(1104, 1, 'a72be5549e547ca1e5b5fb423e8b014104d0940090d603cc4b508986dcec625d', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-17 09:58:07', NULL, '2026-03-03 09:58:07', '2026-03-03 09:58:07'),
(1106, 1, '5c4a7b76d0ad367e7da1ee0858b1ad25281be9a62bd9bbc78e9c71107a66fde3', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-20 03:09:19', NULL, '2026-03-06 03:09:19', '2026-03-06 03:09:19'),
(1107, 1, 'ad20288196ef482cfb8d04330bb9db345fe438f261b7d9f034087e85e24d82d3', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-20 08:55:20', NULL, '2026-03-06 08:55:20', '2026-03-06 08:55:20'),
(1109, 1, '5ac26030dee5f8b853d8c09414dc3ff0e7a6f6f70e59654bc6d2f50feb84dc5a', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-20 10:00:23', NULL, '2026-03-06 10:00:23', '2026-03-06 10:00:23'),
(1110, 1, '84f79d7bfa7fab78fe5b0c85254e4afe1844a3fcabd53345e51f1ef45f47ce0d', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-23 07:13:51', '2026-03-09 10:17:16', '2026-03-09 07:13:51', '2026-03-09 10:17:16'),
(1111, 1, 'e3ee2dc0a0929438223344ce3bcdb1a7258b7e554f70ba96f1da4d1200b51a75', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-23 10:17:16', NULL, '2026-03-09 10:17:16', '2026-03-09 10:17:16'),
(1112, 1, 'bd01f11297c3f729c944098399266146676cd075035ac4418bd8afebcf2b56d3', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-24 04:03:04', '2026-03-10 05:12:16', '2026-03-10 04:03:04', '2026-03-10 05:12:16'),
(1113, 1, '4a7caac2ef29eb8d3aa64b00b31dc9d19ae7976cd9d0bb5638804ee1892aa8c1', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-24 05:12:16', '2026-03-10 09:28:22', '2026-03-10 05:12:16', '2026-03-10 09:28:22'),
(1114, 1, '49cd494bdf50cd1d00229e7be2d92249ca6671b39a7945900102916604e3dca9', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-24 09:28:22', NULL, '2026-03-10 09:28:22', '2026-03-10 09:28:22'),
(1115, 1, '2fa1e09bf00b2d844f25d35041f684ad1fae5de7b43109cc041b6ae622542691', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-26 07:12:16', '2026-03-12 08:14:07', '2026-03-12 07:12:16', '2026-03-12 08:14:07'),
(1116, 1, '15293c868d674931747ee08493c423cc2c26618c268307c1162170af71eea1c1', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-26 08:14:07', NULL, '2026-03-12 08:14:07', '2026-03-12 08:14:07'),
(1117, 1, 'e3cf9fb9c40ab671f975091166ebaacf0a238a32cc77fa6007a820e9b77502a7', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-27 10:22:55', NULL, '2026-03-13 10:22:55', '2026-03-13 10:22:55'),
(1119, 1, '1c32a7ea4b516a35239774dd114996906efe456d600aca876f35ea14bbf58ee4', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-30 04:37:26', '2026-03-16 06:52:37', '2026-03-16 04:37:26', '2026-03-16 06:52:37'),
(1120, 1, 'f04c71c3f47f908ae591c4eb7cd22565aaca42c230d8d9f8a183e12a2b4888ed', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-30 06:52:37', NULL, '2026-03-16 06:52:37', '2026-03-16 06:52:37'),
(1121, 1, '87304685e9f5c7335cbe3d1a300908d29cb8b90d71f080aaec689f09715aff54', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-03-31 07:30:30', NULL, '2026-03-17 07:30:30', '2026-03-17 07:30:30'),
(1122, 1, '65e0cc024ea467f2471f5fb035c00e4e68176973d7cfd2604095918ccc6e03ea', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-04-06 05:43:26', '2026-03-26 03:27:39', '2026-03-23 05:43:26', '2026-03-26 03:27:39'),
(1123, 1, '97c865991dccc6177a28f6849b99d34d344d126f64ab36ab6b277d99e3ca7181', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-04-09 03:27:39', '2026-03-26 05:17:41', '2026-03-26 03:27:39', '2026-03-26 05:17:41'),
(1124, 1, '78031ee6b189e49b0aea8e0d9cdd6859cb0352d6680ec0f19356745c08bd382e', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-04-09 05:17:41', '2026-03-26 06:23:28', '2026-03-26 05:17:41', '2026-03-26 06:23:28'),
(1125, 1, '46c81b75c80145df12be9c2a19627120ae13012272824e8dcd4717a8dc979a32', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-04-09 06:23:28', NULL, '2026-03-26 06:23:28', '2026-03-26 06:23:28'),
(1126, 1, '0df591dcf592032279174e310e234f3f80f31f4c0b01dae7a732fe1136e1e0c1', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-04-10 03:59:22', '2026-03-27 03:59:39', '2026-03-27 03:59:22', '2026-03-27 03:59:39');
INSERT INTO `pda_user_tokens` (`id`, `pda_user_id`, `refresh_token_hash`, `device_id`, `ip_address`, `user_agent`, `expires_at`, `revoked_at`, `created_at`, `updated_at`) VALUES
(1127, 1, '34dc57fde9b4b4263d3df6b50fd4516c0bed8064452f8a53d6d342bd4eb55c3f', NULL, '127.0.0.1', 'PostmanRuntime/7.51.1', '2026-04-10 03:59:39', NULL, '2026-03-27 03:59:39', '2026-03-27 03:59:39'),
(1128, 1, 'aabdd402fbc0b6d805e664f03f18f57db0c1a4187440f1ce4eb83bebf6838d59', NULL, '127.0.0.1', 'PostmanRuntime/7.53.0', '2026-04-27 06:18:35', '2026-04-13 06:27:54', '2026-04-13 06:18:35', '2026-04-13 06:27:54'),
(1129, 1, 'd81e4a004e3ecbb5310ae6d61a1752fc482ce7d631c55189bda29f2c1bd31a34', NULL, '127.0.0.1', 'PostmanRuntime/7.53.0', '2026-04-27 06:27:54', '2026-04-13 08:31:55', '2026-04-13 06:27:54', '2026-04-13 08:31:55'),
(1130, 1, '78305a37241a66d97abff47c7772537973a7d992f7e7cae5a8fa6f550e9f4a82', NULL, '127.0.0.1', 'PostmanRuntime/7.53.0', '2026-04-27 08:31:55', '2026-04-13 11:37:34', '2026-04-13 08:31:55', '2026-04-13 11:37:34'),
(1131, 1, '5342724f3780e2be8009ac0850e0e2d532469f988fc1e097271e1c8799dbc7c0', NULL, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-27 11:30:32', '2026-04-14 03:41:57', '2026-04-13 11:30:32', '2026-04-14 03:41:57'),
(1132, 1, '3d34e14f4aacb45c5450f68253da9dadd399a1673b737438e29d8eb4f488657e', NULL, '127.0.0.1', 'PostmanRuntime/7.53.0', '2026-04-27 11:37:34', NULL, '2026-04-13 11:37:34', '2026-04-13 11:37:34'),
(1133, 1, '90ac348c6500635d8c614754584f39fe94b91d84c7c73d051c60ff4760dc0c94', NULL, '127.0.0.1', 'PostmanRuntime/7.53.0', '2026-04-28 03:39:12', '2026-04-14 05:33:34', '2026-04-14 03:39:12', '2026-04-14 05:33:34'),
(1134, 1, '7fd6f764c9eee04a20ebe1941fc6aac9db400d22f8682bde5193ab2a3960a608', NULL, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-28 03:41:57', '2026-04-14 04:46:19', '2026-04-14 03:41:57', '2026-04-14 04:46:19'),
(1135, 1, '842f590481366058833e4c1d051ed754ecfd05827377fa1d83f19f7f5b65af01', NULL, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-28 04:46:19', '2026-04-14 05:51:49', '2026-04-14 04:46:19', '2026-04-14 05:51:49'),
(1136, 1, '4cfbbe5f15a1eec036812d8c5efe6df2250c25593f565df23224d2ac7c853a89', NULL, '127.0.0.1', 'PostmanRuntime/7.53.0', '2026-04-28 05:33:34', '2026-04-14 06:45:07', '2026-04-14 05:33:34', '2026-04-14 06:45:07'),
(1137, 1, 'c66b86883f78d20f9e2b25447f83b257a1d56a0cbdfc1e812769a8e56659a3b5', NULL, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-28 05:51:49', '2026-04-14 07:05:23', '2026-04-14 05:51:49', '2026-04-14 07:05:23'),
(1138, 1, '435f859e1bd3df30928af44083598943bf045e79d621643e66f005c5d1aef1fb', NULL, '127.0.0.1', 'PostmanRuntime/7.53.0', '2026-04-28 06:45:07', NULL, '2026-04-14 06:45:07', '2026-04-14 06:45:07'),
(1139, 1, 'dace6d068bba022d6b5d5240642ed02eb62312d9d31885c6cd826f4cb3559c9a', NULL, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-04-28 07:05:23', NULL, '2026-04-14 07:05:23', '2026-04-14 07:05:23'),
(1140, 1, 'd89259cf0b300126bb4a65ae62d37040bcc1b7e57c54a1b39ffd34b3f9b04a1c', NULL, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-28 10:38:38', NULL, '2026-04-14 10:38:38', '2026-04-14 10:38:38'),
(1141, 1, '6a6566272b1a4072211442fa2d382c59098fe474e8fb7322d5cc062a7a40e3d0', NULL, '127.0.0.1', 'PostmanRuntime/7.53.0', '2026-04-28 10:47:34', NULL, '2026-04-14 10:47:34', '2026-04-14 10:47:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `slug_2` (`slug`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `slug_2` (`slug`),
  ADD KEY `category` (`category`);

--
-- Indexes for table `otps`
--
ALTER TABLE `otps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_customer_id` (`customer_id`),
  ADD KEY `idx_customer_type` (`customer_id`,`type`);

--
-- Indexes for table `pda_permissions`
--
ALTER TABLE `pda_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `slug_2` (`slug`);

--
-- Indexes for table `pda_roles`
--
ALTER TABLE `pda_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `slug_2` (`slug`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `slug_3` (`slug`);

--
-- Indexes for table `pda_role_permissions`
--
ALTER TABLE `pda_role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_role_permission` (`role_id`,`permission_id`),
  ADD UNIQUE KEY `pda_role_permissions_role_id_permission_id` (`role_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `pda_users`
--
ALTER TABLE `pda_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD KEY `idx_active` (`is_active`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `pda_user_tokens`
--
ALTER TABLE `pda_user_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`pda_user_id`),
  ADD KEY `idx_expires` (`expires_at`),
  ADD KEY `idx_pda_user_tokens_hash` (`refresh_token_hash`),
  ADD KEY `idx_pda_user_tokens_user` (`pda_user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `otps`
--
ALTER TABLE `otps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pda_permissions`
--
ALTER TABLE `pda_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `pda_roles`
--
ALTER TABLE `pda_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `pda_role_permissions`
--
ALTER TABLE `pda_role_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9647;

--
-- AUTO_INCREMENT for table `pda_users`
--
ALTER TABLE `pda_users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `pda_user_tokens`
--
ALTER TABLE `pda_user_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1142;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `pda_role_permissions`
--
ALTER TABLE `pda_role_permissions`
  ADD CONSTRAINT `pda_role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `pda_roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pda_role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `pda_permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pda_users`
--
ALTER TABLE `pda_users`
  ADD CONSTRAINT `pda_users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `pda_roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `pda_user_tokens`
--
ALTER TABLE `pda_user_tokens`
  ADD CONSTRAINT `pda_user_tokens_ibfk_1` FOREIGN KEY (`pda_user_id`) REFERENCES `pda_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
