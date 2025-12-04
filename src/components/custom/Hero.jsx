import React from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, LogIn } from 'lucide-react'

function Hero() {
  const navigate = useNavigate();
  
  // Navigate to create trip page with sign-in prompt
  const handleSignInClick = () => {
    navigate('/create-trip?signin=true');
  };

  return (
    <section className="relative overflow-hidden h-full flex items-center justify-center py-8 md:py-10">
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-t from-[#c084fc]/30 via-[#f472b6]/20 to-transparent blur-3xl rounded-t-full w-[80%] h-96 opacity-70" />
      <div className="container mx-auto px-4 lg:px-6 relative z-10 w-full">
        <div className="flex flex-col items-center text-center space-y-5 md:space-y-6">
          <Badge
            variant="outline"
            className="px-4 py-1.5 bg-gradient-to-r from-[#c084fc]/20 via-[#f472b6]/15 to-[#fb923c]/10 border-[#c084fc]/40 hover:from-[#c084fc]/30 hover:via-[#f472b6]/25 hover:to-[#fb923c]/20 hover:border-[#c084fc]/60 transition-all duration-500 shadow-warm hover:shadow-warm-lg rounded-full"
          >
            AI that doesn't get jet lag
          </Badge>
          
          <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight max-w-4xl text-foreground">
            Plan Your Perfect Trip with AI
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Discover personalized travel experiences tailored just for you!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link to="/create-trip">
              <Button size="lg" variant="outline" className="px-8 group">
                Get Started Without an Account
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            <Button size="lg" className="px-8 group" onClick={handleSignInClick}>
              Sign In to Save Your Trips
              <LogIn className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
          
        </div>
      </div>
    </section>
  )
}

export default Hero
