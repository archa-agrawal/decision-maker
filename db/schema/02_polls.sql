-- Drop and recreate polls table (Example)

DROP TABLE IF EXISTS polls CASCADE;
CREATE TABLE polls (
id SERIAL PRIMARY KEY,
creator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
title VARCHAR(255) NOT NULL,
choices TEXT[][] NOT NULL,
name_required BOOLEAN
);



