CREATE TABLE `class_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(160) NOT NULL,
	`slug` varchar(180) NOT NULL,
	`imageUrl` text,
	`status` varchar(64) NOT NULL DEFAULT 'Active',
	`tagline` varchar(220),
	`hobbies` text,
	`goal` text,
	`instagram` varchar(120),
	`phone` varchar(64),
	`phoneVisible` int NOT NULL DEFAULT 0,
	`hometown` varchar(160),
	`isPublished` int NOT NULL DEFAULT 1,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `class_members_id` PRIMARY KEY(`id`),
	CONSTRAINT `class_members_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `member_gallery` (
	`id` int AUTO_INCREMENT NOT NULL,
	`memberId` int NOT NULL,
	`imageUrl` text NOT NULL,
	`altText` varchar(220),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `member_gallery_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
