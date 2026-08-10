CREATE TABLE `Category` (
	`id` text PRIMARY KEY NOT NULL,
	`workspaceId` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`icon` text,
	`colorAccent` text,
	`sortOrder` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `category_workspaceId_idx` ON `Category` (`workspaceId`);--> statement-breakpoint
CREATE UNIQUE INDEX `category_workspaceId_slug_idx` ON `Category` (`workspaceId`,`slug`);--> statement-breakpoint
CREATE TABLE `Collection` (
	`id` text PRIMARY KEY NOT NULL,
	`workspaceId` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `collection_workspaceId_idx` ON `Collection` (`workspaceId`);--> statement-breakpoint
CREATE TABLE `CollectionResource` (
	`collectionId` text NOT NULL,
	`resourceId` text NOT NULL,
	PRIMARY KEY(`collectionId`, `resourceId`),
	FOREIGN KEY (`collectionId`) REFERENCES `Collection`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`resourceId`) REFERENCES `Resource`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Resource` (
	`id` text PRIMARY KEY NOT NULL,
	`workspaceId` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`sourceType` text NOT NULL,
	`fileUrl` text,
	`externalUrl` text,
	`provider` text,
	`categoryId` text NOT NULL,
	`thumbnailUrl` text,
	`iconEmoji` text,
	`currentVersion` text DEFAULT '1.0.0' NOT NULL,
	`isFavorite` integer DEFAULT false NOT NULL,
	`openCount` integer DEFAULT 0 NOT NULL,
	`downloadCount` integer DEFAULT 0 NOT NULL,
	`lastOpenedAt` integer,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `resource_workspaceId_idx` ON `Resource` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `resource_categoryId_idx` ON `Resource` (`categoryId`);--> statement-breakpoint
CREATE TABLE `ResourceTag` (
	`resourceId` text NOT NULL,
	`tagId` text NOT NULL,
	PRIMARY KEY(`resourceId`, `tagId`),
	FOREIGN KEY (`resourceId`) REFERENCES `Resource`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `ResourceVersion` (
	`id` text PRIMARY KEY NOT NULL,
	`resourceId` text NOT NULL,
	`version` text NOT NULL,
	`fileUrl` text,
	`externalUrl` text,
	`changelog` text,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`resourceId`) REFERENCES `Resource`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `resourceVersion_resourceId_idx` ON `ResourceVersion` (`resourceId`);--> statement-breakpoint
CREATE TABLE `Tag` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Tag_name_unique` ON `Tag` (`name`);--> statement-breakpoint
CREATE TABLE `UserPreference` (
	`id` text PRIMARY KEY NOT NULL,
	`workspaceId` text NOT NULL,
	`activeThemeId` text DEFAULT 'soft-sakura' NOT NULL,
	`animationEnabled` integer DEFAULT true NOT NULL,
	`animationIntensity` text DEFAULT 'medium' NOT NULL,
	`dashboardWidgets` text DEFAULT '{"welcome":true,"statistics":true,"favorites":true,"recent":true,"collections":true}' NOT NULL,
	`gridDensity` text DEFAULT 'comfortable' NOT NULL,
	`sidebarCollapsed` integer DEFAULT false NOT NULL,
	`searchSuggestions` integer DEFAULT true NOT NULL,
	`searchAutoComplete` integer DEFAULT true NOT NULL,
	`recentSearchEnabled` integer DEFAULT true NOT NULL,
	`defaultSearchCategory` text,
	`favoriteSorting` text DEFAULT 'recent' NOT NULL,
	`defaultCollectionId` text,
	`downloadFolder` text,
	`autoDownload` integer DEFAULT false NOT NULL,
	`downloadConfirmation` integer DEFAULT true NOT NULL,
	`imageQuality` text DEFAULT 'auto' NOT NULL,
	`lazyLoading` integer DEFAULT true NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `UserPreference_workspaceId_unique` ON `UserPreference` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `userPreference_workspaceId_idx` ON `UserPreference` (`workspaceId`);--> statement-breakpoint
CREATE TABLE `Workspace` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`ownerId` text,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
