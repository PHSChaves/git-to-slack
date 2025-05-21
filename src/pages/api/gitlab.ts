import type { NextApiRequest, NextApiResponse } from 'next'

const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  if (!SLACK_WEBHOOK) {
    console.error("Webhook URL não definida");
    return res.status(500).end('Slack webhook não configurado');
  }

  const mr = req.body?.object_attributes;

  if (!mr) return res.status(400).send("Payload inválido");

  if (mr.merge_status === 'cannot_be_merged') {
    const message = {
      text: `🚨 Merge Request com conflito:\n*${mr.title}*\n🔗 <${mr.url}|Ver MR>`,
    };

    await fetch(SLACK_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
  }

  res.status(200).end('OK');
}
