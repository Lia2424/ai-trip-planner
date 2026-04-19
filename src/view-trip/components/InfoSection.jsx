import { Button } from '@/components/ui/button'
import React, { useEffect, useState, useCallback } from 'react'
import { MdIosShare } from "react-icons/md"
import { FaWhatsapp, FaTelegramPlane, FaFacebookF, FaEnvelope } from "react-icons/fa"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from 'sonner'
import { GetPlaceDetails } from '@/service/GlobalApi';
import { PHOTO_REF_URL } from '@/service/GlobalApi';

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const shareUrl = `${window.location.origin}/view-trip/${trip?.id}`
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
      toast.error('Failed to copy link')
    }
  }

  const shareLinks = [
    { name: 'Email', icon: <FaEnvelope className="text-gray-600" />, url: `mailto:?subject=Check out my trip&body=${encodeURIComponent(shareUrl)}` },
    { name: 'WhatsApp', icon: <FaWhatsapp className="text-green-500" />, url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}` },
    { name: 'Telegram', icon: <FaTelegramPlane className="text-sky-500" />, url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}` },
    { name: 'Facebook', icon: <FaFacebookF className="text-blue-600" />, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
  ]

  // Fetch destination photo and location details from Google Places API
  const GetPlacePhoto = useCallback(async () => {
    const data={
      textQuery:trip?.tripData?.travel_plan?.location || trip?.userSelection?.location
    }
    await GetPlaceDetails(data).then(resp=>{
      if (resp.data.places[0].photos && resp.data.places[0].photos[3]) {
        const PhotoURL=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[3].name);
        setPhotoUrl(PhotoURL);
      }
      
      // Extract city and country from address components
      const place = resp.data.places[0];
      
      // Try to get from addressComponents first
      if (place.addressComponents) {
        const cityComponent = place.addressComponents.find(
          comp => comp.types.includes('locality') || comp.types.includes('administrative_area_level_1')
        );
        const countryComponent = place.addressComponents.find(
          comp => comp.types.includes('country')
        );
        
        if (cityComponent) {
          setCity(cityComponent.longText || cityComponent.shortText || '');
        }
        if (countryComponent) {
          setCountry(countryComponent.longText || countryComponent.shortText || '');
        }
      }
      
      // Fallback to parsing formatted address
      if (!city && place.formattedAddress) {
        const addressParts = place.formattedAddress.split(',').map(s => s.trim());
        if (addressParts.length >= 2) {
          setCity(addressParts[0]);
          setCountry(addressParts[addressParts.length - 1]);
        }
      }
    }).catch(() => {
      // If API call fails, try to parse from stored location
      const location = trip?.tripData?.travel_plan?.location || trip?.userSelection?.location || '';
      if (location) {
        const parts = location.split(',').map(s => s.trim());
        if (parts.length >= 2) {
          setCity(parts[0]);
          setCountry(parts[parts.length - 1]);
        } else {
          setCity(location);
        }
      }
    })
  }, [trip]);

  useEffect(()=>{
    if (trip) {
      GetPlacePhoto();
    }
  }, [trip, GetPlacePhoto])

  return (
    <div className="travel-card overflow-hidden">
      <div className="relative">
        <img src={photoUrl} className='h-[340px] w-full object-cover'/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#091223]/90 via-[#091223]/25 to-transparent" />
        <div className="absolute left-6 top-6">
          <span className="travel-kicker">Sunset itinerary</span>
        </div>
      </div>
      
      <div className='flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between'>
        <div className='flex flex-col gap-3'>
          {city && country ? (
            <h2 className='font-bold text-2xl md:text-3xl text-foreground'>{city.trim()}, {country.trim()}</h2>
          ) : (
            <h2 className='font-bold text-2xl md:text-3xl text-foreground'>{trip?.tripData?.travel_plan?.location || trip?.userSelection?.location}</h2>
          )}
          <div className='flex gap-3 flex-wrap'>
            <div className='px-3 py-1.5 rounded-full border border-white/10 bg-white/6 text-foreground font-medium text-sm'>
              📅 {trip.userSelection?.noOfDays} day(s)
            </div>
            <div className='px-3 py-1.5 rounded-full border border-white/10 bg-white/6 text-foreground font-medium text-sm'>
              👤 {trip.userSelection?.traveler}
            </div>
            <div className='px-3 py-1.5 rounded-full border border-white/10 bg-white/6 text-foreground font-medium text-sm'>
              💵 {trip.userSelection?.budget}
            </div>
          </div>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <MdIosShare className="h-5 w-5" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            side="bottom"
            align="end"
            className="travel-surface w-[280px] flex flex-col items-center text-sm p-5 border-white/12"
          >
            <h3 className="font-semibold mb-5 text-foreground">Share this trip</h3>

            <div className="grid grid-cols-4 justify-center gap-6 w-full mb-4">
              {shareLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center hover:opacity-80 transition-all group"
                >
                  <div className="p-2.5 bg-muted hover:bg-accent rounded-full text-base transition-colors group-hover:scale-110">
                    {item.icon}
                  </div>
                  <span className="text-xs mt-2.5 text-muted-foreground group-hover:text-foreground transition-colors">{item.name}</span>
                </a>
              ))}
            </div>

            <div className="mt-2 flex w-full items-center gap-2 bg-muted rounded-lg px-3 py-2 border border-border">
              <span className="truncate text-xs text-muted-foreground flex-1">{shareUrl}</span>
              <Button
                size="sm"
                className={`text-xs h-7 transition-all duration-200 ${
                  copied ? 'bg-primary text-primary-foreground' : ''
                }`}
                variant={copied ? "default" : "secondary"}
                onClick={handleCopy}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default InfoSection
