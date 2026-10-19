import { db } from '@/service/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Compass, RotateCw } from 'lucide-react'
import InfoSection from '../components/InfoSection'
import HotelSection from '../components/HotelSection'
import PlacesToVisit from '../components/PlacesToVisit'
import Footer from '../components/Footer'
import { Button } from '@/components/ui/button'

export default function ViewTrip() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    const timeout = setTimeout(() => {
      if (active) {
        setError('This trip is taking a little longer to load. Please try again.')
        setLoading(false)
        active = false
      }
    }, 15000)
    getDoc(doc(db, 'AITrips', tripId)).then(snapshot => {
      if (!active) return
      if (snapshot.exists()) setTrip(snapshot.data())
      else setError('We couldn’t find this trip. Check the link or plan a new adventure.')
    }).catch(() => {
      if (active) setError('We couldn’t load your itinerary. Please check your connection and try again.')
    }).finally(() => {
      clearTimeout(timeout)
      if (active) setLoading(false)
    })
    return () => { active = false; clearTimeout(timeout) }
  }, [tripId, attempt])

  return <div className="page-shell">
    <Link to="/create-trip" className="mb-6 inline-block text-sm text-muted-foreground hover:text-primary">← Plan another adventure</Link>
    {loading ? <div role="status" aria-label="Loading itinerary" className="space-y-6"><div className="h-80 animate-pulse rounded-2xl bg-muted" /><p className="text-muted-foreground">Opening your travel journal…</p><div className="grid gap-4 sm:grid-cols-3">{[1,2,3].map(i => <div key={i} className="h-48 animate-pulse rounded-2xl bg-muted" />)}</div></div>
      : error ? <div role="alert" className="travel-card px-6 py-16 text-center"><Compass className="mx-auto mb-5 text-primary" size={36} /><h1 className="section-heading">A small detour.</h1><p className="mx-auto mt-4 max-w-md text-muted-foreground">{error}</p><Button className="mt-6" onClick={() => setAttempt(value => value + 1)}><RotateCw /> Try again</Button></div>
      : trip && <><InfoSection trip={trip} /><HotelSection trip={trip} /><PlacesToVisit trip={trip} /><Footer /></>}
  </div>
}
