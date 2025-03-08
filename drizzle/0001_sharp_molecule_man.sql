ALTER TABLE `test` RENAME TO `tests`;--> statement-breakpoint
ALTER TABLE `tests` ADD `title` text NOT NULL;--> statement-breakpoint
ALTER TABLE `tests` ADD `description` text;--> statement-breakpoint
ALTER TABLE `tests` ADD `imageUri` text;--> statement-breakpoint
ALTER TABLE `tests` DROP COLUMN `name`;