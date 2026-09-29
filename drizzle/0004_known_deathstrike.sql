CREATE TABLE `boomboxMediaAssets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assetKey` varchar(80) NOT NULL,
	`label` varchar(160) NOT NULL,
	`mimeType` varchar(120) NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`url` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `boomboxMediaAssets_id` PRIMARY KEY(`id`),
	CONSTRAINT `boomboxMediaAssets_assetKey_unique` UNIQUE(`assetKey`)
);
--> statement-breakpoint
CREATE TABLE `boomboxSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`settingKey` varchar(80) NOT NULL,
	`settingValue` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `boomboxSettings_id` PRIMARY KEY(`id`),
	CONSTRAINT `boomboxSettings_settingKey_unique` UNIQUE(`settingKey`)
);
