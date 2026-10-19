import { useState } from 'react'

export default function TravelImage({ src, alt, className = '', loading = 'lazy' }) {
  const [failedSource, setFailedSource] = useState(null)
  return <img src={src && failedSource !== src ? src : '/placeholder.jpg'} alt={alt} className={`bg-muted ${className}`} loading={loading} onError={() => setFailedSource(src)} />
}
