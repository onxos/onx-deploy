# ONX Platform — Database Migration Guide

## Approved Production Method: SQL Init Scripts

### Overview

The ONX Platform uses PostgreSQL init scripts for database initialization.
This is the approved production method.

### How It Works

1. Migration SQL files are stored in drizzle/
2. The docker-compose.yml mounts migration files into PostgreSQL's
   docker-entrypoint-initdb.d/ directory
3. PostgreSQL executes these scripts automatically on first container start

### Migration Files

| File | Description |
|------|-------------|
| drizzle/0000_real_unicorn.sql | Base schema |
| drizzle/0001_next_jean_grey.sql | Schema updates |
| drizzle/0002_atlas_v5_trains_nz.sql | Atlas V5: 29 tables |

### Reproducibility

To reproduce from clean state: docker-compose down -v && docker-compose up -d postgres

### Source of Truth

The SQL files in drizzle/ are the single source of truth.
