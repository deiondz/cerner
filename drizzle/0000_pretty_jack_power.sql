-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "workers" (
	"worker_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" text NOT NULL,
	"contact_number" text NOT NULL,
	"ward_assigned" text NOT NULL,
	"date_created" timestamp with time zone DEFAULT now() NOT NULL,
	"date_deleted" timestamp with time zone,
	"device_id" text
);
--> statement-breakpoint
CREATE TABLE "wards" (
	"ward_code" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"supervisor_id" uuid
);
--> statement-breakpoint
CREATE TABLE "households" (
	"nfc_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"ward_code" text NOT NULL,
	"household_id" text NOT NULL,
	"owner_number" text NOT NULL,
	"address" text NOT NULL,
	"date_created" timestamp with time zone DEFAULT now() NOT NULL,
	"date_updated" timestamp with time zone DEFAULT now() NOT NULL,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scanlogs" (
	"scan_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"nfc_id" uuid NOT NULL,
	"worker_id" uuid NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"gps_latitude" numeric,
	"gps_longitude" numeric,
	"sync_status" boolean DEFAULT false NOT NULL,
	"scan_method" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "citizenreports" (
	"report_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"nfc_id" uuid NOT NULL,
	"citizen_contact" text NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"status" text NOT NULL,
	"additional_notes" text
);
--> statement-breakpoint
ALTER TABLE "wards" ADD CONSTRAINT "wards_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "public"."workers"("worker_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "households" ADD CONSTRAINT "households_ward_code_fkey" FOREIGN KEY ("ward_code") REFERENCES "public"."wards"("ward_code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scanlogs" ADD CONSTRAINT "scanlogs_nfc_id_fkey" FOREIGN KEY ("nfc_id") REFERENCES "public"."households"("nfc_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scanlogs" ADD CONSTRAINT "scanlogs_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "public"."workers"("worker_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citizenreports" ADD CONSTRAINT "citizenreports_nfc_id_fkey" FOREIGN KEY ("nfc_id") REFERENCES "public"."households"("nfc_id") ON DELETE cascade ON UPDATE no action;
*/