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
        <h2 className='section-heading mt-10 mb-5'>Somewhere to unwind</h2>
        {!trip?.tripData?.travel_plan?.hotels?.length && <p className='travel-card p-6 text-muted-foreground'>No hotel suggestions were included in this itinerary.</p>}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {trip?.tripData?.travel_plan?.hotels?.map((hotel)=>(
                <HotelCardItem key={hotel.name} hotel={hotel} city={city}/>
            ))}
        </div>
    </div>
  )
}

export default HotelSection