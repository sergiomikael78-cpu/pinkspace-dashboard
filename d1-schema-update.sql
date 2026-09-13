-- D1 Migration Script for LivechatTemplate
-- Copy and paste this into Cloudflare Dashboard -> Storage & Databases -> D1 -> pinkspace-db -> Console

CREATE TABLE IF NOT EXISTS LivechatTemplate (
  id TEXT PRIMARY KEY,
  workspaceId TEXT NOT NULL REFERENCES Workspace(id),
  title TEXT NOT NULL,
  kodePk TEXT NOT NULL,
  content TEXT NOT NULL,
  categoryTag TEXT DEFAULT 'Umum',
  isFavorite INTEGER DEFAULT 0 NOT NULL,
  usageCount INTEGER DEFAULT 0 NOT NULL,
  sortOrder INTEGER DEFAULT 0 NOT NULL,
  createdAt INTEGER DEFAULT (unixepoch() * 1000) NOT NULL,
  updatedAt INTEGER DEFAULT (unixepoch() * 1000) NOT NULL
);

CREATE INDEX IF NOT EXISTS livechatTemplate_workspaceId_idx ON LivechatTemplate (workspaceId);
CREATE INDEX IF NOT EXISTS livechatTemplate_kodePk_idx ON LivechatTemplate (kodePk);

-- Optional: Seed Category into D1
INSERT OR IGNORE INTO Category (id, workspaceId, name, slug, description, icon, colorAccent, sortOrder)
VALUES (
  'cat-template-livechat',
  'default-workspace',
  'Template Livechat',
  'template-livechat',
  'Template balasan cepat untuk member Livechat CS, pencarian kode PK, dan manajemen pesan.',
  '💬',
  '#FF6FB5',
  0
);
