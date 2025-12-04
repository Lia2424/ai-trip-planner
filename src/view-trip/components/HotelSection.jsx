import React from 'react'
import { Link } from 'react-router-dom'
import HotelCardItem from './HotelCardItem';

function HotelSection({trip}) {
      
  return (
    <div>
        <h2 className='font-bold text-xl mt-5 mb-5'>Hotel Recommendation</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'>
            {trip?.tripData?.travel_plan?.hotels?.map((hotel)=>(
                <HotelCardItem key={hotel.name} hotel={hotel}/>
            ))}
        </div>
    </div>
  )
}

export default HotelSection