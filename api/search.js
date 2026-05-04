import { inspectInput, sanitizeInput } from '../utils/wafRules.js';

const sampleProducts = [
  { title: 'Abstract oil painting', description: 'A colorful abstract oil painting for modern interiors.' },
  { title: 'Classic sculpture', description: 'A hand-finished modern sculpture in resin and stone.' },
  { title: 'Contemporary canvas', description: 'A vibrant canvas print that brightens any room.' },
  { title: 'Minimalist art print', description: 'A simple, elegant print that works in every home.' }
];

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST is allowed for search.' });
  }

  const rawTerm = req.body?.searchFor ?? '';
  const searchTerm = String(rawTerm).trim();
  const inspection = inspectInput(searchTerm);

  if (inspection.blocked) {
    return res.status(400).json({ error: 'Blocked search input.', reason: inspection.reason });
  }

  const safeTerm = sanitizeInput(searchTerm);
  const results = sampleProducts.filter((item) => {
    const lower = safeTerm.toLowerCase();
    return item.title.toLowerCase().includes(lower) || item.description.toLowerCase().includes(lower);
  });

  return res.status(200).json({ searchTerm: safeTerm, results: results.length ? results : [
      { title: 'No matches found', description: `No results matched your search for '${safeTerm}'.` }
    ]
  });
}
