// Semua kredensial dibaca dari environment variable Vercel, tidak ada yang ditulis di kode
const URL_ = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const KEY = process.env.SUPABASE_SECRET_KEY;

async function sb(path, options = {}) {
  if (!URL_ || !KEY) throw new Error("SUPABASE_URL / SUPABASE_SECRET_KEY belum diisi di Vercel");
  const res = await fetch(`${URL_}/rest/v1/${path}`, {
    ...options,
    headers: { apikey: KEY, "Content-Type": "application/json", ...(options.headers || {}) },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return res;
}

module.exports = { sb };
