import {
  pgTable,
  unique,
  varchar,
  foreignKey,
  timestamp,
  numeric,
  boolean,
  text,
} from "drizzle-orm/pg-core";

export const wards = pgTable(
  "wards",
  {
    wardCode: varchar("ward_code").primaryKey().notNull(),
    name: varchar(),
    supervisorId: varchar("supervisor_id").default("NULL "),
  },
  (table) => [unique("wards_supervisor_id_key").on(table.supervisorId)],
);

export const workers = pgTable(
  "workers",
  {
    workerId: varchar("worker_id").primaryKey().notNull(),
    name: varchar(),
    contactNumber: varchar("contact_number"),
    wardAssigned: varchar("ward_assigned"),
    dateCreated: timestamp("date_created", { mode: "string" }),
    dateDeleted: timestamp("date_deleted", { mode: "string" }),
    deviceId: varchar("device_id"),
  },
  (table) => [
    foreignKey({
      columns: [table.workerId],
      foreignColumns: [wards.supervisorId],
      name: "fk_supervisor",
    }),
    foreignKey({
      columns: [table.wardAssigned],
      foreignColumns: [wards.wardCode],
      name: "fk_ward",
    }),
  ],
);

export const households = pgTable(
  "households",
  {
    nfcId: varchar("nfc_id").primaryKey().notNull(),
    wardCode: varchar("ward_code"),
    householdId: varchar("household_id"),
    ownerNumber: varchar("owner_number"),
    address: varchar(),
    dateCreated: timestamp("date_created", { mode: "string" }),
    dateUpdated: timestamp("date_updated", { mode: "string" }),
    status: varchar(),
  },
  (table) => [
    foreignKey({
      columns: [table.wardCode],
      foreignColumns: [wards.wardCode],
      name: "fk_household_ward",
    }),
  ],
);

export const scanlogs = pgTable(
  "scanlogs",
  {
    scanId: varchar("scan_id").primaryKey().notNull(),
    nfcId: varchar("nfc_id"),
    workerId: varchar("worker_id"),
    timestamp: timestamp({ mode: "string" }),
    gpsLatitude: numeric("gps_latitude", { precision: 9, scale: 6 }),
    gpsLongitude: numeric("gps_longitude", { precision: 9, scale: 6 }),
    syncStatus: boolean("sync_status"),
    scanMethod: varchar("scan_method"),
  },
  (table) => [
    foreignKey({
      columns: [table.nfcId],
      foreignColumns: [households.nfcId],
      name: "fk_scan_nfc",
    }),
    foreignKey({
      columns: [table.workerId],
      foreignColumns: [workers.workerId],
      name: "fk_scan_worker",
    }),
  ],
);

export const citizenreports = pgTable(
  "citizenreports",
  {
    reportId: varchar("report_id").primaryKey().notNull(),
    nfcId: varchar("nfc_id"),
    citizenContact: varchar("citizen_contact"),
    timestamp: timestamp({ mode: "string" }),
    status: varchar(),
    additionalNotes: text("additional_notes"),
  },
  (table) => [
    foreignKey({
      columns: [table.nfcId],
      foreignColumns: [households.nfcId],
      name: "fk_report_nfc",
    }),
  ],
);
