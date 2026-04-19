import { Button } from '@/components/ui/button'
import React, { useEffect, useState, useCallback } from 'react'
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { PHOTO_REF_URL, GetPlaceDetails } from '@/service/GlobalApi';

function PlaceCardItem({place, city}) {
  const [photoUrl, setPhotoUrl] = useState();
      
        // Fetch place photo from Google Places API with city-specific search
        const GetPlacePhoto = useCallback(async () => {
          // Make search more specific by including city name
          const searchQuery = city 
            ? `${place.place_name}, ${city}`
            : place.place_name;
          
          const data={
            textQuery: searchQuery
          }
          
          // Add location bias if geo coordinates are available
          if (place.geo_coordinates?.latitude && place.geo_coordinates?.longitude) {
            data.locationBias = {
              circle: {
                center: {
                  latitude: place.geo_coordinates.latitude,
                  longitude: place.geo_coordinates.longitude
                },
                radius: 5000.0 // 5km radius for city-specific results
              }
            };
          }
          
          await GetPlaceDetails(data).then(resp=>{      
            if (resp.data.places[0].photos && resp.data.places[0].photos[0]) {
              const PhotoURL=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[0].name);
              setPhotoUrl(PhotoURL);
            }
          }).catch(error => {
            console.error('Error fetching place photo:', error);
          })
        }, [place, city]);
      
        useEffect(()=>{
          place&&GetPlacePhoto();
        }, [place, city, GetPlacePhoto])
  // Build Google Maps search query with city for better results
  const mapsQuery = city 
    ? `${place.place_name}, ${city}`
    : place.place_name;

  return (
    <Link to={'https://www.google.com/maps/search/?api=1&query='+ encodeURIComponent(mapsQuery)} target='_blank' className='block text-foreground'>
    <div className='mt-2 flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/[0.04] p-3 transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-warm md:flex-row md:items-center'>
    <img src={photoUrl?photoUrl:'/placeholder.jpg'} className='h-[170px] w-full object-cover rounded-[20px] md:h-[130px] md:w-[130px]' />
        <div className='flex flex-1 flex-col gap-3'>
            <div>
              <h2 className='font-bold text-foreground'>{place.place_name}</h2>
              <p className='mt-2 text-sm text-white/65'>{place.details}</p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs uppercase tracking-[0.22em] text-white/40">Open in maps</span>
              <Button size="sm" className="shrink-0">
                <FaMapLocationDot />
                Navigate
              </Button>
            </div>
        </div>
    </div>
    </Link>
  )
}

export default PlaceCardItem