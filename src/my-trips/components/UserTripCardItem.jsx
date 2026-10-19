import TravelImage from '@/components/custom/TravelImage'
import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';

function UserTripCardItem({trip}) {
    const [photoUrl, setPhotoUrl] = useState();
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
  
    const GetPlacePhoto = useCallback(async () => {
      const data={
        textQuery:trip?.tripData?.travel_plan?.location
      }
      await GetPlaceDetails(data).then(resp=>{    
        const place = resp.data.places[0];
        
        if (place.photos && place.photos[3]) {
          const PhotoURL=PHOTO_REF_URL.replace('{NAME}',place.photos[3].name);
          setPhotoUrl(PhotoURL);
        }
        
        // Extract city and country from address components
        if (place.addressComponents) {
          const cityComponent = place.addressComponents.find(
            comp => comp.types.includes('locality') || comp.types.includes('administrative_area_level_1')
          );
          const countryComponent = place.addressComponents.find(
            comp => comp.types.includes('country')
          );
          
          if (cityComponent) {
            setCity(cityComponent.longText || cityComponent.shortText || '');
          }
          if (countryComponent) {
            setCountry(countryComponent.longText || countryComponent.shortText || '');
          }
        }
        
        // Fallback to parsing formatted address
        if (!city && place.formattedAddress) {
          const addressParts = place.formattedAddress.split(',').map(s => s.trim());
          if (addressParts.length >= 2) {
            setCity(addressParts[0]);
            setCountry(addressParts[addressParts.length - 1]);
          }
        }
      }).catch(() => {
        // If API call fails, try to parse from stored location
        const location = trip?.tripData?.travel_plan?.location || '';
        if (location) {
          const parts = location.split(',').map(s => s.trim());
          if (parts.length >= 2) {
            setCity(parts[0]);
            setCountry(parts[parts.length - 1]);
          } else {
            setCity(location);
          }
        }
      })
    }, [trip]);
  
    useEffect(()=>{
      trip&&GetPlacePhoto();
    }, [trip, GetPlacePhoto])

  return (
    <Link to={'/view-trip/' + trip?.id}>
    <div className='travel-card overflow-hidden transition-all cursor-pointer hover:-translate-y-1 hover:border-border hover:shadow-warm-lg'>
    <div className='aspect-[4/3] w-full overflow-hidden'>
      <TravelImage
        src={photoUrl?photoUrl:'/placeholder.jpg'}
        className='w-full h-full object-cover'
        alt={trip?.tripData?.travel_plan?.location}
      />
    </div>
        <div className='p-4'>
            <h2 className='font-bold text-lg text-foreground'>
              {city && country ? `${city.trim()}, ${country.trim()}` : trip?.tripData?.travel_plan?.location}
            </h2>
            <h2 className='mt-2 text-sm text-muted-foreground'>{trip?.userSelection?.noOfDays} day trip</h2>
        </div>
    </div>
    </Link>
  )
}

export default UserTripCardItem