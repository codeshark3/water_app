PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`participantId` text NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`gender` text NOT NULL,
	`location` text NOT NULL,
	`createdAt` text NOT NULL,
	`createdBy` text NOT NULL,
	`onchoImage` text,
	`schistoImage` text,
	`lfImage` text,
	`helminthImage` text,
	`syncStatus` text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_tests`("id", "participantId", "name", "age", "gender", "location", "createdAt", "createdBy", "onchoImage", "schistoImage", "lfImage", "helminthImage", "syncStatus") SELECT "id", "participantId", "name", "age", "gender", "location", "createdAt", "createdBy", "onchoImage", "schistoImage", "lfImage", "helminthImage", "syncStatus" FROM `tests`;--> statement-breakpoint
DROP TABLE `tests`;--> statement-breakpoint
ALTER TABLE `__new_tests` RENAME TO `tests`;--> statement-breakpoint
PRAGMA foreign_keys=ON;