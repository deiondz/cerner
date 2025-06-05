import {
  pgTable,
  type AnyPgColumn,
  foreignKey,
  uuid,
  text,
  timestamp,
  numeric,
  unique,
  boolean,
  bigint,
  pgEnum,
  type PgTableWithColumns,
  type UniqueConstraintBuilder,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const methods = pgEnum("methods", ["nfc", "qr_code"]);

// Define the workers table first to avoid circular reference
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
    status: boolean("status").default(false),
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

// Define the type for the wards table
export const wards = pgTable(
  "wards",
  {
    wardId: uuid("ward_id")
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    wardName: text("ward_name").notNull(),
    supervisorId: uuid("supervisor_id"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).default(sql`(now() AT TIME ZONE 'utc'::text)`),
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
    houseId: uuid("house_id")
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
    wardId: uuid("ward_id"),
  },
  (table): { fk: ReturnType<typeof foreignKey> } => ({
    fk: foreignKey({
      columns: [table.wardId],
      foreignColumns: [wards.wardId],
      name: "households_ward_id_fkey",
    }).onDelete("set null"),
  }),
);

export const scanlogs = pgTable(
  "scanlogs",
  {
    scanId: uuid("scan_id")
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    houseId: uuid("house_id").notNull(),
    workerId: uuid("worker_id"),
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
      columns: [table.houseId],
      foreignColumns: [households.houseId],
      name: "scanlogs_house_id_fkey",
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
      foreignColumns: [households.houseId],
      name: "citizenreports_nfc_id_fkey",
    }).onDelete("cascade"),
  }),
);

export const tracker = pgTable(
  "tracker",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
      name: "tracker_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    method: methods().default("nfc").notNull(),
    houseId: uuid("house_id"),
  },
  (table): { fk: ReturnType<typeof foreignKey> } => ({
    fk: foreignKey({
      columns: [table.houseId],
      foreignColumns: [households.houseId],
      name: "tracker_house_id_fkey",
    }).onDelete("set null"),
  }),
);
