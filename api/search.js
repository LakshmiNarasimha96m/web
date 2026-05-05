import fetch from 'node-fetch';

// REMOVE OLD WAF (not needed)
// import { inspectInput, sanitizeInput } from '../utils/wafRules.js';

const sampleProducts = [
  { title: 'Abstract oil painting', description: 'A colorful abstract oil painting for modern interiors.' },
  { title: 'Classic sculpture', description: 'A hand-finished modern sculpture in resin and stone.' },
  { title: 'Contemporary canvas', description: 'A vibrant canvas print that brightens any room.' },
  { title: 'Minimalist art print', description: 'A simple, elegant print that works in every home.' }
];

// 🔥 PUT YOUR REAL WAF URL HERE
const WAF_URL = "https://firewall-1-jajw.onrender.com/";

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST is allowed for search.' });
  }

  const rawTerm = req.body?.searchFor ?? '';
  const searchTerm = String(rawTerm).trim();

  // -----------------------------
  // 🔥 STEP 1: CALL WAF
  // -----------------------------
  try {
    const wafRes = await fetch(WAF_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ payload: searchTerm })
    });

    const wafResult = await wafRes.json();

    // 🚨 BLOCK (IMPORTANT FIX: return 200, NOT 403)
    if (wafResult.status === "block") {
      return res.status(200).json({
        error: "Blocked by WAF",
        attack: wafResult.attack_type,
        explanation: wafResult.explanation
      });
    }

  } catch (err) {
    console.error("WAF ERROR:", err);

    return res.status(200).json({
      error: "WAF connection failed",
      details: err.message
    });
  }

  // -----------------------------
  // ✅ NORMAL SEARCH (UNCHANGED)
  // -----------------------------
  const safeTerm = searchTerm;

  const results = sampleProducts.filter((item) => {
    const lower = safeTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(lower) ||
      item.description.toLowerCase().includes(lower)
    );
  });

  return res.status(200).json({
    searchTerm: safeTerm,
    results: results.length
      ? results
      : [
          {
            title: 'No matches found',
            description: `No results matched your search for '${safeTerm}'.`
          }
        ]
  });
}
