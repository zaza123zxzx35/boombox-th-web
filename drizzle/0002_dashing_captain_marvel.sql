CREATE TABLE `boomboxEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventName` varchar(60) NOT NULL,
	`packageCode` varchar(4),
	`deviceColor` varchar(120),
	`scentSummary` text,
	`source` varchar(120),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `boomboxEvents_id` PRIMARY KEY(`id`)
);
