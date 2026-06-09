CREATE TABLE "vault_secrets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"workos_org_id" text NOT NULL,
	"vault_object_id" text NOT NULL,
	"vault_object_name" text NOT NULL,
	"kind" text NOT NULL,
	"provider" text NOT NULL,
	"created_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vault_secrets_vault_object_id_unique" UNIQUE("vault_object_id"),
	CONSTRAINT "vault_secrets_vault_object_name_unique" UNIQUE("vault_object_name"),
	CONSTRAINT "vault_secrets_workos_org_id_format" CHECK ("vault_secrets"."workos_org_id" like 'org_%'),
	CONSTRAINT "vault_secrets_object_id_format" CHECK ("vault_secrets"."vault_object_id" like 'secret_%'),
	CONSTRAINT "vault_secrets_kind_check" CHECK ("vault_secrets"."kind" in ('api_key'))
);
--> statement-breakpoint
ALTER TABLE "vault_secrets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "vault_secrets" ADD CONSTRAINT "vault_secrets_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vault_secrets" ADD CONSTRAINT "vault_secrets_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "vault_secrets_account_id_idx" ON "vault_secrets" USING btree ("account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "vault_secrets_account_kind_provider_key" ON "vault_secrets" USING btree ("account_id","kind","provider");--> statement-breakpoint
CREATE POLICY "vault_secrets_account_isolation" ON "vault_secrets" AS PERMISSIVE FOR ALL TO public USING ("vault_secrets"."account_id"::text = current_setting('app.account_id', true)) WITH CHECK ("vault_secrets"."account_id"::text = current_setting('app.account_id', true));