CREATE TABLE "report_unlocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"institution_user_id" uuid NOT NULL,
	"target_profile_id" uuid NOT NULL,
	"target_user_name" varchar(255),
	"target_credara_id" varchar(64),
	"score_at_unlock" integer,
	"risk_level" "risk_level"
);
