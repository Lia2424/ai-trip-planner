import React from 'react'
import { Link } from 'react-router-dom'
import HotelCardItem from './HotelCardItem';

function HotelSection({trip}) {
  // Extract city name from trip data (same logic as PlacesToVisit)
  const city = trip?.tripData?.travel_plan?.location?.split(',')[0]?.trim() || 
               trip?.userSelection?.city || 
               trip?.tripData?.travel_plan?.location;
      
  return (
    <div>
        <h2 className='font-bold text-xl mt-5 mb-5'>Hotel Recommendation</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'>
            {trip?.tripData?.travel_plan?.hotels?.map((hotel)=>(
                <HotelCardItem key={hotel.name} hotel={hotel} city={city}/>
            ))}
        </div>
    </div>
  )
}

export default HotelSection