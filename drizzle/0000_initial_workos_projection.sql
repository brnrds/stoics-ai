CREATE EXTENSION IF NOT EXISTS "citext";--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS "pgcrypto";--> statement-breakpoint
CREATE TABLE "account_memberships" (
	"account_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"workos_membership_id" text,
	"role_slug" text,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "account_memberships_account_id_user_id_pk" PRIMARY KEY("account_id","user_id"),
	CONSTRAINT "account_memberships_workos_membership_id_unique" UNIQUE("workos_membership_id"),
	CONSTRAINT "account_memberships_workos_membership_id_format" CHECK ("account_memberships"."workos_membership_id" is null or "account_memberships"."workos_membership_id" like 'om_%'),
	CONSTRAINT "account_memberships_status_check" CHECK ("account_memberships"."status" in ('active', 'inactive', 'pending'))
);
--> statement-breakpoint
ALTER TABLE "account_memberships" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workos_org_id" text NOT NULL,
	"name" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"onboarding_skipped_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "accounts_workos_org_id_unique" UNIQUE("workos_org_id"),
	CONSTRAINT "accounts_workos_org_id_format" CHECK ("accounts"."workos_org_id" like 'org_%'),
	CONSTRAINT "accounts_status_check" CHECK ("accounts"."status" in ('active', 'inactive', 'pending'))
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workos_user_id" text NOT NULL,
	"email" "citext" NOT NULL,
	"name" text,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_workos_user_id_unique" UNIQUE("workos_user_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_workos_user_id_format" CHECK ("users"."workos_user_id" like 'user_%'),
	CONSTRAINT "users_status_check" CHECK ("users"."status" in ('active', 'inactive', 'pending'))
);
--> statement-breakpoint
ALTER TABLE "account_memberships" ADD CONSTRAINT "account_memberships_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account_memberships" ADD CONSTRAINT "account_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_memberships_user_id_idx" ON "account_memberships" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "account_memberships_status_idx" ON "account_memberships" USING btree ("status");--> statement-breakpoint
CREATE INDEX "accounts_status_idx" ON "accounts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "users_status_idx" ON "users" USING btree ("status");--> statement-breakpoint
CREATE POLICY "account_memberships_account_isolation" ON "account_memberships" AS PERMISSIVE FOR ALL TO public USING ("account_memberships"."account_id"::text = current_setting('app.account_id', true)) WITH CHECK ("account_memberships"."account_id"::text = current_setting('app.account_id', true));