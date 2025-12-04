import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { PHOTO_REF_URL, GetPlaceDetails } from '@/service/GlobalApi';

function PlaceCardItem({place}) {
  const [photoUrl, setPhotoUrl] = useState();
      
        useEffect(()=>{
          place&&GetPlacePhoto();
        }, [place])
      
        // Fetch place photo from Google Places API
        const GetPlacePhoto=async()=>{
          const data={
            textQuery:place.place_name
          }
            await GetPlaceDetails(data).then(resp=>{      
            const PhotoURL=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[3].name);
            setPhotoUrl(PhotoURL);
          })
        }
  return (
    <Link to={'https://www.google.com/maps/search/?api=1&query='+ place.place_name} target='_blank' className='text-black'>
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