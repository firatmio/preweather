import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { type, lat, lon, q, lang = 'en' } = req.query

    if (!type || (type !== 'reverse' && type !== 'search')) {
      res.status(400).json({ error: 'Invalid type parameter' })
      return
    }

    let nominatimUrl = ''

    if (type === 'reverse') {
      if (!lat || !lon) {
        res.status(400).json({ error: 'Missing lat or lon parameter' })
        return
      }
      nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2&accept-language=${lang}`
    } else if (type === 'search') {
      if (!q) {
        res.status(400).json({ error: 'Missing q parameter' })
        return
      }
      nominatimUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&accept-language=${lang}&q=${encodeURIComponent(String(q))}`
    }

    const nominatimResponse = await fetch(nominatimUrl, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'PreWeather-App/1.0',
      },
    })

    if (!nominatimResponse.ok) {
      res.status(nominatimResponse.status).json({
        error: 'Nominatim API error',
        status: nominatimResponse.status,
      })
      return
    }

    const data = await nominatimResponse.json()
    res.status(200).json(data)
  } catch (error: any) {
    console.error('Geocode proxy error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Unknown error',
    })
  }
}
