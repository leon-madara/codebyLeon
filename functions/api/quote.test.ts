import { afterEach, describe, expect, it, vi } from 'vitest';
import { onRequestPost } from './quote.js';

const environment = {
  RESEND_API_KEY: 'test-key',
  EMAIL_FROM: 'Code by Leon <hello@codebyleon.com>',
  LEAD_RECIPIENT_EMAIL: 'leon@example.com',
};

const payload = {
  contact: { name: 'Amina Otieno', email: 'amina@example.com', phone: '+254700000000', business: 'Amina Studio' },
  answers: { '1': 'small-business', '2': 'no-website', '3': 'leads', '4': 'asap', '5': 'budget-low' },
  additionalNeeds: ['seo', 'whatsapp'],
  recommendation: {
    packageName: 'Launch Starter',
    priceRange: 'KES 30,000 - 50,000',
    whyReasons: ['Starting fresh—no old code to fix'],
    features: ['3-5 Page Custom Site'],
  },
};

describe('POST /api/quote', () => {
  afterEach(() => vi.restoreAllMocks());

  it('sends the visitor recommendation and Leon the lead details', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }));
    const request = new Request('https://codebyleon.com/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const response = await onRequestPost({ request, env: environment });

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toMatchObject({
      to: ['amina@example.com'],
      reply_to: 'leon@example.com',
      subject: expect.stringContaining('Launch Starter'),
    });
    expect(JSON.parse(fetchMock.mock.calls[1][1]?.body as string)).toMatchObject({
      to: ['leon@example.com'],
      reply_to: 'amina@example.com',
      subject: expect.stringContaining('Amina Otieno'),
    });
  });

  it('silently accepts a honeypot submission without sending email', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    const request = new Request('https://codebyleon.com/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, contact: { ...payload.contact, website: 'https://spam.example' } }),
    });

    const response = await onRequestPost({ request, env: environment });

    expect(response.status).toBe(202);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
