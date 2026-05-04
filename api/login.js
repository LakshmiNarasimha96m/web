import { inspectInput, validateField, sanitizeInput } from '../utils/wafRules.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST is allowed for login.' });
  }

  const usernameRaw = req.body?.username ?? '';
  const password = req.body?.password ?? '';
  const username = String(usernameRaw).trim();

  const userValidation = validateField(username, { minLength: 3, maxLength: 32 });
  const passValidation = validateField(password, { minLength: 5, maxLength: 128 });

  if (!userValidation.valid) {
    return res.status(400).json({ error: userValidation.message });
  }
  if (!passValidation.valid) {
    return res.status(400).json({ error: passValidation.message });
  }

  const inspection = inspectInput(username);
  if (inspection.blocked) {
    return res.status(400).json({ error: 'Blocked login input.', reason: inspection.reason });
  }

  const safeUsername = sanitizeInput(username);
  return res.status(200).json({ message: `Welcome back, ${safeUsername}!`, username: safeUsername });
}
