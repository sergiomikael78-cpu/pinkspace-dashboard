import { sqliteTable, text, integer, primaryKey, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const workspace = sqliteTable("Workspace", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  ownerId: text("ownerId"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(sql`(unixepoch() * 1000)`),
});

export const workspaceRelations = relations(workspace, ({ many, one }) => ({
  resources: many(resource),
  categories: many(category),
  collections: many(collection),
  livechatTemplates: many(livechatTemplate),
  userPreference: one(userPreference, {
    fields: [workspace.id],
    references: [userPreference.workspaceId],
  }),
}));

export const category = sqliteTable(
  "Category",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspaceId").notNull().references(() => workspace.id),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    icon: text("icon"),
    colorAccent: text("colorAccent"),
    sortOrder: integer("sortOrder").notNull().default(0),
  },
  (t) => [
    index("category_workspaceId_idx").on(t.workspaceId),
    uniqueIndex("category_workspaceId_slug_idx").on(t.workspaceId, t.slug),
  ]
);

export const categoryRelations = relations(category, ({ one, many }) => ({
  workspace: one(workspace, {
    fields: [category.workspaceId],
    references: [workspace.id],
  }),
  resources: many(resource),
}));

export const resource = sqliteTable(
  "Resource",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspaceId").notNull().references(() => workspace.id),
    title: text("title").notNull(),
    description: text("description").notNull(),
    sourceType: text("sourceType").notNull(),
    fileUrl: text("fileUrl"),
    externalUrl: text("externalUrl"),
    provider: text("provider"),
    categoryId: text("categoryId").notNull().references(() => category.id),
    thumbnailUrl: text("thumbnailUrl"),
    iconEmoji: text("iconEmoji"),
    currentVersion: text("currentVersion").notNull().default("1.0.0"),
    isFavorite: integer("isFavorite", { mode: "boolean" }).notNull().default(false),
    openCount: integer("openCount").notNull().default(0),
    downloadCount: integer("downloadCount").notNull().default(0),
    lastOpenedAt: integer("lastOpenedAt", { mode: "timestamp" }),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(sql`(unixepoch() * 1000)`),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(sql`(unixepoch() * 1000)`),
  },
  (t) => [
    index("resource_workspaceId_idx").on(t.workspaceId),
    index("resource_categoryId_idx").on(t.categoryId),
  ]
);

export const resourceRelations = relations(resource, ({ one, many }) => ({
  workspace: one(workspace, {
    fields: [resource.workspaceId],
    references: [workspace.id],
  }),
  category: one(category, {
    fields: [resource.categoryId],
    references: [category.id],
  }),
  tags: many(resourceTag),
  versions: many(resourceVersion),
  collections: many(collectionResource),
}));

export const resourceVersion = sqliteTable(
  "ResourceVersion",
  {
    id: text("id").primaryKey(),
    resourceId: text("resourceId").notNull().references(() => resource.id, { onDelete: "cascade" }),
    version: text("version").notNull(),
    fileUrl: text("fileUrl"),
    externalUrl: text("externalUrl"),
    changelog: text("changelog"),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(sql`(unixepoch() * 1000)`),
  },
  (t) => [index("resourceVersion_resourceId_idx").on(t.resourceId)]
);

export const resourceVersionRelations = relations(resourceVersion, ({ one }) => ({
  resource: one(resource, {
    fields: [resourceVersion.resourceId],
    references: [resource.id],
  }),
}));

export const tag = sqliteTable("Tag", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const tagRelations = relations(tag, ({ many }) => ({
  resources: many(resourceTag),
}));

export const resourceTag = sqliteTable(
  "ResourceTag",
  {
    resourceId: text("resourceId").notNull().references(() => resource.id, { onDelete: "cascade" }),
    tagId: text("tagId").notNull().references(() => tag.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.resourceId, t.tagId] })]
);

export const resourceTagRelations = relations(resourceTag, ({ one }) => ({
  resource: one(resource, {
    fields: [resourceTag.resourceId],
    references: [resource.id],
  }),
  tag: one(tag, {
    fields: [resourceTag.tagId],
    references: [tag.id],
  }),
}));

export const collection = sqliteTable(
  "Collection",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspaceId").notNull().references(() => workspace.id),
    name: text("name").notNull(),
    description: text("description"),
  },
  (t) => [index("collection_workspaceId_idx").on(t.workspaceId)]
);

export const collectionRelations = relations(collection, ({ one, many }) => ({
  workspace: one(workspace, {
    fields: [collection.workspaceId],
    references: [workspace.id],
  }),
  resources: many(collectionResource),
}));

export const collectionResource = sqliteTable(
  "CollectionResource",
  {
    collectionId: text("collectionId").notNull().references(() => collection.id, { onDelete: "cascade" }),
    resourceId: text("resourceId").notNull().references(() => resource.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.collectionId, t.resourceId] })]
);

export const collectionResourceRelations = relations(collectionResource, ({ one }) => ({
  collection: one(collection, {
    fields: [collectionResource.collectionId],
    references: [collection.id],
  }),
  resource: one(resource, {
    fields: [collectionResource.resourceId],
    references: [resource.id],
  }),
}));

export const userPreference = sqliteTable(
  "UserPreference",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspaceId").notNull().unique().references(() => workspace.id, { onDelete: "cascade" }),
    activeThemeId: text("activeThemeId").notNull().default("soft-sakura"),
    animationEnabled: integer("animationEnabled", { mode: "boolean" }).notNull().default(true),
    animationIntensity: text("animationIntensity").notNull().default("medium"),
    dashboardWidgets: text("dashboardWidgets").notNull().default('{"welcome":true,"statistics":true,"favorites":true,"recent":true,"collections":true}'),
    gridDensity: text("gridDensity").notNull().default("comfortable"),
    sidebarCollapsed: integer("sidebarCollapsed", { mode: "boolean" }).notNull().default(false),
    searchSuggestions: integer("searchSuggestions", { mode: "boolean" }).notNull().default(true),
    searchAutoComplete: integer("searchAutoComplete", { mode: "boolean" }).notNull().default(true),
    recentSearchEnabled: integer("recentSearchEnabled", { mode: "boolean" }).notNull().default(true),
    defaultSearchCategory: text("defaultSearchCategory"),
    favoriteSorting: text("favoriteSorting").notNull().default("recent"),
    defaultCollectionId: text("defaultCollectionId"),
    downloadFolder: text("downloadFolder"),
    autoDownload: integer("autoDownload", { mode: "boolean" }).notNull().default(false),
    downloadConfirmation: integer("downloadConfirmation", { mode: "boolean" }).notNull().default(true),
    imageQuality: text("imageQuality").notNull().default("auto"),
    lazyLoading: integer("lazyLoading", { mode: "boolean" }).notNull().default(true),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(sql`(unixepoch() * 1000)`),
  },
  (t) => [index("userPreference_workspaceId_idx").on(t.workspaceId)]
);

export const userPreferenceRelations = relations(userPreference, ({ one }) => ({
  workspace: one(workspace, {
    fields: [userPreference.workspaceId],
    references: [workspace.id],
  }),
}));

export const livechatTemplate = sqliteTable(
  "LivechatTemplate",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspaceId").notNull().references(() => workspace.id),
    title: text("title").notNull(),
    kodePk: text("kodePk").notNull(),
    content: text("content").notNull(),
    categoryTag: text("categoryTag").default("Umum"),
    isFavorite: integer("isFavorite", { mode: "boolean" }).notNull().default(false),
    usageCount: integer("usageCount").notNull().default(0),
    sortOrder: integer("sortOrder").notNull().default(0),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(sql`(unixepoch() * 1000)`),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(sql`(unixepoch() * 1000)`),
  },
  (t) => [
    index("livechatTemplate_workspaceId_idx").on(t.workspaceId),
    index("livechatTemplate_kodePk_idx").on(t.kodePk),
  ]
);

export const livechatTemplateRelations = relations(livechatTemplate, ({ one }) => ({
  workspace: one(workspace, {
    fields: [livechatTemplate.workspaceId],
    references: [workspace.id],
  }),
}));

// Infer types
export type Workspace = typeof workspace.$inferSelect;
export type Resource = typeof resource.$inferSelect;
export type Category = typeof category.$inferSelect;
export type Tag = typeof tag.$inferSelect;
export type Collection = typeof collection.$inferSelect;
export type UserPreference = typeof userPreference.$inferSelect;
export type LivechatTemplate = typeof livechatTemplate.$inferSelect;
export type NewLivechatTemplate = typeof livechatTemplate.$inferInsert;

