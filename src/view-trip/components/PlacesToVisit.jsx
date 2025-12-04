import React from 'react'
import PlaceCardItem from './PlaceCardItem'

function PlacesToVisit({trip}) {
  return (
    <div>
        <h2 className='font-bold text-xl mt-10'>Places to Visit</h2>

        <div className='mt-4 space-y-6'>
            {trip?.tripData?.travel_plan?.itinerary?.map((item, dayIdx) => (
                <section
                  key={`day-${item?.day ?? dayIdx}`}
                  className='bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm'
                >
                    <h3 className='font-bold text-xl mb-3'>Day {item.day}</h3>
                    <div className='space-y-4'>
                      {item.plan?.map((place, placeIdx) => (
                        <div key={`day-${item?.day ?? dayIdx}-place-${placeIdx}`}> 
                            <h4 className='font-medium text-sm text-muted-foreground'>
                              {place.best_time_to_visit}
                            </h4>
                            <PlaceCardItem place={place}/>
                        </div>
                      ))}
                    </div>
                </section>
            ))}
        </div>
    </div>
  )
}

export default PlacesToVisit