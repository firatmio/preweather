import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  canonical?: string
}

export function SEO({
  title = 'PreWeather - NASA API × Prophet ML Weather Predictions',
  description = 'Make accurate weather predictions for future dates using NASA POWER API and Prophet machine learning model. Get temperature, precipitation, humidity, wind speed forecasts for any location worldwide.',
  keywords = 'weather prediction, nasa api, prophet ml, machine learning, weather forecast, climate data, meteorology',
  image = 'https://preweather-nasa.vercel.app/logo.png',
  url = 'https://preweather-nasa.vercel.app',
  type = 'website',
  canonical,
}: SEOProps) {
  useEffect(() => {
    document.title = title

    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name'
      let element = document.querySelector(`meta[${attribute}="${name}"]`)
      
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        document.head.appendChild(element)
      }
      
      element.setAttribute('content', content)
    }

    updateMetaTag('title', title)
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)

    updateMetaTag('og:title', title, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:image', image, true)
    updateMetaTag('og:url', url, true)
    updateMetaTag('og:type', type, true)

    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', image)
    updateMetaTag('twitter:url', url)

    if (canonical) {
      let linkElement = document.querySelector('link[rel="canonical"]')
      
      if (!linkElement) {
        linkElement = document.createElement('link')
        linkElement.setAttribute('rel', 'canonical')
        document.head.appendChild(linkElement)
      }
      
      linkElement.setAttribute('href', canonical)
    }
  }, [title, description, keywords, image, url, type, canonical])

  return null
}

export function useSEO(props: SEOProps) {
  useEffect(() => {
    const {
      title = 'PreWeather - NASA API × Prophet ML Weather Predictions',
      description = 'Make accurate weather predictions for future dates using NASA POWER API and Prophet machine learning model.',
      keywords = 'weather prediction, nasa api, prophet ml, machine learning, weather forecast',
      image = 'https://preweather-nasa.vercel.app/logo.png',
      url = 'https://preweather-nasa.vercel.app',
      type = 'website',
      canonical,
    } = props

    document.title = title

    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name'
      let element = document.querySelector(`meta[${attribute}="${name}"]`)
      
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        document.head.appendChild(element)
      }
      
      element.setAttribute('content', content)
    }

    updateMetaTag('title', title)
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    updateMetaTag('og:title', title, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:image', image, true)
    updateMetaTag('og:url', url, true)
    updateMetaTag('og:type', type, true)
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', image)
    updateMetaTag('twitter:url', url)

    if (canonical) {
      let linkElement = document.querySelector('link[rel="canonical"]')
      
      if (!linkElement) {
        linkElement = document.createElement('link')
        linkElement.setAttribute('rel', 'canonical')
        document.head.appendChild(linkElement)
      }
      
      linkElement.setAttribute('href', canonical)
    }
  }, [props])
}
