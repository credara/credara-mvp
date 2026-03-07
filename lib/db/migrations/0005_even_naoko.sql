CREATE TABLE "individuals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"phone" varchar(32) NOT NULL,
	"normalized_phone" varchar(32) NOT NULL,
	"full_name" varchar(255),
	"email" varchar(255),
	"credara_id" varchar(64),
	"trust_score" integer,
	"risk_level" "risk_level",
	"verification_status" "verification_status",
	"last_verification_date" timestamp,
	"internal_notes" text,
	"trust_report_content" jsonb,
	CONSTRAINT "individuals_normalized_phone_unique" UNIQUE("normalized_phone")
);
--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."user_role";--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('LANDLORD', 'FINTECH', 'ADMIN');--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "role" SET DATA TYPE "public"."user_role" USING "role"::"public"."user_role";--> statement-breakpoint
ALTER TABLE "report_unlocks" ALTER COLUMN "target_profile_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "report_unlocks" ADD COLUMN "target_individual_id" uuid;--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "last_verification_date";--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "internal_notes";