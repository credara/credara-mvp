CREATE TYPE "public"."admin_level" AS ENUM('SUPER', 'VERIFIER', 'FINANCE', 'SUPPORT');--> statement-breakpoint
CREATE TYPE "public"."risk_level" AS ENUM('LOW', 'MEDIUM', 'HIGH');--> statement-breakpoint
CREATE TYPE "public"."subscription_plan" AS ENUM('MONTHLY', 'YEARLY');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('ACTIVE', 'EXPIRED', 'PENDING', 'NONE');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('INDIVIDUAL', 'LANDLORD', 'FINTECH', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'PENDING_REVIEW', 'VERIFIED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"phone" varchar(32) NOT NULL,
	"credara_id" varchar(64),
	"email" varchar(255),
	"full_name" varchar(255),
	"role" "user_role" NOT NULL,
	"institution_type" varchar(32),
	"business_name" varchar(255),
	"trust_score" integer,
	"risk_level" "risk_level",
	"verification_status" "verification_status",
	"last_verification_date" timestamp,
	"is_active" boolean DEFAULT true,
	"last_login" timestamp,
	"credit_balance" integer DEFAULT 0,
	"total_credits_purchased" integer DEFAULT 0,
	"last_credit_purchase_date" timestamp,
	"subscription_status" "subscription_status",
	"subscription_plan" "subscription_plan",
	"subscription_start_date" timestamp,
	"subscription_end_date" timestamp,
	"total_reports_unlocked" integer DEFAULT 0,
	"admin_level" "admin_level",
	"last_active" timestamp
);
