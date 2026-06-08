export default function KeysPage() {
  return (
    <section className="border border-border bg-surface p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Keys / Secrets</h2>
        <p className="mt-1 text-sm text-muted">
          Provider credentials for this workspace. Values are stored in WorkOS
          Vault; only configuration status is shown here.
        </p>
      </div>
      <p className="text-sm text-muted">Vault UI not implemented yet.</p>
    </section>
  );
}
