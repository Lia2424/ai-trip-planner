import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
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

  useEffect(()=>{
    if (trip) {
      GetPlacePhoto();
    }
  }, [trip])

  // Fetch destination photo from Google Places API
  const GetPlacePhoto=async()=>{
    const data={
      textQuery:trip?.tripData?.travel_plan?.location
    }
    await GetPlaceDetails(data).then(resp=>{
      const PhotoURL=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[3].name);
      setPhotoUrl(PhotoURL);
    })
  }

  return (
    <div>
      <img src={photoUrl} className='h-[340px] w-full object-cover rounded-xl'/>
      
      <div className='flex justify-between items-center'>
        <div className='my-5 flex flex-col gap-3'>
          <h2 className='font-bold text-2xl text-foreground'>{trip?.tripData?.travel_plan?.location}</h2>
          <div className='flex gap-3 flex-wrap'>
            <div className='px-3 py-1.5 bg-muted border border-border rounded-full text-foreground font-medium text-sm'>
              📅 {trip.userSelection?.noOfDays} day(s)
            </div>
            <div className='px-3 py-1.5 bg-muted border border-border rounded-full text-foreground font-medium text-sm'>
              👤 {trip.userSelection?.traveler}
            </div>
            <div className='px-3 py-1.5 bg-muted border border-border rounded-full text-foreground font-medium text-sm'>
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
            className="w-[280px] flex flex-col items-center text-sm p-5"
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
