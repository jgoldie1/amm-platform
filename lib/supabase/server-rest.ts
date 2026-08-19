type JsonRecord = Record<string, unknown>;

function getConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url, serviceRoleKey };
}

export function isSupabaseConfigured() {
  return getConfig() !== null;
}

async function request<T>(
  path: string,
  init: RequestInit,
  prefer?: string,
): Promise<T> {
  const config = getConfig();
  if (!config) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`SUPABASE_REST_${response.status}: ${detail}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function insertRow<T extends JsonRecord>(
  table: string,
  row: JsonRecord,
): Promise<T> {
  const rows = await request<T[]>(
    table,
    { method: "POST", body: JSON.stringify(row) },
    "return=representation",
  );

  if (!rows[0]) {
    throw new Error(`SUPABASE_INSERT_EMPTY:${table}`);
  }

  return rows[0];
}

export async function selectRows<T>(
  table: string,
  query: string,
): Promise<T[]> {
  return request<T[]>(`${table}?${query}`, { method: "GET" });
}

export async function patchRows<T>(
  table: string,
  query: string,
  values: JsonRecord,
): Promise<T[]> {
  return request<T[]>(
    `${table}?${query}`,
    { method: "PATCH", body: JSON.stringify(values) },
    "return=representation",
  );
}
