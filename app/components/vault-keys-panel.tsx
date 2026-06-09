"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

import type { VaultKeyName } from "@/types/vault-keys";
import type { VaultSecretStatus } from "@/types/vault";

type VaultKeysPanelProps = {
  compact?: boolean;
  onSaved?: () => void;
};

export function VaultKeysPanel({ compact = false, onSaved }: VaultKeysPanelProps) {
  const [keys, setKeys] = useState<VaultSecretStatus[]>([]);
  const [values, setValues] = useState<Partial<Record<VaultKeyName, string>>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const loadRequestIdRef = useRef(0);
  const saveRequestIdRef = useRef(0);

  const loadKeys = useCallback(async () => {
    const requestId = ++loadRequestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/vault/secrets");
      if (!response.ok) {
        throw new Error("Unable to load key status");
      }

      const data = (await response.json()) as { keys: VaultSecretStatus[] };
      if (requestId !== loadRequestIdRef.current) return;
      setKeys(data.keys);
    } catch {
      if (requestId !== loadRequestIdRef.current) return;
      setError("Unable to load API key status.");
      setKeys([]);
    } finally {
      if (requestId !== loadRequestIdRef.current) return;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadKeys();
    }, 0);
    return () => {
      window.clearTimeout(timer);
      loadRequestIdRef.current += 1;
      saveRequestIdRef.current += 1;
    };
  }, [loadKeys]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const payload = Object.fromEntries(
      Object.entries(values).filter(([, value]) => value?.trim()),
    );

    if (Object.keys(payload).length === 0) {
      setSaving(false);
      setMessage("No new values to save.");
      return;
    }

    const requestId = ++saveRequestIdRef.current;
    setSaving(true);

    try {
      const response = await fetch("/api/vault/secrets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys: payload }),
      });

      if (!response.ok) {
        throw new Error("Unable to save keys");
      }

      const data = (await response.json()) as { keys: VaultSecretStatus[] };
      if (requestId !== saveRequestIdRef.current) return;
      setKeys(data.keys);
      setValues({});
      setMessage("Saved.");
      onSaved?.();
    } catch {
      if (requestId !== saveRequestIdRef.current) return;
      setError("Unable to save API keys.");
    } finally {
      if (requestId !== saveRequestIdRef.current) return;
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading key status…</p>;
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5">
      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-700 dark:text-emerald-300">{message}</p> : null}

      <div className={compact ? "grid max-h-[44vh] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2" : "space-y-5"}>
        {keys.map((key) => {
          const keyName = key.keyName as VaultKeyName;
          const isSecret = keyName.endsWith("_API_KEY");

          return (
            <div key={keyName}>
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor={keyName}
                  className="block font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  {keyName}
                </label>
                {key.configured ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    <Check className="size-3.5" aria-hidden />
                    Configured
                  </span>
                ) : (
                  <span className="text-xs font-medium text-muted-foreground">Missing</span>
                )}
              </div>
              <input
                id={keyName}
                name={keyName}
                type={isSecret ? "password" : "text"}
                autoComplete="off"
                spellCheck={false}
                value={values[keyName] ?? ""}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [keyName]: event.target.value,
                  }))
                }
                placeholder={key.configured ? "Leave blank to keep existing" : isSecret ? "••••••••" : ""}
                className="mt-2 h-11 w-full border border-border bg-surface px-3 font-mono text-sm text-foreground outline-none transition focus:border-accent"
              />
            </div>
          );
        })}
      </div>

      <div className={compact ? "flex justify-end" : "flex justify-end border-t border-border pt-5"}>
        <button
          type="submit"
          disabled={saving}
          className="h-10 bg-accent px-4 text-sm font-medium text-accent-foreground transition hover:bg-accent-hover disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
