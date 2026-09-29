CREATE TABLE `boomboxDeviceImages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`color` varchar(30) NOT NULL,
	`imageUrl` text,
	`imageKey` varchar(512),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `boomboxDeviceImages_id` PRIMARY KEY(`id`),
	CONSTRAINT `boomboxDeviceImages_color_unique` UNIQUE(`color`)
);
