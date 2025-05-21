import type { NextApiRequest, NextApiResponse } from 'next'

const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const mr = req.body?.object_attributes;

  if (!mr) return res.status(400).send('No MR payload');

  if (mr.merge_status === 'cannot_be_merged') {
    const message = {
      text: `🚨 MR com conflito!\n*${mr.title}*\n🔗 <${mr.url}|Abrir MR>`,
    };

    await fetch(SLACK_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
  }

  res.status(200).end('OK');
}
