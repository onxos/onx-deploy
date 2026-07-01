/**
 * OCMBR Wave 4 — D10-S06 IU-SCH
 * DICOM Viewer Hooks (PACS) schema
 *
 * OCMBR Reference: D10-S06-IU-SCH
 * Depends on: D10-S05 (Imaging Request)
 */

import {
  integer,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { imagingRequest } from "./imaging-request-foundation";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ---------------------------------------------------------------------------
// onx_dicom_study — PACS link record for a completed imaging study
// ---------------------------------------------------------------------------
export const dicomStudy = createTable("dicom_study", {
  id: serial("id").primaryKey(),
  imagingRequestId: integer("imaging_request_id")
    .notNull()
    .references(() => imagingRequest.id, { onDelete: "restrict" }),
  studyUid: varchar("study_uid", { length: 200 }).unique().notNull(),
  studyDate: varchar("study_date", { length: 10 }),
  // YYYY-MM-DD
  modality: varchar("modality", { length: 20 }),
  // CR | DX | US | CT | MR | ES | OT
  description: varchar("description", { length: 300 }),
  pacsUrl: varchar("pacs_url", { length: 500 }),
  viewerUrl: varchar("viewer_url", { length: 500 }),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  seriesCount: integer("series_count").default(0),
  imageCount: integer("image_count").default(0),
  status: varchar("status", { length: 20 }).default("AVAILABLE").notNull(),
  // AVAILABLE | ARCHIVED | DELETED
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type DicomStudy = typeof dicomStudy.$inferSelect;
export type NewDicomStudy = typeof dicomStudy.$inferInsert;
