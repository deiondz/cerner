import {
  pgTable,
  uuid,
  text,
  timestamp,
  foreignKey,
  numeric,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const workers = pgTable("workers", {
  workerId: uuid("worker_id")
    .default(sql`uuid_generate_v4()`)
    .primaryKey()
    .notNull(),
  name: text().notNull(),
  contactNumber: text("contact_number").notNull(),
  wardAssigned: text("ward_assigned").notNull(),
  dateCreated: timestamp("date_created", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  dateDeleted: timestamp("date_deleted", {
    withTimezone: true,
    mode: "string",
  }),
  deviceId: text("device_id"),
});

export const wards = pgTable(
  "wards",
  {
    wardCode: text("ward_code").primaryKey().notNull(),
    name: text().notNull(),
    supervisorId: uuid("supervisor_id"),
  },
  (table) => [
    foreignKey({
      columns: [table.supervisorId],
      foreignColumns: [workers.workerId],
      name: "wards_supervisor_id_fkey",
    }).onDelete("set null"),
  ],
);

export const households = pgTable(
  "households",
  {
    nfcId: uuid("nfc_id")
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    wardCode: text("ward_code").notNull(),
    householdId: text("household_id").notNull(),
    ownerNumber: text("owner_number").notNull(),
    address: text().notNull(),
    dateCreated: timestamp("date_created", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
    dateUpdated: timestamp("date_updated", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
    status: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.wardCode],
      foreignColumns: [wards.wardCode],
      name: "households_ward_code_fkey",
    }).onDelete("cascade"),
  ],
);

export const scanlogs = pgTable(
  "scanlogs",
  {
    scanId: uuid("scan_id")
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    nfcId: uuid("nfc_id").notNull(),
    workerId: uuid("worker_id").notNull(),
    timestamp: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    gpsLatitude: numeric("gps_latitude"),
    gpsLongitude: numeric("gps_longitude"),
    syncStatus: boolean("sync_status").default(false).notNull(),
    scanMethod: text("scan_method").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.nfcId],
      foreignColumns: [households.nfcId],
      name: "scanlogs_nfc_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.workerId],
      foreignColumns: [workers.workerId],
      name: "scanlogs_worker_id_fkey",
    }).onDelete("set null"),
  ],
);

export const citizenreports = pgTable(
  "citizenreports",
  {
    reportId: uuid("report_id")
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    nfcId: uuid("nfc_id").notNull(),
    citizenContact: text("citizen_contact").notNull(),
    timestamp: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    status: text().notNull(),
    additionalNotes: text("additional_notes"),
  },
  (table) => [
    foreignKey({
      columns: [table.nfcId],
      foreignColumns: [households.nfcId],
      name: "citizenreports_nfc_id_fkey",
    }).onDelete("cascade"),
  ],
);
