import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    let auth_key: string, target_lang: string, text: string

    if (typeof req.body === 'string') {
      const params = new URLSearchParams(req.body)
      auth_key = params.get('auth_key') || ''
      target_lang = params.get('target_lang') || ''
      text = params.get('text') || ''
    } else {
      auth_key = req.body.auth_key
      target_lang = req.body.target_lang
      text = req.body.text
    }

    if (!auth_key || !target_lang || !text) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    const params = new URLSearchParams()
    params.append('auth_key', auth_key)
    params.append('target_lang', target_lang)
    params.append('text', text)

    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    if (!response.ok) {
      throw new Error(`DeepL API error: ${response.status}`)
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    console.error('Translation error:', error)
    return res.status(500).json({ error: 'Translation failed' })
  }
}
