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
    <Link to={'https://www.google.com/maps/search/?api=1&query='+ encodeURIComponent(mapsQuery)} target='_blank' className='text-black'>
    <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all cursor-pointer hover:shadow text-black'>
    <img src={photoUrl?photoUrl:'/placeholder.jpg'} className='w-[130px] h-[130px] object-cover rounded-xl' />
        <div className='flex gap-5'>
            <h2 className='font-bold text-gray-200'>{place.place_name}</h2>
            <p className='text-sm text-gray-300'>{place.details}</p>
            <Button size="sm"><FaMapLocationDot />
            Navigate</Button>
        </div>
    </div>
    </Link>
  )
}

export default PlaceCardItem