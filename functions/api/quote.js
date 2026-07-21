const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 500;

function json(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

function cleanText(value, maxLength = MAX_FIELD_LENGTH) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character]);
}

function toList(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
}

function formatAnswer(value) {
  return cleanText(value).replace(/-/g, ' ') || 'Not provided';
}

function normalizePayload(payload) {
  const contact = payload && typeof payload.contact === 'object' ? payload.contact : {};
  const recommendation = payload && typeof payload.recommendation === 'object' ? payload.recommendation : {};
  const answers = payload && typeof payload.answers === 'object' ? payload.answers : {};
  const additionalNeeds = Array.isArray(payload?.additionalNeeds)
    ? payload.additionalNeeds.map((item) => cleanText(item, 100)).filter(Boolean).slice(0, 10)
    : [];

  return {
    contact: {
      name: cleanText(contact.name, 100),
      email: cleanText(contact.email, 254).toLowerCase(),
      phone: cleanText(contact.phone, 50),
      business: cleanText(contact.business, 150),
      website: cleanText(contact.website, 200),
    },
    answers: {
      businessType: cleanText(answers['1'], 100),
      digitalPresence: cleanText(answers['2'], 100),
      goal: cleanText(answers['3'], 100),
      timeline: cleanText(answers['4'], 100),
      budget: cleanText(answers['5'], 100),
    },
    additionalNeeds,
    recommendation: {
      packageName: cleanText(recommendation.packageName, 100),
      priceRange: cleanText(recommendation.priceRange, 100),
      whyReasons: Array.isArray(recommendation.whyReasons)
        ? recommendation.whyReasons.map((item) => cleanText(item, 200)).filter(Boolean).slice(0, 8)
        : [],
      features: Array.isArray(recommendation.features)
        ? recommendation.features.map((item) => cleanText(item, 200)).filter(Boolean).slice(0, 10)
        : [],
    },
  };
}

function validateQuote(quote) {
  if (!quote.contact.name || !EMAIL_PATTERN.test(quote.contact.email)) {
    return 'Please provide a valid name and email address.';
  }

  if (!quote.recommendation.packageName || !quote.recommendation.priceRange) {
    return 'A complete recommendation is required.';
  }

  return null;
}

async function sendEmail(apiKey, email) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(email),
  });

  if (!response.ok) {
    throw new Error(`Resend rejected the email with status ${response.status}.`);
  }
}

function customerEmail(quote, env) {
  const { contact, recommendation } = quote;
  const name = escapeHtml(contact.name);

  return {
    from: env.EMAIL_FROM,
    to: [contact.email],
    reply_to: env.LEAD_RECIPIENT_EMAIL,
    subject: `Your Code by Leon recommendation: ${recommendation.packageName}`,
    text: `Hi ${contact.name},\n\nBased on your answers, we recommend the ${recommendation.packageName} package (${recommendation.priceRange}).\n\nWhy it fits:\n${recommendation.whyReasons.map((reason) => `- ${reason}`).join('\n')}\n\nWhat's included:\n${recommendation.features.map((feature) => `- ${feature}`).join('\n')}\n\nReply to this email if you would like to discuss your project.\n\nCode by Leon`,
    html: `<p>Hi ${name},</p><p>Based on your answers, we recommend <strong>${escapeHtml(recommendation.packageName)}</strong> (${escapeHtml(recommendation.priceRange)}).</p><h2>Why it fits</h2><ul>${toList(recommendation.whyReasons)}</ul><h2>What's included</h2><ul>${toList(recommendation.features)}</ul><p>Reply to this email if you would like to discuss your project.</p><p>Code by Leon</p>`,
  };
}

function leadEmail(quote, env) {
  const { contact, answers, additionalNeeds, recommendation } = quote;
  const fields = [
    ['Name', contact.name],
    ['Email', contact.email],
    ['Phone', contact.phone || 'Not provided'],
    ['Business', contact.business || 'Not provided'],
    ['Business type', formatAnswer(answers.businessType)],
    ['Digital presence', formatAnswer(answers.digitalPresence)],
    ['Primary goal', formatAnswer(answers.goal)],
    ['Timeline', formatAnswer(answers.timeline)],
    ['Budget', formatAnswer(answers.budget)],
    ['Additional needs', additionalNeeds.length ? additionalNeeds.join(', ') : 'None selected'],
  ];
  const textFields = fields.map(([label, value]) => `${label}: ${value}`).join('\n');
  const htmlFields = fields.map(([label, value]) => `<li><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</li>`).join('');

  return {
    from: env.EMAIL_FROM,
    to: [env.LEAD_RECIPIENT_EMAIL],
    reply_to: contact.email,
    subject: `New quote lead: ${contact.name} — ${recommendation.packageName}`,
    text: `New Code by Leon quote lead\n\n${textFields}\n\nRecommendation: ${recommendation.packageName} (${recommendation.priceRange})`,
    html: `<h1>New Code by Leon quote lead</h1><ul>${htmlFields}</ul><p><strong>Recommendation:</strong> ${escapeHtml(recommendation.packageName)} (${escapeHtml(recommendation.priceRange)})</p>`,
  };
}

export async function onRequestPost({ request, env }) {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM || !env.LEAD_RECIPIENT_EMAIL) {
    return json({ error: 'Email delivery is not configured.' }, 503);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  const quote = normalizePayload(payload);
  if (quote.contact.website) {
    return json({ ok: true }, 202);
  }

  const validationError = validateQuote(quote);
  if (validationError) {
    return json({ error: validationError }, 400);
  }

  try {
    await Promise.all([
      sendEmail(env.RESEND_API_KEY, customerEmail(quote, env)),
      sendEmail(env.RESEND_API_KEY, leadEmail(quote, env)),
    ]);
  } catch (error) {
    console.error('Quote email delivery failed:', error);
    return json({ error: 'Unable to send the recommendation right now.' }, 502);
  }

  return json({ ok: true });
}

export const quoteEmailTestUtils = { normalizePayload, validateQuote };
