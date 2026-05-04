import { inspectInput, validateField, sanitizeInput } from '../utils/wafRules.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST is allowed for register.' });
  }

  const usernameRaw = req.body?.username ?? '';
  const emailRaw = req.body?.email ?? '';
  const password = req.body?.password ?? '';
  const username = String(usernameRaw).trim();
  const email = String(emailRaw).trim();

  const userValidation = validateField(username, { minLength: 3, maxLength: 32 });
  const emailValidation = validateField(email, { minLength: 5, maxLength: 128 });
  const passValidation = validateField(password, { minLength: 5, maxLength: 128 });

  if (!userValidation.valid) {
    return res.status(400).json({ error: userValidation.message });
  }
  if (!emailValidation.valid) {
    return res.status(400).json({ error: emailValidation.message });
  }
  if (!passValidation.valid) {
    return res.status(400).json({ error: passValidation.message });
  }

  const inspection = inspectInput(`${username} ${email}`);
  if (inspection.blocked) {
    return res.status(400).json({ error: 'Blocked registration input.', reason: inspection.reason });
  }

  const safeUsername = sanitizeInput(username);
  const safeEmail = sanitizeInput(email);

  return res.status(200).json({ message: `Registration successful for ${safeUsername}.`, username: safeUsername, email: safeEmail });
}
