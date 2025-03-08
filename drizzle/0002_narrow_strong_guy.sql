PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`participantId` integer NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`gender` text NOT NULL,
	`location` text NOT NULL,
	`onchoImage` text,
	`schistoImage` text,
	`lfImage` text,
	`helminthImage` text,
	`createdAt` text NOT NULL,
	`createdBy` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_tests`("id", "participantId", "name", "age", "gender", "location", "onchoImage", "schistoImage", "lfImage", "helminthImage", "createdAt", "createdBy") SELECT "id", "participantId", "name", "age", "gender", "location", "onchoImage", "schistoImage", "lfImage", "helminthImage", "createdAt", "createdBy" FROM `tests`;--> statement-breakpoint
DROP TABLE `tests`;--> statement-breakpoint
ALTER TABLE `__new_tests` RENAME TO `tests`;--> statement-breakpoint
PRAGMA foreign_keys=ON;