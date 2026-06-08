import { resolveCurrentAccount } from "@/lib/account-context";

export const dynamic = "force-dynamic";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border-t border-border py-3">
      <dt className="text-xs font-medium uppercase text-muted">{label}</dt>
      <dd className="mt-1 truncate font-mono text-sm text-foreground">{value}</dd>
    </div>
  );
}

export default async function Home() {
  const accountState = await resolveCurrentAccount();
  if (accountState.status !== "ready") {
    return null;
  }

  const { account, context } = accountState;

  return (
    <div className="flex-1 overflow-y-auto">
      <section className="mx-auto grid max-w-5xl gap-6 px-6 py-8 lg:grid-cols-[1fr_360px]">
        <div className="border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Workspace</h2>
              <p className="mt-1 text-sm text-muted">
                Tenant context is active for this session.
              </p>
            </div>
            <span className="border border-border bg-surface-muted px-3 py-1 text-xs font-medium uppercase text-foreground">
              {account.status}
            </span>
          </div>
        </div>

        <aside className="border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Context</h2>
          <dl className="mt-5">
            <Field label="Account ID" value={context.accountId} />
            <Field label="WorkOS Org" value={context.workosOrgId} />
            <Field label="User ID" value={context.userId} />
            <Field label="WorkOS User" value={context.workosUserId} />
            <Field label="Role" value={context.roleSlug ?? "unassigned"} />
          </dl>
        </aside>
      </section>
    </div>
  );
}
