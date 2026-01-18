import React from 'react'
import PlaceCardItem from './PlaceCardItem'

function PlacesToVisit({trip}) {
  // Extract city name from trip data
  const city = trip?.tripData?.travel_plan?.location?.split(',')[0] || 
               trip?.userSelection?.city || 
               trip?.tripData?.travel_plan?.location;

  // Helper function to parse time from best_time_to_visit string
  const parseTime = (timeString) => {
    if (!timeString) return { hour: 0, minute: 0 };
    
    const lowerTime = timeString.toLowerCase();
    
    // Check for specific times
    const specificTime = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (specificTime) {
      let hour = parseInt(specificTime[1]);
      const minute = parseInt(specificTime[2]);
      const period = specificTime[3].toUpperCase();
      
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      return { hour, minute };
    }
    
    // Check for hour only
    const hourOnly = timeString.match(/(\d{1,2})\s*(AM|PM)/i);
    if (hourOnly) {
      let hour = parseInt(hourOnly[1]);
      const period = hourOnly[2].toUpperCase();
      
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      return { hour, minute: 0 };
    }
    
    // Use time of day keywords
    if (lowerTime.includes('morning')) return { hour: 9, minute: 0 };
    if (lowerTime.includes('afternoon')) return { hour: 14, minute: 0 };
    if (lowerTime.includes('evening')) return { hour: 18, minute: 0 };
    if (lowerTime.includes('night')) return { hour: 21, minute: 0 };
    
    return { hour: 12, minute: 0 }; // Default to noon
  };

  // Sort places by time
  const sortPlacesByTime = (places) => {
    return [...places].sort((a, b) => {
      const timeA = parseTime(a.best_time_to_visit);
      const timeB = parseTime(b.best_time_to_visit);
      
      const minutesA = timeA.hour * 60 + timeA.minute;
      const minutesB = timeB.hour * 60 + timeB.minute;
      
      return minutesA - minutesB;
    });
  };

  return (
    <div>
        <h2 className='font-bold text-xl mt-10'>Places to Visit</h2>

        <div className='mt-4 space-y-6'>
            {trip?.tripData?.travel_plan?.itinerary?.map((item, dayIdx) => {
              // Sort places chronologically by best_time_to_visit
              const sortedPlaces = item.plan ? sortPlacesByTime(item.plan) : [];
              
              return (
                <section
                  key={`day-${item?.day ?? dayIdx}`}
                  className='bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm'
                >
                    <h3 className='font-bold text-xl mb-3'>Day {item.day}</h3>
                    <div className='space-y-4'>
                      {sortedPlaces.map((place, placeIdx) => (
                        <div key={`day-${item?.day ?? dayIdx}-place-${placeIdx}`}> 
                            <h4 className='font-medium text-sm text-muted-foreground'>
                              {place.best_time_to_visit}
                            </h4>
                            <PlaceCardItem place={place} city={city}/>
                        </div>
                      ))}
                    </div>
                </section>
              );
            })}
        </div>
    </div>
  )
}

export default PlacesToVisit