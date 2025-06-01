import { sql } from "drizzle-orm";
import {
  foreignKey,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  type UniqueConstraintBuilder,
} from "drizzle-orm/pg-core";

export const wards = pgTable(
  "wards",
  {
    wardId: uuid("ward_id")
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    wardName: text("ward_name").notNull(),
    supervisorId: uuid("supervisor_id"),
  },
  (table): { fk: ReturnType<typeof foreignKey> } => ({
    fk: foreignKey({
      columns: [table.supervisorId],
      foreignColumns: [workers.workerId],
      name: "wards_supervisor_id_fkey",
    }).onDelete("set null"),
  }),
);

export const households = pgTable(
  "households",
  {
    nfcId: uuid("nfc_id")
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
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
    wardId: uuid("ward_id").notNull(),
  },
  (table): { fk: ReturnType<typeof foreignKey> } => ({
    fk: foreignKey({
      columns: [table.wardId],
      foreignColumns: [wards.wardId],
      name: "households_ward_code_fkey",
    }).onDelete("cascade"),
  }),
);

export const workers = pgTable(
  "workers",
  {
    workerId: uuid("worker_id")
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    workerName: text("worker_name").notNull(),
    contactNumber: text("contact_number").notNull(),
    dateCreated: timestamp("date_created", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
    wardId: uuid("ward_id"),
  },
  (
    table,
  ): {
    fk: ReturnType<typeof foreignKey>;
    uniqueContact: UniqueConstraintBuilder;
  } => ({
    fk: foreignKey({
      columns: [table.wardId],
      foreignColumns: [wards.wardId],
      name: "workers_ward_id_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
    uniqueContact: unique("workers_contact_number_key").on(table.contactNumber),
  }),
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
  },
  (
    table,
  ): {
    fk1: ReturnType<typeof foreignKey>;
    fk2: ReturnType<typeof foreignKey>;
  } => ({
    fk1: foreignKey({
      columns: [table.nfcId],
      foreignColumns: [households.nfcId],
      name: "scanlogs_nfc_id_fkey",
    }).onDelete("cascade"),
    fk2: foreignKey({
      columns: [table.workerId],
      foreignColumns: [workers.workerId],
      name: "scanlogs_worker_id_fkey",
    }).onDelete("set null"),
  }),
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
  (table): { fk: ReturnType<typeof foreignKey> } => ({
    fk: foreignKey({
      columns: [table.nfcId],
      foreignColumns: [households.nfcId],
      name: "citizenreports_nfc_id_fkey",
    }).onDelete("cascade"),
  }),
);
