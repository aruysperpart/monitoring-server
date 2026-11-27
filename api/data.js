const { sb } = require("./_supabase");

module.exports = async (req, res) => {
  const n = Math.min(Math.max(Number(req.query.n) || 120, 1), 720);
  try {
    const r = await sb(`speed_log?select=created_at,mbps&order=created_at.desc&limit=${n}`);
    const rows = await r.json();
    const points = rows.reverse().map((x) => ({ t: Date.parse(x.created_at), mbps: x.mbps }));
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ points });
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
};
