import L from 'leaflet';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { FaDownload, FaRegSnowflake } from 'react-icons/fa';
import {
    FaCloudRain,
    FaExclamation,
    FaLocationDot,
    FaSnowflake,
    FaTemperatureHalf,
    FaWater,
    FaWind,
} from 'react-icons/fa6';
import { MdSunny } from 'react-icons/md';
import { PiSparkleFill, PiSunHorizonBold } from 'react-icons/pi';
import { TiArrowLeftThick } from 'react-icons/ti';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { Link, useSearchParams } from 'react-router';
import { ClimateModal } from '../../components/ClimateModal';
import PwDatePicker from '../../components/DatePicker/DatePicker';
import { useTranslation } from '../../contexts/TranslationContext';
import './App.css';
import { MetricOverlay } from './MetricOverlay';

interface SelectedPoint {
  lat: number
  lng: number
}
interface SelectedPoint {
  lat: number
  lng: number
}
interface GeoSuggestion {
  display: string
  lat: number
  lon: number
}

export default function APP() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [climateOpen, setClimateOpen] = useState(false)
  const [infoBlob, setInfoBlob] = useState<{
    msg: string
    type?: 'warn' | 'error' | 'info'
  } | null>(null)
  const { t, language } = useTranslation()
  
  // URL'den başlangıç değerlerini al
  const [point, setPoint] = useState<SelectedPoint | null>(() => {
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    if (lat && lng) {
      const latNum = parseFloat(lat)
      const lngNum = parseFloat(lng)
      if (!isNaN(latNum) && !isNaN(lngNum)) {
        return { lat: latNum, lng: lngNum }
      }
    }
    return null
  })
  
  const [date, setDate] = useState<string>(() => {
    return searchParams.get('date') || ''
  })
  
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [checking, setChecking] = useState(false)
  const [adviceParts, setAdviceParts] = useState<{labelKey: string | null; content: string}[]>([])
  const [adviceTranslating, setAdviceTranslating] = useState(false)
  const adviceTranslationCacheRef = useRef<Map<string, string>>(new Map())
  const [metricsEnabled, setMetricsEnabled] = useState<Record<string, boolean>>(
    {},
  )
  const [activeMetric, setActiveMetric] = useState<string | null>(null)
  const [showCookieModal, setShowCookieModal] = useState(false)
  const [address, setAddress] = useState<string>('')
  const [editingAddress, setEditingAddress] = useState(false)
  const [addrQuery, setAddrQuery] = useState('')
  const [addrLoading, setAddrLoading] = useState(false)
  const [addrErrorShake, setAddrErrorShake] = useState(false)
  const [addrInvalid, setAddrInvalid] = useState(false)
  const [addrServerError, setAddrServerError] = useState(false)
  const [geoSuggestions, setGeoSuggestions] = useState<GeoSuggestion[]>([])
  const lastSearchIdRef = useRef<number>(0)
  const mapRef = useRef<L.Map | null>(null)
  const addrInputRef = useRef<HTMLInputElement | null>(null)
  const previousViewRef = useRef<{ center: L.LatLngExpression; zoom: number }>({
    center: [39.0, 33.0],
    zoom: 6,
  })
  const waterCacheRef = useRef<Map<string, boolean>>(new Map())
  const waterDetectedRef = useRef<boolean>(false)
  const [waterDetected, setWaterDetected] = useState(false)
  const overpassLastCallRef = useRef<number>(0)
  const overpassInFlightRef = useRef<AbortController | null>(null)
  const overpassFailRef = useRef<number>(0)
  const [suggIndex, setSuggIndex] = useState<number>(-1)
  const prevFocusRef = useRef<HTMLElement | null>(null)
  const addrEditorWrapRef = useRef<HTMLDivElement | null>(null)
  const mapWrapperRef = useRef<HTMLDivElement | null>(null)
  const suggListRef = useRef<HTMLDivElement | null>(null)
  const pendingAutoSelectRef = useRef<boolean>(false)
  const predictionAbortRef = useRef<AbortController | null>(null)
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>(() => {
    try {
      const saved = localStorage.getItem('pw.tempUnit')
      return saved === 'F' ? 'F' : 'C'
    } catch {
      return 'C'
    }
  })
  const [windUnit, setWindUnit] = useState<'MS' | 'KMH'>(() => {
    try {
      const saved = localStorage.getItem('pw.windUnit')
      return saved === 'KMH' ? 'KMH' : 'MS'
    } catch {
      return 'MS'
    }
  })

  // URL'i güncelle - point değiştiğinde
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    
    if (point) {
      params.set('lat', point.lat.toFixed(6))
      params.set('lng', point.lng.toFixed(6))
    } else {
      params.delete('lat')
      params.delete('lng')
    }
    
    setSearchParams(params, { replace: true })
  }, [point])

  // URL'i güncelle - date değiştiğinde
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    
    if (date) {
      params.set('date', date)
    } else {
      params.delete('date')
    }
    
    setSearchParams(params, { replace: true })
  }, [date])

  useEffect(() => {
    try {
      localStorage.setItem('pw.tempUnit', tempUnit)
    } catch {}
  }, [tempUnit])
  useEffect(() => {
    try {
      localStorage.setItem('pw.windUnit', windUnit)
    } catch {}
  }, [windUnit])

  useEffect(() => {
    document.body.classList.add('preload')
    const h = setTimeout(() => {
      document.body.classList.remove('preload')
    }, 60)
    return () => {
      clearTimeout(h)
      document.body.classList.remove('preload')
    }
  }, [])

  const handleDownloadJSON = () => {
    if (!result) return
    const exportObj = {
      point,
      date,
      generated_at: new Date().toISOString(),
      prediction_data: result.prediction_data,
      agricultural_advice: result.agricultural_advice,
    }
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `preweather_${date || 'data'}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const handleDownloadCSV = () => {
    if (!result) return
    try {
      const prediction = result.prediction_data || {}
      const metricNames = metricsList.filter((m) => prediction[m])
      const dateKeySet = new Set<string>()
      metricNames.forEach((m) => {
        const obj = prediction[m]
        if (obj && typeof obj === 'object') {
          Object.keys(obj).forEach((k) => {
            if (k !== 'percentage') dateKeySet.add(k)
          })
        }
      })
      const dateKeys = Array.from(dateKeySet).sort()
      const header = ['metric', 'percentage', ...dateKeys]
      const rows: string[][] = []
      metricNames.forEach((m) => {
        const obj = prediction[m]
        const pct = obj?.percentage ?? ''
        const row = [
          m,
          String(pct),
          ...dateKeys.map((k) => (obj && k in obj ? String(obj[k]) : '')),
        ]
        rows.push(row)
      })
      if (typeof prediction.percentage !== 'undefined') {
        rows.unshift([
          'OVERALL',
          String(prediction.percentage),
          ...dateKeys.map(() => ''),
        ])
      }
      const escape = (val: string) => {
        if (val == null) return ''
        const needs = /[",\n]/.test(val)
        return needs ? '"' + val.replace(/"/g, '""') + '"' : val
      }
      const csv = [header, ...rows]
        .map((r) => r.map(escape).join(','))
        .join('\n')
      const blob = new Blob(['\ufeff' + csv], {
        type: 'text/csv;charset=utf-8;',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `preweather_${date || 'data'}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('CSV export error', e)
    }
  }

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookieConsent')
      if (consent !== 'accepted') {
        setShowCookieModal(true)
      }
    } catch {
      setShowCookieModal(true)
    }
  }, [])

  const handleForceAcceptCookies = () => {
    try {
      localStorage.setItem('cookieConsent', 'accepted')
    } catch {}
    setShowCookieModal(false)
  }

  const todayISO = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  })()
  const maxDateISO = (() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() + 1)
    return d.toISOString().split('T')[0]
  })()

  function ClickCapture() {
    useMapEvents({
      click(ev) {
        const { lat, lng } = ev.latlng
        const newPoint = {
          lat: parseFloat(lat.toFixed(4)),
          lng: parseFloat(lng.toFixed(4)),
        }
        const changed =
          !point ||
          Math.abs(point.lat - newPoint.lat) > 0.00005 ||
          Math.abs(point.lng - newPoint.lng) > 0.00005
        if (mapRef.current) {
          previousViewRef.current = {
            center: mapRef.current.getCenter(),
            zoom: mapRef.current.getZoom(),
          }
        }
        setPoint(newPoint)
        if (changed) {
          setResult(null)
          setActiveMetric(null)
          setMetricsEnabled({})
          setError(null)
          setAddrInvalid(false)
          setWaterDetected(false)
          waterDetectedRef.current = false
          reverseGeocode(newPoint)
        }
      },
    })
    return null
  }

  const markerIcon = L.divIcon({
    className: 'pw-marker-wrapper',
    html: '<div class="pw-marker-core"></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })

  const metricsList = [
    'T2M',
    'T2M_MAX',
    'T2M_MIN',
    'PRECTOTCORR',
    'RH2M',
    'WS2M',
    'ALLSKY_KT',
    'AOD_55_ADJ',
    'PRECSNOLAND',
    'SNODP',
    'FROST_DAYS',
    'HDD18_3',
    'CDD18_3',
  ]

  const handleFetchPrediction = async () => {
    if (!point || !date || checking) return
    if (predictionAbortRef.current) predictionAbortRef.current.abort()
    const controller = new AbortController()
    predictionAbortRef.current = controller
    setChecking(true)
    setError(null)
    setResult(null)
    try {
      const d = new Date(date)
      if (isNaN(d.getTime())) throw new Error('Invalid date')
      const day = d.getUTCDate()
      const month = d.getUTCMonth() + 1
      const year = d.getUTCFullYear()
      const body = {
        latitude: point.lat,
        longitude: point.lng,
        day,
        month,
        year,
      }
      let res: Response
      const url = import.meta.env.VITE_RUST_URL as string;
      try {
        res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        })
      } catch (fetchErr: any) {
        setInfoBlob({
          msg: t('app.error.network') || 'Ağ bağlantı hatası',
          type: 'error',
        })
        setTimeout(() => setInfoBlob(null), 2500)
        throw new Error('NETWORK_ERROR')
      }
      if (!res.ok) {
        let rawText = ''
        try {
          rawText = await res.text()
        } catch {}
        const lowered = rawText.toLowerCase()
        if (
          res.status === 500 &&
          lowered.includes('could not parse response from prophet')
        ) {
          throw new Error('NO_DATA_PARSE_ERROR')
        }
        setInfoBlob({
          msg: t('app.error.general') || 'Bir hata oluştu',
          type: 'error',
        })
        setTimeout(() => setInfoBlob(null), 2500)
        let msg = `API error ${res.status}`
        if (rawText) msg += `: ${rawText.slice(0, 140)}`
        throw new Error(msg)
      }
      const data = await res.json()
      if (!data || typeof data !== 'object') throw new Error('Empty response')
      if (!data.prediction_data) throw new Error('prediction_data missing')
      setResult(data)
      setAdviceParts([])
      const enabledInit: Record<string, boolean> = {}
      metricsList.forEach((m) => (enabledInit[m] = false))
      setMetricsEnabled(enabledInit)
    } catch (err: any) {
      if (err?.name === 'AbortError') return
      if (err?.message === 'NO_DATA_PARSE_ERROR') {
        setResult(null)
        setError('NO_DATA_FOUND')
      } else {
        setInfoBlob({
          msg: t('app.error.general') || 'Bir hata oluştu',
          type: 'error',
        })
        setTimeout(() => setInfoBlob(null), 2500)
        setError(err.message || t('app.error.unknown'))
      }
    } finally {
      setChecking(false)
    }
  }

  const toggleMetric = (metric: string) => {
    setMetricsEnabled((prev) => ({ ...prev, [metric]: !prev[metric] }))
    setActiveMetric((m) => (m === metric ? null : metric))
  }

  const toggleAll = () => {
    const allEnabled = Object.values(metricsEnabled).every((v) => v)
    const next: Record<string, boolean> = {}
    metricsList.forEach((m) => (next[m] = !allEnabled))
    setMetricsEnabled(next)
    setActiveMetric(null)
  }

  const convertTemp = (c: number | null | undefined) => {
    if (c == null || isNaN(c)) return null
    return tempUnit === 'C' ? c : (c * 9) / 5 + 32
  }
  const formatTemp = (c: number | null | undefined) => {
    const v = convertTemp(c)
    if (v == null) return null
    return v.toFixed(1) + '°' + tempUnit
  }

  const parsedAdvice = useMemo(() => {
    const raw: string | undefined = result?.agricultural_advice
    if (!raw) return null
    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')
    if (start === -1 || end === -1) return null
    try {
      const jsonStr = raw.slice(start, end + 1)
      const obj = JSON.parse(jsonStr)
      return obj && typeof obj === 'object' ? obj : null
    } catch {
      return null
    }
  }, [result?.agricultural_advice])

  const orderedAdviceEntries = useMemo(() => {
    if (!parsedAdvice) return [] as { key: string; value: any }[]
    const order = [
      'yorum',
      'öneri',
      'comment',
      'advice',
      'summary',
      'risks',
      'recommendations',
      'actions',
      'notes',
    ]
    return Object.entries(parsedAdvice)
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => {
        const ai = order.indexOf(a.key)
        const bi = order.indexOf(b.key)
        if (ai === -1 && bi === -1) return a.key.localeCompare(b.key)
        if (ai === -1) return 1
        if (bi === -1) return -1
        return ai - bi
      })
  }, [parsedAdvice])

  useEffect(() => {
    const original = result?.agricultural_advice
    if (!original || typeof original !== 'string') {
      setAdviceParts([])
      return
    }
    const trimmed = original.trim()
    const isLikelyJSON = trimmed.startsWith('{') && trimmed.endsWith('}')
    if (isLikelyJSON) {
      setAdviceParts([])
      return
    }

    const labelMap: Record<string, string> = {
      yorum: 'advice.yorum',
      öneri: 'advice.öneri',
    }
    const parts: { labelKey: string | null; content: string; original: string }[] = []
    const regex = /(?:^|\n|\r|\s)(Yorum|Öneri)\s*:\s*/gi
    let lastIndex = 0
    let match: RegExpExecArray | null
    let lastLabel: string | null = null

    while ((match = regex.exec(original)) !== null) {
      if (match.index > lastIndex) {
        const content = original.slice(lastIndex, match.index).trim()
        if (content) parts.push({ labelKey: lastLabel, content, original: content })
      }
      const keyRaw = match[1].toLowerCase()
      lastLabel = labelMap[keyRaw] || null
      lastIndex = regex.lastIndex
    }
    const tail = original.slice(lastIndex).trim()
    if (tail) parts.push({ labelKey: lastLabel, content: tail, original: tail })

    if (language === 'tr') {
      setAdviceParts(parts)
      setAdviceTranslating(false)
      return
    }

    let cancelled = false
    const controllers: AbortController[] = []
    const targetLang = 'EN'
    const AUTH_KEY = import.meta.env.VITE_AUTH_KEY as string;

    setAdviceTranslating(true)
    setAdviceParts([])

    Promise.all(
      parts.map(async (part) => {
        const cacheKey = targetLang + '::' + part.original
        if (adviceTranslationCacheRef.current.has(cacheKey)) {
          return {
            ...part,
            content: adviceTranslationCacheRef.current.get(cacheKey) || part.content,
          }
        }
        const controller = new AbortController()
        controllers.push(controller)
        const params = new URLSearchParams()
        params.append('auth_key', AUTH_KEY)
        params.append('target_lang', targetLang)
        params.append('text', part.original)
        try {
          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
            signal: controller.signal,
          })
          if (!res.ok) throw new Error('translate_http_' + res.status)
          const data = await res.json()
          const translated = data?.translations?.[0]?.text
          if (typeof translated === 'string' && translated.length) {
            adviceTranslationCacheRef.current.set(cacheKey, translated)
            return { ...part, content: translated }
          }
        } catch {
        }
        return part
      }),
    )
      .then((translatedParts) => {
        if (!cancelled) {
          setAdviceParts(translatedParts)
          setAdviceTranslating(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAdviceParts(parts)
          setAdviceTranslating(false)
        }
      })

    return () => {
      cancelled = true
      controllers.forEach((c) => c.abort())
    }
  }, [result?.agricultural_advice, language])

  const reverseGeocode = async (pt: SelectedPoint) => {
    try {
      setAddrLoading(true)
      setAddrInvalid(false)
      setAddrServerError(false)
      setWaterDetected(false)
      waterDetectedRef.current = false
      const urlBase = `https://nominatim.openstreetmap.org/reverse?lat=${pt.lat}&lon=${pt.lng}&format=jsonv2&accept-language=${language}`
      let data: any = null
      let attempt = 0
      let lastStatus = 0
      while (attempt < 2) {
        attempt++
        const res = await fetch(urlBase, {
          headers: { Accept: 'application/json' },
        })
        lastStatus = res.status
        if (res.ok) {
          data = await res.json()
          break
        }
        if (res.status >= 500) {
          await new Promise((r) => setTimeout(r, 400 + attempt * 200))
          continue
        }
        throw new Error('bad response')
      }
      if (!data) {
        if (lastStatus >= 500) {
          setAddrServerError(true)
          throw new Error('server_500')
        }
        throw new Error('bad response')
      }
      const addr = data.address || {}
      const country = addr.country || addr.country_code?.toUpperCase() || ''
      const city = addr.city || addr.town || addr.state || addr.region || ''
      const district =
        addr.suburb || addr.county || addr.village || addr.municipality || ''
      const parts = [country, city, district].filter(Boolean)
      const label = parts.length
        ? parts.join(', ')
        : data.display_name || `${pt.lat},${pt.lng}`
      setAddress(label)
      setAddrQuery(label)
      const waterFlag =
        addr.ocean || addr.sea || addr.water || addr.bay || addr.hafen
      if (!country || waterFlag) {
        triggerAddrError()
        setAddrInvalid(true)
        setWaterDetected(!!waterFlag)
        waterDetectedRef.current = !!waterFlag
      }
      if (!waterFlag) {
        checkWaterViaOverpass(pt)
          .then((isWater) => {
            if (isWater) {
              triggerAddrError()
              setAddrInvalid(true)
              setWaterDetected(true)
              waterDetectedRef.current = true
            }
          })
          .catch(() => {})
      }
    } catch (e) {
      if (addrServerError) {
        setAddress(t('addr.serverError'))
      } else {
        setAddress(t('addr.reverseError'))
      }
      triggerAddrError()
      if (!addrServerError) setAddrInvalid(true)
      setWaterDetected(false)
      waterDetectedRef.current = false
    } finally {
      setAddrLoading(false)
    }
  }

  useEffect(() => {
    if (point) reverseGeocode(point)
  }, [point, language])

  useEffect(() => {
    if (!editingAddress) return
    const q = addrQuery.trim()
    if (!q) {
      setGeoSuggestions([])
      return
    }
    setAddrLoading(true)
    const searchId = ++lastSearchIdRef.current
    const controller = new AbortController()
    const handler = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&accept-language=${language}&q=${encodeURIComponent(
          q,
        )}`
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        })
        if (!res.ok) throw new Error('bad response')
        const data = await res.json()
        if (lastSearchIdRef.current !== searchId) return
        const mapped: GeoSuggestion[] = data.map((d: any) => ({
          display: d.display_name,
          lat: parseFloat(d.lat),
          lon: parseFloat(d.lon),
        }))
        setGeoSuggestions(mapped)
      } catch (e) {
        if ((e as any).name !== 'AbortError') setGeoSuggestions([])
      } finally {
        if (lastSearchIdRef.current === searchId) setAddrLoading(false)
      }
    }, 450)
    return () => {
      controller.abort()
      clearTimeout(handler)
    }
  }, [addrQuery, editingAddress, language])

  const applySuggestion = (s: GeoSuggestion) => {
    if (mapRef.current) {
      previousViewRef.current = {
        center: mapRef.current.getCenter(),
        zoom: mapRef.current.getZoom(),
      }
    }
    setAddress(s.display)
    setAddrQuery(s.display)
    setEditingAddress(false)
    const newPoint = { lat: s.lat, lng: s.lon }
    const changed =
      !point ||
      Math.abs(point.lat - newPoint.lat) > 0.00005 ||
      Math.abs(point.lng - newPoint.lng) > 0.00005
    setPoint(newPoint)
    if (changed) {
      setResult(null)
      setActiveMetric(null)
      setMetricsEnabled({})
      setError(null)
    }
    setAddrInvalid(false)
    setWaterDetected(false)
    waterDetectedRef.current = false
    if (mapRef.current) {
      const targetZoom = Math.max(mapRef.current.getZoom(), 12)
      mapRef.current.flyTo([s.lat, s.lon], targetZoom, { duration: 1.1 })
    }
  }

  const triggerAddrError = () => {
    setAddrErrorShake(true)
    setTimeout(() => setAddrErrorShake(false), 900)
  }

  const checkWaterViaOverpass = async (pt: SelectedPoint): Promise<boolean> => {
    const key = `${pt.lat.toFixed(4)},${pt.lng.toFixed(4)}`
    if (waterCacheRef.current.has(key))
      return waterCacheRef.current.get(key) || false
    try {
      const now = Date.now()
      const since = now - overpassLastCallRef.current
      const baseGap = 1600
      if (since < baseGap) {
        await new Promise((r) => setTimeout(r, baseGap - since))
      }
      const attempt = overpassFailRef.current
      const backoff = attempt ? Math.min(8000, 600 * Math.pow(2, attempt)) : 0
      if (backoff) await new Promise((r) => setTimeout(r, backoff))
      overpassLastCallRef.current = Date.now()
      if (overpassInFlightRef.current) {
        overpassInFlightRef.current.abort()
      }
      const controller = new AbortController()
      overpassInFlightRef.current = controller
      const query = `[out:json][timeout:7];(way(around:140,${pt.lat},${pt.lng})["natural"="water"];relation(around:140,${pt.lat},${pt.lng})["natural"="water"];);out body geom;`
      const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: new URLSearchParams({ data: query }),
        signal: controller.signal,
      })
      if (!res.ok) throw new Error('overpass bad')
      const data = await res.json()
      let isWater = false
      if (Array.isArray(data.elements)) {
        for (const el of data.elements) {
          if (!el.geometry || !Array.isArray(el.geometry)) continue
          const pts = el.geometry.map((g: any) => [g.lat, g.lon])
          if (pts.length < 3) continue
          let area = 0
          for (let i = 0; i < pts.length; i++) {
            const [y1, x1] = pts[i]
            const [y2, x2] = pts[(i + 1) % pts.length]
            area += x1 * y2 - x2 * y1
          }
          area = Math.abs(area) / 2
          const latScale = 111000
          const lonScale = Math.cos((pt.lat * Math.PI) / 180) * 111000
          const approxM2 = area * latScale * lonScale
          if (approxM2 > 5000) {
            isWater = true
            break
          }
        }
      }
      waterCacheRef.current.set(key, isWater)
      overpassFailRef.current = 0
      return isWater
    } catch (e: any) {
      if (e?.name === 'AbortError') return false
      overpassFailRef.current += 1
      waterCacheRef.current.set(key, false)
      return false
    }
  }

  useEffect(() => {
    if (addrInvalid && previousViewRef.current && mapRef.current) {
      const view = previousViewRef.current
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.flyTo(view.center as any, view.zoom, { duration: 0.8 })
        }
      }, 550)
    }
  }, [addrInvalid])

  const renderHighlighted = (text: string) => {
    const q = addrQuery.trim()
    if (!q) return text
    try {
      const esc = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const re = new RegExp(esc, 'ig')
      const parts: any[] = []
      let lastIndex = 0
      let match: RegExpExecArray | null
      while ((match = re.exec(text)) !== null) {
        if (match.index > lastIndex)
          parts.push(text.slice(lastIndex, match.index))
        parts.push(
          <span
            className="addr-sugg-highlight"
            key={match.index}
          >
            {match[0]}
          </span>,
        )
        lastIndex = match.index + match[0].length
      }
      if (lastIndex < text.length) parts.push(text.slice(lastIndex))
      return parts
    } catch {
      return text
    }
  }

  useEffect(() => {
    if (editingAddress && addrInputRef.current) {
      addrInputRef.current.focus()
      addrInputRef.current.select()
    }
  }, [editingAddress])

  const handleSuggestionNav = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!geoSuggestions.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSuggIndex((i) => (i + 1) % geoSuggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSuggIndex(
        (i) => (i - 1 + geoSuggestions.length) % geoSuggestions.length,
      )
    } else if (e.key === 'Enter') {
      if (suggIndex >= 0 && suggIndex < geoSuggestions.length) {
        e.preventDefault()
        applySuggestion(geoSuggestions[suggIndex])
      }
    }
  }

  useEffect(() => {
    if (!editingAddress) setSuggIndex(-1)
  }, [editingAddress])
  useEffect(() => {
    if (!geoSuggestions.length) setSuggIndex(-1)
  }, [geoSuggestions])

  useEffect(() => {
    if (suggIndex < 0) return
    const container = suggListRef.current
    if (!container) return
    const items = container.querySelectorAll<HTMLDivElement>('.addr-sugg')
    if (!items.length || !items[suggIndex]) return
    const el = items[suggIndex]
    const cTop = container.scrollTop
    const cHeight = container.clientHeight
    const eOffsetTop = el.offsetTop
    const eHeight = el.offsetHeight
    if (eOffsetTop < cTop) {
      container.scrollTo({ top: eOffsetTop - 4, behavior: 'smooth' })
    } else if (eOffsetTop + eHeight > cTop + cHeight) {
      container.scrollTo({
        top: eOffsetTop - cHeight + eHeight + 4,
        behavior: 'smooth',
      })
    }
  }, [suggIndex])

  useEffect(() => {
    if (pendingAutoSelectRef.current && !addrLoading && geoSuggestions.length) {
      pendingAutoSelectRef.current = false
      applySuggestion(geoSuggestions[0])
    }
    if (
      pendingAutoSelectRef.current &&
      !addrLoading &&
      !geoSuggestions.length
    ) {
      pendingAutoSelectRef.current = false
      triggerAddrError()
      setAddrInvalid(true)
    }
  }, [addrLoading, geoSuggestions])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault()
        openAddressEditor()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const openAddressEditor = () => {
    if (editingAddress) return
    const active = document.activeElement
    if (active && active instanceof HTMLElement) {
      prevFocusRef.current = active
    }
    setEditingAddress(true)
    setTimeout(() => {
      if (addrInputRef.current) {
        addrInputRef.current.focus()
        addrInputRef.current.select()
      }
    }, 0)
  }

  const closeAddressEditor = (restore = true) => {
    setEditingAddress(false)
    setSuggIndex(-1)
    setAddrInvalid(false)
    if (restore && prevFocusRef.current) {
      try {
        prevFocusRef.current.focus()
      } catch {}
      prevFocusRef.current = null
    }
  }

  useEffect(() => {
    if (!editingAddress) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        addrEditorWrapRef.current &&
        addrEditorWrapRef.current.contains(target)
      )
        return
      if (mapWrapperRef.current && mapWrapperRef.current.contains(target))
        return
      closeAddressEditor(true)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [editingAddress])

  // URL'den gelen koordinatlara haritayı yönlendir (sadece ilk yüklemede)
  useEffect(() => {
    if (point && mapRef.current) {
      const timer = setTimeout(() => {
        mapRef.current?.setView([point.lat, point.lng], 10, { animate: true })
        // Reverse geocode'u da çağır
        reverseGeocode(point)
      }, 500)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Sadece ilk mount'ta çalışır

  return (
    <div className="app-shell">
      {infoBlob && (
        <div className={`info-blob ${infoBlob.type || 'info'}`}>
          {infoBlob.msg}
        </div>
      )}
      {showCookieModal && (
        <div className="cookie-modal-overlay">
          <div
            className="cookie-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-required-title"
          >
            <h3 id="cookie-required-title">{t('cookie.required.title')}</h3>
            <p className="cm-msg">{t('cookie.required.message')}</p>
            <p className="cm-info">{t('cookie.required.info')}</p>
            <button
              className="cm-accept"
              onClick={handleForceAcceptCookies}
            >
              {t('cookie.required.accept')}
            </button>
          </div>
        </div>
      )}
      {(() => {
        const hasValidPoint = !!point && !addrInvalid
        return (
          <aside className={`app-sidebar${!hasValidPoint ? ' empty' : ''}`}>
            {!hasValidPoint && (
              <div className="empty-center">
                <div className="select-core">
                  <FaLocationDot className="core-icon" />
                  <h3>{t('app.select.title')}</h3>
                  <p>{t('app.select.desc')}</p>
                </div>
              </div>
            )}
            <div className="sidebar-section head">
              <h2 className="logo-inline">
                <div>
                  <Link
                    title={t('app.home.back')}
                    to="/"
                  >
                    <TiArrowLeftThick style={{ marginRight: '.5rem' }} />
                    PreWeather
                    <span>
                      <PiSparkleFill />
                    </span>
                  </Link>
                </div>
              </h2>
            </div>
            {hasValidPoint && (
              <>
                {!result && (
                  <div className="sidebar-select-side">
                    <div className="sidebar-section main">
                      <div className="sidebar-section location-block">
                        <h3>{t('app.location.title')}</h3>
                        <div className="kv">
                          <div>
                            <span>{t('app.lat')}</span>
                            <strong>{point.lat}</strong>
                          </div>
                          <div>
                            <span>{t('app.lng')}</span>
                            <strong>{point.lng}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="sidebar-section date-block">
                        <h3>{t('app.date')}</h3>
                        <PwDatePicker
                          value={date}
                          min={todayISO}
                          max={maxDateISO}
                          onChange={(v) => setDate(v)}
                          disabled={!point || checking}
                          locale={language || 'tr-TR'}
                          todayLabel={t('app.today') || 'Bugün'}
                          clearLabel={t('app.clear') || 'Temizle'}
                          warn={error === 'NO_DATA_FOUND'}
                        />
                        <small className="range-info">
                          {todayISO} - {maxDateISO}
                        </small>
                      </div>
                    </div>
                    <div className="sidebar-section action-block">
                      <button
                        className="predict-btn small"
                        disabled={!point || !date || checking}
                        onClick={handleFetchPrediction}
                      >
                        {checking ? (
                          <AiOutlineLoading
                            className={checking ? 'spin' : ''}
                          />
                        ) : (
                          <PiSparkleFill />
                        )}
                        {checking
                          ? t('app.results.loading')
                          : t('app.results.fetch')}
                      </button>
                    </div>
                  </div>
                )}
                {result && (
                  <>
                    <div className="results">
                      <h3>{t('app.results.title')}</h3>
                      <div className="unit-toggle-row">
                        <span
                          className="ut-label"
                          title={t('unit.toggleLabel')}
                        >
                          {t('unit.toggleLabel')}:
                        </span>
                        <div
                          className="ut-switch"
                          role="radiogroup"
                          aria-label={t('unit.toggleLabel')}
                        >
                          <button
                            type="button"
                            className={tempUnit === 'C' ? 'on' : ''}
                            aria-pressed={tempUnit === 'C'}
                            onClick={() => setTempUnit('C')}
                          >
                            {t('unit.celsius')}
                          </button>
                          <button
                            type="button"
                            className={tempUnit === 'F' ? 'on' : ''}
                            aria-pressed={tempUnit === 'F'}
                            onClick={() => setTempUnit('F')}
                          >
                            {t('unit.fahrenheit')}
                          </button>
                        </div>
                        <div
                          className="ut-switch"
                          role="radiogroup"
                          aria-label="Wind Unit"
                          style={{ marginLeft: '.4rem' }}
                        >
                          <button
                            type="button"
                            className={windUnit === 'MS' ? 'on' : ''}
                            aria-pressed={windUnit === 'MS'}
                            onClick={() => setWindUnit('MS')}
                          >
                            m/s
                          </button>
                          <button
                            type="button"
                            className={windUnit === 'KMH' ? 'on' : ''}
                            aria-pressed={windUnit === 'KMH'}
                            onClick={() => setWindUnit('KMH')}
                          >
                            km/h
                          </button>
                        </div>
                      </div>
                      <div className="readable-summary">
                        <div className="readable-head">
                          <span>{t('app.results.readableTitle')}</span>
                          {typeof result?.prediction_data?.percentage ===
                            'number' && (
                            <em
                              className="rel-pill"
                              title={t('app.results.reliability')}
                            >
                              {t('app.results.reliability')}:{' '}
                              {result.prediction_data.percentage.toFixed(1)}%
                            </em>
                          )}
                        </div>
                        {(() => {
                          const pdata = result.prediction_data || {}
                          const firstDataKey = (obj: any) =>
                            Object.keys(obj || {}).find(
                              (k) => k !== 'percentage',
                            ) || ''
                          const items: {
                            icon: React.ReactNode
                            label: string
                            value: string | null
                            descKey?: string
                            rel?: number
                          }[] = []
                          const metricIcon = (m: string): React.ReactNode => {
                            switch (m) {
                              case 'T2M':
                              case 'T2M_MAX':
                              case 'T2M_MIN':
                                return <FaTemperatureHalf />
                              case 'WS2M':
                                return <FaWind />
                              case 'PRECTOTCORR':
                                return <FaCloudRain />
                              case 'SNODP':
                                return <FaSnowflake />
                              case 'RH2M':
                                return <FaWater />
                              case 'ALLSKY_KT':
                                return <PiSunHorizonBold />
                              case 'HDD18_3':
                                return <MdSunny />
                              case 'CDD18_3':
                                return <FaRegSnowflake />
                              case 'PRECSNOLAND':
                                return <FaSnowflake />
                              case 'FROST_DAYS':
                                return <FaSnowflake />
                              default:
                                return <PiSparkleFill />
                            }
                          }
                          const formatVal = (
                            m: string,
                            raw: number | undefined | null,
                          ): string | null => {
                            if (typeof raw !== 'number' || isNaN(raw))
                              return null
                            if (['T2M', 'T2M_MAX', 'T2M_MIN'].includes(m))
                              return formatTemp(raw)
                            if (m === 'WS2M')
                              return windUnit === 'KMH'
                                ? (raw * 3.6).toFixed(1) + ' km/h'
                                : raw.toFixed(1) + ' m/s'
                            if (m === 'PRECTOTCORR')
                              return (raw < 0 ? 0 : raw).toFixed(1) + ' mm'
                            if (m === 'SNODP')
                              return Math.abs(raw).toFixed(2) + ' cm'
                            if (m === 'RH2M') return raw.toFixed(0) + '%'
                            if (m === 'ALLSKY_KT') {
                              return raw <= 1
                                ? (raw * 100).toFixed(0) + '%'
                                : raw.toFixed(0) + '%'
                            }
                            if (['AOD_55_ADJ'].includes(m))
                              return raw.toFixed(3)
                            if (['CDD18_3', 'HDD18_3'].includes(m))
                              return raw.toFixed(2)
                            if (['FROST_DAYS'].includes(m))
                              return Math.abs(raw).toFixed(0)
                            if (['PRECSNOLAND'].includes(m))
                              return raw.toFixed(2) + ' mm'
                            return raw.toString()
                          }
                          metricsList.forEach((m) => {
                            const obj = pdata[m]
                            if (!obj) return
                            const dk = firstDataKey(obj)
                            const raw =
                              obj && dk && typeof obj[dk] === 'number'
                                ? obj[dk]
                                : null
                            const value = formatVal(m, raw)
                            if (value === null) return
                            items.push({
                              icon: metricIcon(m),
                              label: t('metric.' + m),
                              value,
                              descKey: ('metricDesc.' + m) as any,
                              rel:
                                typeof obj.percentage === 'number'
                                  ? obj.percentage
                                  : undefined,
                            })
                          })
                          if (!items.length)
                            return <div className="readable-empty">–</div>
                          return (
                            <ul className="readable-list">
                              {items.map((it, i) => (
                                <li
                                  key={i}
                                  title={
                                    (it.descKey && t(it.descKey) !== it.descKey
                                      ? t(it.descKey) + ' • '
                                      : '') +
                                    it.label +
                                    (it.rel
                                      ? ' • ' + it.rel.toFixed(0) + '%'
                                      : '')
                                  }
                                >
                                  <span className="ic">{it.icon}</span>
                                  <span
                                    className="lab"
                                    title={it.label}
                                  >
                                    {it.label
                                      .replace(/\s*\(.*?\)\s*/g, '')
                                      .trim()}
                                  </span>
                                  <strong className="val">{it.value}</strong>
                                </li>
                              ))}
                            </ul>
                          )
                        })()}
                      </div>
                    </div>
                    <div className="gelismis">
                      <h3>{t('app.gelismis.title')}</h3>
                      <div className="climate-actions">
                        <button
                          type="button"
                          className="climate-btn"
                          onClick={() => setClimateOpen(true)}
                        >
                          {t('app.climateInfo')}
                        </button>
                      </div>
                      <div className="download-actions">
                        <ClimateModal
                          open={climateOpen}
                          onClose={() => setClimateOpen(false)}
                          data={result?.historical_nasa_data || []}
                          metrics={metricsList}
                          t={t}
                        />
                        <button
                          type="button"
                          onClick={handleDownloadCSV}
                          className="dl-btn csv"
                        >
                          <FaDownload />
                          {t('app.results.downloadCSV')}
                        </button>
                        <button
                          type="button"
                          onClick={handleDownloadJSON}
                          className="dl-btn json"
                        >
                          <FaDownload />
                          {t('app.results.downloadJSON')}
                        </button>
                      </div>
                    </div>
                  </>
                )}
                {error && error !== 'NO_DATA_FOUND' && (
                  <div className="sidebar-section result-block">
                    <div className="error-box">
                      <FaExclamation className="err-ic" />
                      {error}
                    </div>
                  </div>
                )}
                <div style={{ flex: 1 }} />
              </>
            )}
          </aside>
        )
      })()}
      {(() => {
        const hasValidPoint = !!point && !addrInvalid
        return (
          hasValidPoint && (
            <>
              {result && (
                <div className="result-block">
                  <div className="metrics-list">
                    <div className="metrics-head">
                      <span>{t('app.results.metrics')}</span>
                      <button
                        className="toggle-all"
                        onClick={toggleAll}
                      >
                        {t('app.results.toggleAll')}
                      </button>
                    </div>
                    <ul>
                      {metricsList.map((m) => {
                        const descMap: Record<string, string> = {
                          T2M: 'metricDesc.T2M',
                          T2M_MAX: 'metricDesc.T2M_MAX',
                          T2M_MIN: 'metricDesc.T2M_MIN',
                          WS2M: 'metricDesc.WS2M',
                          PRECTOTCORR: 'metricDesc.PRECTOTCORR',
                          SNODP: 'metricDesc.SNODP',
                          RH2M: 'metricDesc.RH2M',
                          ALLSKY_KT: 'metricDesc.ALLSKY_KT',
                        }
                        const desc = descMap[m] ? t(descMap[m]) : undefined
                        return (
                          <li
                            key={m}
                            className={metricsEnabled[m] ? 'on' : ''}
                            title={desc}
                          >
                            <label>
                              <input
                                type="checkbox"
                                checked={!!metricsEnabled[m]}
                                onChange={() => toggleMetric(m)}
                              />
                              <span>
                                {t(`metric.${m}`)
                                  .replace(/\s*\(.*?\)\s*/g, '')
                                  .trim()}
                              </span>
                              <em>
                                {result.prediction_data[m]?.percentage?.toFixed(
                                  2,
                                )}
                                %
                              </em>
                            </label>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </>
          )
        )
      })()}
      <div
        className="app-map-wrapper"
        ref={mapWrapperRef}
      >
        {/* Address overlay bottom center (always visible even if no point selected) */}
        <div
          className="addr-overlay"
          onClick={() => openAddressEditor()}
        >
          {!editingAddress && (
            <div
              className={`addr-display${
                addrErrorShake ? ' addr-error-shake' : ''
              }`}
              title={t('addr.editHint') + ' (Alt+S)'}
            >
              {addrLoading ? (
                <span className="addr-spinner" />
              ) : (
                <FaLocationDot className="addr-location-icon" />
              )}
              <span className="addr-text">
                {addrInvalid
                  ? t('addr.invalidMessage')
                  : address ||
                    (addrLoading
                      ? t('addr.searching')
                      : !point
                      ? t('addr.enterPlaceholder')
                      : '')}
              </span>
            </div>
          )}
          {editingAddress && (
            <div
              ref={addrEditorWrapRef}
              className={`addr-editor${
                addrErrorShake ? ' addr-error-shake' : ''
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                ref={addrInputRef}
                className="addr-input"
                value={addrInvalid ? '' : addrQuery}
                onChange={(e) => {
                  setAddrQuery(e.target.value)
                  if (addrInvalid) setAddrInvalid(false)
                }}
                placeholder={
                  addrInvalid
                    ? t('addr.invalidMessage')
                    : !point
                    ? t('addr.enterPlaceholder')
                    : t('addr.placeholder')
                }
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setAddrQuery(address)
                    closeAddressEditor(true)
                  }
                  if (e.key === 'Enter') {
                    if (addrLoading && !geoSuggestions.length) {
                      pendingAutoSelectRef.current = true
                      if (addrQuery.trim()) setAddress(addrQuery.trim())
                      if (addrInvalid) setAddrInvalid(false)
                      closeAddressEditor(false)
                      return
                    }
                    if (suggIndex >= 0 && geoSuggestions[suggIndex]) {
                      applySuggestion(geoSuggestions[suggIndex])
                    } else if (geoSuggestions.length) {
                      applySuggestion(geoSuggestions[0])
                    } else {
                      triggerAddrError()
                      setAddrInvalid(true)
                    }
                  } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    handleSuggestionNav(e)
                  }
                }}
              />
              <div className="addr-shortcut-hint">Alt+S</div>
              <div
                className="addr-suggestions"
                ref={suggListRef}
              >
                {addrLoading && (
                  <>
                    <div className="loading-sugg">
                      <span className="addr-spinner" />
                      {t('addr.searching')}
                    </div>
                  </>
                )}
                {!addrLoading &&
                  geoSuggestions.map((s, idx) => (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '.5rem',
                        alignItems: 'center',
                      }}
                      key={s.display}
                      className={`addr-sugg${
                        idx === suggIndex ? ' active' : ''
                      }`}
                      onClick={() => applySuggestion(s)}
                    >
                      <FaLocationDot style={{ width: 18, height: 18 }} />
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '.1rem',
                        }}
                      >
                        <div className="addr-sugg-line">
                          {renderHighlighted(s.display)}
                        </div>
                        <div
                          style={{ opacity: '.5' }}
                          className="addr-sugg-meta"
                        >
                          {s.lat.toFixed(4)}, {s.lon.toFixed(4)}
                        </div>
                      </div>
                    </div>
                  ))}
                {!addrLoading && !geoSuggestions.length && addrQuery.trim() && (
                  <div className="addr-sugg empty">{t('addr.noResults')}</div>
                )}
              </div>
            </div>
          )}
        </div>
        {waterDetected && (
          <div className="water-chip">{t('addr.waterDetected')}</div>
        )}
        {result && (
          <div className="top-center-stats">
            {typeof result?.prediction_data?.percentage === 'number' && (
              <div className="overall-chip error">
                <span className="label">
                  {t('app.results.overallAccuracy')}
                </span>
                <strong>{result.prediction_data.percentage.toFixed(2)}%</strong>
              </div>
            )}
            {typeof result?.prediction_data?.percentage === 'number' && (
              <div className="overall-chip">
                <span className="label">{t('app.results.overallError')}</span>
                <strong>
                  {(100 - result.prediction_data.percentage).toFixed(2)}%
                </strong>
              </div>
            )}
            {error && (
              <div className="overall-chip warn">
                <strong>{error}</strong>
              </div>
            )}
          </div>
        )}
        {result && (parsedAdvice || result.agricultural_advice) && (
          <div className="ai-insights-overlay">
            <div className="ai-insights-head">
              {t('app.results.aiInsights')}
            </div>
            <div className="ai-insights-body">
              {parsedAdvice ? (
                orderedAdviceEntries.map((entry) => {
                  if (entry.value == null) return null
                  const v = entry.value
                  const labelKey = `advice.${entry.key}`
                  const label = t(labelKey)
                  const isArray = Array.isArray(v)
                  const isObject = !isArray && typeof v === 'object'
                  return (
                    <div
                      className="ai-insight"
                      key={entry.key}
                    >
                      <div className="ai-insight-key">
                        {label !== labelKey ? label : entry.key}
                      </div>
                      <div className="ai-insight-val">
                        {isArray && (
                          <ul>
                            {v.map((item: any, i: number) => (
                              <li key={i}>{String(item)}</li>
                            ))}
                          </ul>
                        )}
                        {!isArray && isObject && (
                          <ul className="kv-list">
                            {Object.entries(v).map(([k, val]) => (
                              <li key={k}>
                                <strong>{k}</strong>
                                <span>{String(val)}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {!isArray && !isObject && <p>{String(v)}</p>}
                      </div>
                    </div>
                  )
                })
              ) : adviceTranslating ? (
                <div className="ai-insight">
                  <div className="ai-insight-val" style={{display: 'flex', alignItems: 'center', gap: '12px', color: '#999'}}>
                    <AiOutlineLoading className="spin" style={{fontSize: '20px'}} />
                    <span style={{fontSize: 16}}>{language === 'tr' ? 'Çeviriliyor...' : 'Translating...'}</span>
                  </div>
                </div>
              ) : adviceParts.length ? (
                adviceParts.map((seg, i) => (
                  <div
                    className="ai-insight"
                    key={i}
                  >
                    {seg.labelKey && (
                      <div className="ai-insight-key">{t(seg.labelKey)}</div>
                    )}
                    <div className="ai-insight-val">
                      {seg.content.split(/\n+/).map((p: string, pi: number) => (
                        <p key={pi}>{p}</p>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="ai-insight">
                  <div className="ai-insight-val">
                    <p>{result.agricultural_advice}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <MapContainer
          center={[39.0, 33.0]}
          zoom={6.45}
          minZoom={4}
          maxZoom={18}
          zoomControl={true}
          className="leaflet-host apple-dark"
          ref={(instance: any) => {
            mapRef.current = instance
          }}
        >
          <TileLayer
            attribution=""
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <ClickCapture />
          {point && (
            <Marker
              position={[point.lat, point.lng]}
              icon={markerIcon}
            />
          )}
          {point && activeMetric && metricsEnabled[activeMetric] && result && (
            <MetricOverlay
              metric={activeMetric}
              point={point}
              percentage={result.prediction_data[activeMetric]?.percentage || 0}
              active={true}
            />
          )}
        </MapContainer>
      </div>
    </div>
  )
}
