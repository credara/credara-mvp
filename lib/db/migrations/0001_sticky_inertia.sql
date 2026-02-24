ALTER TABLE "profiles" ALTER COLUMN "subscription_status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."subscription_status";--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('ACTIVE', 'EXPIRED', 'NONE');--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "subscription_status" SET DATA TYPE "public"."subscription_status" USING "subscription_status"::"public"."subscription_status";--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "verification_status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."verification_status";--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'VERIFIED', 'REJECTED');--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "verification_status" SET DATA TYPE "public"."verification_status" USING "verification_status"::"public"."verification_status";