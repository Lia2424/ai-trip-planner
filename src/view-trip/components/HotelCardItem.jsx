import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { PHOTO_REF_URL, GetPlaceDetails } from '@/service/GlobalApi';
import { formatPrice } from '@/utils/priceFormatter';

function HotelCardItem({ hotel, city }) {
      const [photoUrl, setPhotoUrl] = useState();
      const [googleRating, setGoogleRating] = useState(null);
    
      // Fetch hotel photo and rating using city-specific text search (same approach as activity places)
      const GetPlacePhoto = useCallback(async () => {
        try {
          // Make search more specific by including city name, similar to activity places
          let searchQuery = '';
          if (hotel?.name && city) {
            // Prioritize: hotel name + city for better accuracy (same as PlaceCardItem)
            searchQuery = `${hotel.name}, ${city}`;
          } else if (hotel?.name && hotel?.address) {
            // Fallback to hotel name + address
            searchQuery = `${hotel.name}, ${hotel.address}`;
          } else {
            searchQuery = hotel?.name || hotel?.address || '';
          }
          
          if (!searchQuery) {
            console.log('No search query available for hotel:', hotel?.name);
            return;
          }
          
          const data = {
            textQuery: searchQuery
          };
          
          // Add location bias if geo coordinates are available (same as PlaceCardItem)
          if (hotel?.geo_coordinates?.latitude && hotel?.geo_coordinates?.longitude) {
            data.locationBias = {
              circle: {
                center: {
                  latitude: hotel.geo_coordinates.latitude,
                  longitude: hotel.geo_coordinates.longitude
                },
                radius: 5000.0 // 5km radius for city-specific results (same as activity places)
              }
            };
          }
          
          let placeFound = null;
          try {
            const result = await GetPlaceDetails(data);
            
            if (result?.data?.places?.length > 0) {
              placeFound = result.data.places[0];
            }
          } catch (textError) {
            console.error('Text search failed for hotel:', hotel?.name, textError);
          }
          
          // If we found a place, extract photo and rating
          if (placeFound) {
            // Set photo if available
            if (placeFound.photos && placeFound.photos.length > 0) {
              const photoName = placeFound.photos[0].name;
              // Photo name should already be in format "places/ChIJ..." or just the ID
              // The API expects the full path including "places/"
              const cleanPhotoName = photoName.startsWith('places/') ? photoName : `places/${photoName}`;
              const PhotoURL = PHOTO_REF_URL.replace('{NAME}', cleanPhotoName);
              setPhotoUrl(PhotoURL);
              console.log('Set photo for hotel:', hotel?.name, 'Photo name:', photoName);
            } else {
              console.log('No photos found for hotel:', hotel?.name, 'Place:', placeFound.displayName?.text, 'Available fields:', Object.keys(placeFound));
            }
            
            // Set rating if available
            if (placeFound.rating !== undefined && placeFound.rating !== null) {
              setGoogleRating(placeFound.rating);
              console.log('Set rating for hotel:', hotel?.name, 'Rating:', placeFound.rating);
            } else {
              console.log('No rating found for hotel:', hotel?.name, 'Place data:', placeFound);
            }
          } else {
            console.log('Could not find place for hotel:', hotel?.name, 'Address:', hotel?.address, 'Coords:', hotel?.geo_coordinates);
          }
        } catch (error) {
          console.error('Error fetching hotel photo and rating:', error);
        }
      }, [hotel, city]);
    
      useEffect(()=>{
        if (hotel) {
          GetPlacePhoto();
        }
      }, [hotel, GetPlacePhoto])

  return (
    <Link to={'https://www.google.com/maps/search/?api=1&query='+ hotel.name + "," + hotel?.address} target='_blank' className='text-foreground'>
                <div className='hover:scale-105 transition-all cursor-pointer'>
                    <img src={photoUrl?photoUrl:'/placeholder.jpg'} className="rounded-xl h-[200px] w-full object-cover"/>                    
                    <div className='my-2 flex flex-col gap-2'>
                        <h2 className='font-medium text-foreground'>{hotel?.name}</h2>
                        <h2 className='text-xs text-muted-foreground'>📍 {hotel?.address}</h2>
                        <div className='flex items-center gap-4 mt-1'>
                            <h2 className='text-sm font-semibold text-foreground'>💵 {formatPrice(hotel?.price_per_night)} per night</h2>
                            <h2 className='text-sm font-semibold text-foreground'>
                                ⭐ {googleRating !== null ? googleRating.toFixed(1) : hotel?.rating || 'N/A'} {googleRating !== null ? '(Google)' : 'stars'}
                            </h2>
                        </div>
                    </div>
                </div>
            </Link>
  )
}

export default HotelCardItem