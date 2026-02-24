CREATE TYPE "public"."audit_log_action" AS ENUM('VERIFICATION_APPROVE', 'VERIFICATION_REJECT', 'SCORE_OVERRIDE', 'CREDIT_ADD', 'SUBSCRIPTION_ACTIVATE', 'PROFILE_UPDATE', 'OTHER');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"admin_id" uuid NOT NULL,
	"target_user_id" uuid NOT NULL,
	"action" "audit_log_action" NOT NULL,
	"details" text
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "internal_notes" text;