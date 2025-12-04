import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';

function UserTripCardItem({trip}) {
    const [photoUrl, setPhotoUrl] = useState();
  
    useEffect(()=>{
      trip&&GetPlacePhoto();
    }, [trip])
  
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
    <Link to={'/view-trip/' + trip?.id}>
    <div className='hover:scale-105 transition-all cursor-pointer'>
    <div className='aspect-square w-full overflow-hidden rounded-xl'>
      <img
        src={photoUrl?photoUrl:'/placeholder.jpg'}
        className='w-full h-full object-cover'
        alt={trip?.tripData?.travel_plan?.location}
      />
    </div>
        <div className='mt-3'>
            <h2 className='font-bold text-lg text-foreground'>{trip?.tripData?.travel_plan?.location}</h2>
            <h2 className='text-sm text-muted-foreground'>{trip?.userSelection?.noOfDays} day trip</h2>
        </div>
    </div>
    </Link>
  )
}

export default UserTripCardItem