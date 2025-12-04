import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PHOTO_REF_URL, GetPlaceDetails, GetNearbyPlaces } from '@/service/GlobalApi';

function HotelCardItem({ hotel }) {
      const [photoUrl, setPhotoUrl] = useState();
    
      useEffect(()=>{
        if (hotel) {
          GetPlacePhoto();
        }
      }, [hotel])
    
      // Fetch hotel photo using nearby search or text search
      const GetPlacePhoto=async()=>{
        try {
          // If we have coordinates, use nearby search for more accurate results
          if (hotel?.geo_coordinates?.latitude && hotel?.geo_coordinates?.longitude) {
            const nearbyData = {
              includedTypes: ['lodging'],
              maxResultCount: 10,
              locationRestriction: {
                circle: {
                  center: {
                    latitude: hotel.geo_coordinates.latitude,
                    longitude: hotel.geo_coordinates.longitude
                  },
                  radius: 50.0 
                }
              }
            };
            
            try {
              const nearbyResult = await GetNearbyPlaces(nearbyData);
              
              if (nearbyResult?.data?.places?.length > 0) {
                // Find the best match by comparing names
                const hotelNameLower = hotel.name?.toLowerCase() || '';
                const bestMatch = nearbyResult.data.places.find(place => {
                  const placeName = place.displayName?.text?.toLowerCase() || '';
                  return placeName.includes(hotelNameLower.split(' ')[0]) || 
                         hotelNameLower.includes(placeName.split(' ')[0]);
                }) || nearbyResult.data.places[0];
                
                if (bestMatch.photos && bestMatch.photos.length > 0) {
                  const PhotoURL = PHOTO_REF_URL.replace('{NAME}', bestMatch.photos[0].name);
                  setPhotoUrl(PhotoURL);
                  return;
                }
              }
            } catch (nearbyError) {
              console.log('Nearby search failed, falling back to text search:', nearbyError);
            }
          }
          
          // Fallback to text search with location bias
          const searchQuery = hotel?.name && hotel?.address 
            ? `${hotel.name}, ${hotel.address}`
            : hotel?.name || hotel?.address || '';
          
          const data = {
            textQuery: searchQuery
          };
          
          // Add location bias if geo coordinates are available
          if (hotel?.geo_coordinates?.latitude && hotel?.geo_coordinates?.longitude) {
            data.locationBias = {
              circle: {
                center: {
                  latitude: hotel.geo_coordinates.latitude,
                  longitude: hotel.geo_coordinates.longitude
                },
                radius: 50.0
              }
            };
          }
          
          const result = await GetPlaceDetails(data);
          
          if (result?.data?.places?.length > 0) {
            const place = result.data.places[0];
            
            if (place.photos && place.photos.length > 0) {
              const PhotoURL = PHOTO_REF_URL.replace('{NAME}', place.photos[0].name);
              setPhotoUrl(PhotoURL);
            }
          }
        } catch (error) {
          console.error('Error fetching hotel photo:', error);
        }
      }

  return (
    <Link to={'https://www.google.com/maps/search/?api=1&query='+ hotel.name + "," + hotel?.address} target='_blank' className='text-black'>
                <div className='hover:scale-105 transition-all cursor-pointer text-black'>
                    <img src={photoUrl?photoUrl:'/placeholder.jpg'} className="rounded-xl h-[200px] w-full object-cover"/>                    
                    <div className='my-2 flex flex-col gap-2'>
                        <h2 className='font-medium text-gray-200'>{hotel?.name}</h2>
                        <h2 className='text-xs text-gray-500 '>📍 {hotel?.address}</h2>
                        <h2 className='text-sm'>💵 {hotel?.price_per_night} per night</h2>
                        <h2 className='text-sm'>⭐ {hotel?.rating} stars </h2>
                    </div>
                </div>
            </Link>
  )
}

export default HotelCardItem