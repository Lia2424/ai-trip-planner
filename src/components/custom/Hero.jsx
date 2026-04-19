import React from 'react'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, LogIn, MapPin, Clock3, Camera } from 'lucide-react'

function Hero() {
  const navigate = useNavigate();
  
  // Navigate to create trip page with sign-in prompt
  const handleSignInClick = () => {
    navigate('/create-trip?signin=true');
  };

  return (
    <section className="relative overflow-hidden h-full flex items-center justify-center py-8 md:py-10">
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#ffd37a]/20 via-[#ff8f6b]/10 to-transparent" />
      <div className="absolute -top-20 left-[12%] h-56 w-56 rounded-full bg-[#ffd37a]/20 blur-3xl" />
      <div className="absolute top-[18%] right-[12%] h-64 w-64 rounded-full bg-[#b88cff]/18 blur-3xl" />
      <div className="absolute bottom-[-10%] left-1/2 h-72 w-[78%] -translate-x-1/2 rounded-full bg-gradient-to-t from-[#ff8f6b]/28 via-[#b88cff]/18 to-transparent blur-3xl" />
      <div className="container mx-auto px-4 lg:px-6 relative z-10 w-full">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center space-y-6 md:space-y-7">
          <div className="travel-card travel-grid relative w-full max-w-5xl overflow-hidden px-6 py-10 md:px-12 md:py-14">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <div className="flex flex-col items-center gap-6">
              <span className="travel-kicker">For slow, beautiful escapes</span>
              <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight max-w-4xl text-balance text-foreground">
                Travel plans with a
                <span className="sunset-text"> sunset state-of-mind </span>
                and room to wander.
              </h1>
              
              <p className="text-lg md:text-xl text-white/72 max-w-2xl leading-relaxed text-balance">
                From city breaks to longer getaways, TripKitAI helps shape thoughtful itineraries that feel calm, curated, and easy to explore.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link to="/create-trip">
                  <Button size="lg" className="px-8 group">
                    Start Planning
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="px-8 group border-white/15 bg-white/6 text-white hover:bg-white/10" onClick={handleSignInClick}>
                  Sign In to Save Your Trips
                  <LogIn className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>

              <div className="grid w-full gap-3 pt-4 text-left md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <MapPin className="mb-3 h-4 w-4 text-[#ffd37a]" />
                  <p className="text-sm font-semibold text-foreground">Beautiful destinations</p>
                  <p className="mt-1 text-sm text-white/65">Browse trips centered around places you actually want to linger in.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <Clock3 className="mb-3 h-4 w-4 text-[#ff8f6b]" />
                  <p className="text-sm font-semibold text-foreground">Easy pacing</p>
                  <p className="mt-1 text-sm text-white/65">Each plan flows naturally, with enough structure to guide the day.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <Camera className="mb-3 h-4 w-4 text-[#b88cff]" />
                  <p className="text-sm font-semibold text-foreground">Moments worth sharing</p>
                  <p className="mt-1 text-sm text-white/65">Save and share polished trip pages with friends, partners, or travel groups.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
