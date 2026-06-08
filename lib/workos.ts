import "server-only";

import { WorkOS } from "@workos-inc/node";

import { getServerEnv } from "@/lib/env";

let workos: WorkOS | undefined;

export function getWorkOSClient() {
  workos ??= new WorkOS(getServerEnv().WORKOS_API_KEY);
  return workos;
}
