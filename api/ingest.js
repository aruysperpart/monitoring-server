const { sb } = require("./_supabase");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Gunakan metode POST" });
  }
  if (req.headers["x-api-key"] !== process.env.DEVICE_API_KEY) {
    return res.status(401).json({ error: "Kunci API tidak cocok" });
  }

  const mbps = Number(req.body && req.body.mbps);
  if (!Number.isFinite(mbps) || mbps < 0 || mbps > 10000) {
    return res.status(400).json({ error: "Nilai mbps tidak valid" });
  }

  try {
    await sb("speed_log", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ mbps: Math.round(mbps * 100) / 100 }),
    });

    // Sesekali hapus data lebih tua dari 24 jam supaya tabel tidak membengkak
    if (Math.random() < 1 / 30) {
      const cutoff = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
      await sb(`speed_log?created_at=lt.${encodeURIComponent(cutoff)}`, { method: "DELETE" });
    }
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
};
