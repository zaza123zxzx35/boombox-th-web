CREATE TABLE `boomboxPackages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(4) NOT NULL,
	`name` varchar(80) NOT NULL,
	`oldPrice` int NOT NULL,
	`price` int NOT NULL,
	`deviceLabel` varchar(120) NOT NULL,
	`extrasLabel` varchar(120) NOT NULL,
	`scentLabel` varchar(160) NOT NULL,
	`imageUrl` text,
	`imageKey` varchar(512),
	`sortOrder` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `boomboxPackages_id` PRIMARY KEY(`id`),
	CONSTRAINT `boomboxPackages_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `boomboxScents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`category` varchar(60) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `boomboxScents_id` PRIMARY KEY(`id`)
);
