CREATE TABLE IF NOT EXISTS Subscriber (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE TABLE IF NOT EXISTS Inquiry (
  id TEXT PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  intent TEXT NOT NULL,
  tier TEXT,
  stage TEXT,
  objective TEXT,
  timeline TEXT,
  budget TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  projectDetails TEXT,
  createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
