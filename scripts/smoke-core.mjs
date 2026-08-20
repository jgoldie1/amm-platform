const base = (process.env.SMOKE_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

const checks = [
  ['home', '/'],
  ['academy', '/academy'],
  ['auth', '/auth'],
  ['live', '/live'],
];

async function check(name, path) {
  const started = Date.now();
  try {
    const response = await fetch(`${base}${path}`, { redirect: 'manual' });
    const ok = response.status >= 200 && response.status < 400;
    return { name, path, ok, status: response.status, latencyMs: Date.now() - started };
  } catch (error) {
    return { name, path, ok: false, status: 0, latencyMs: Date.now() - started, error: error instanceof Error ? error.message : String(error) };
  }
}

const results = [];
for (const [name, path] of checks) results.push(await check(name, path));

console.log(JSON.stringify({ base, ok: results.every((x) => x.ok), results }, null, 2));
if (!results.every((x) => x.ok)) process.exit(1);
