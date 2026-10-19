import { createElement } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowRight, Compass, MapPin, Route, Bookmark, MoveDown } from 'lucide-react'
import { Button } from '../ui/button'
import TravelImage from './TravelImage'

const destinations = [
  { name: 'Kyoto', country: 'Japan', note: 'Quiet gardens & winding lanes', image: 'photo-1493976040374-85c8e12f0c0e' },
  { name: 'The Dolomites', country: 'Italy', note: 'Alpine trails & fresh perspectives', image: 'photo-1464822759023-fed622ff2c3b' },
  { name: 'Bali', country: 'Indonesia', note: 'Island mornings & a slower pace', image: 'photo-1537996194471-e657df975ab4' },
]
const photo = (id, width = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

export default function Hero() {
  return <>
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-10 md:grid-cols-2 md:gap-12 md:px-8 md:py-16 lg:gap-20">
      <div className="py-3 lg:py-10">
        <span className="travel-kicker"><span className="h-2 w-2 rounded-full bg-[#ba6649]" /> A little curiosity. A whole world.</span>
        <h1 className="mt-6 font-heading text-5xl leading-[1.06] sm:text-6xl lg:text-[76px]">Less planning.<br />More <em className="font-normal text-primary">getting lost.</em></h1>
        <p className="mt-6 max-w-md text-base text-muted-foreground md:text-lg">The good kind, of course. Turn your next “what if” into a personal itinerary, with places to stay and days worth remembering.</p>
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <Button asChild size="lg" className="h-12 rounded-full px-6"><Link to="/create-trip">Plan my adventure <ArrowUpRight /></Link></Button>
          <a href="#inspiration" className="inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline">Find inspiration <MoveDown size={15} /></a>
        </div>
        <div className="mt-9 flex items-center gap-3 border-t border-border pt-5 text-sm text-muted-foreground"><Compass size={20} className="text-primary" /> Your destination. Your budget. Your kind of trip.</div>
      </div>
      <div className="relative pb-6 pl-3 md:pl-0">
        <div className="relative overflow-hidden rounded-t-[160px] rounded-b-2xl bg-primary sm:rounded-t-[220px]">
          <TravelImage src={photo('photo-1516483638261-f4dbaf036963', 1200)} alt="Colorful coastal homes overlooking the Mediterranean in Cinque Terre, Italy" loading="eager" className="h-[390px] w-full object-cover sm:h-[500px] lg:h-[580px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-20 left-7 text-white"><p className="text-[10px] uppercase tracking-[0.25em]">Somewhere you could be</p><p className="mt-1 flex items-center gap-2 text-lg"><MapPin size={17} /> Cinque Terre, Italy</p></div>
        </div>
        <div className="absolute -left-2 bottom-0 flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 shadow-warm-lg md:-left-6"><div className="rounded-full bg-secondary p-3"><Route size={21} /></div><div><p className="text-sm font-semibold">A trip that feels like you.</p><p className="text-xs text-muted-foreground">A little structure. Room to wander.</p></div></div>
      </div>
    </section>
    <section className="border-y border-border bg-secondary/50">
      <div className="mx-auto grid max-w-7xl gap-7 px-5 py-8 sm:grid-cols-3 md:px-8">
        {[ [Compass, 'Start with a place', 'A city you love. A place you’ve never been.'], [Route, 'Make it your own', 'Set your pace, budget, and travel crew.'], [Bookmark, 'Keep the possibilities', 'Sign in to keep your trips in one place.'] ].map(([Icon, title, description], i) => <div key={title} className="flex items-start gap-4">{createElement(Icon, { className: 'mt-1 shrink-0 text-primary', size: 23 })}<div><p className="text-sm font-semibold"><span className="mr-2 text-muted-foreground">0{i + 1}</span>{title}</p><p className="mt-1 text-sm text-muted-foreground">{description}</p></div></div>)}
      </div>
    </section>
    <section id="inspiration" className="mx-auto max-w-7xl scroll-mt-28 px-5 py-14 md:px-8 md:py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><span className="travel-kicker">The world is calling</span><h2 className="section-heading mt-3">Where will curiosity take you?</h2></div><p className="max-w-xs text-sm text-muted-foreground">A few ideas for your next chapter.<br />Choose a place, then make it yours.</p></div>
      <div className="grid gap-6 sm:grid-cols-3">{destinations.map(destination => <Link key={destination.name} to={`/create-trip?destination=${encodeURIComponent(destination.name + ', ' + destination.country)}`} className="destination-card group"><div className="relative aspect-[4/3] overflow-hidden rounded-2xl"><TravelImage src={photo(destination.image)} alt={`${destination.name}, ${destination.country}`} className="h-full w-full object-cover" /><span className="absolute left-4 top-4 rounded-full bg-card px-3 py-1 text-xs font-medium">{destination.country}</span></div><div className="mt-4 flex items-center justify-between"><h3 className="font-heading text-2xl">{destination.name}</h3><ArrowUpRight size={20} className="text-primary" /></div><p className="mt-1 text-sm text-muted-foreground">{destination.note}</p></Link>)}</div>
      <div className="mt-14 flex flex-col items-start justify-between gap-5 rounded-2xl bg-primary px-7 py-8 text-primary-foreground sm:flex-row sm:items-center md:px-10"><div><h2 className="font-heading text-3xl">Your next chapter starts here.</h2><p className="mt-2 text-sm text-white/80">Bring the daydream. We’ll help with the details.</p></div><Button asChild variant="secondary" className="rounded-full"><Link to="/create-trip">Let’s make a plan <ArrowRight /></Link></Button></div>
    </section>
  </>
}
