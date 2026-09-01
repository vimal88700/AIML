ALTER TABLE `class_members` ADD `race` varchar(120);--> statement-breakpoint
ALTER TABLE `member_gallery` ADD `mediaType` enum('image','video') DEFAULT 'image' NOT NULL;