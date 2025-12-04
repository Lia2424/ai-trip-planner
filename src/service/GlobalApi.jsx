import axios from 'axios'

const BASE_URL = 'https://places.googleapis.com/v1/places:searchText'
const NEARBY_URL = 'https://places.googleapis.com/v1/places:searchNearby'

// API configuration with required headers and field masks
const config={
    headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_API_KEY,
        'X-Goog-FieldMask':[
            'places.photos',
            'places.displayName',
            'places.id',
            'places.formattedAddress'
        ]
    }
}

// Search for places by text query
export const GetPlaceDetails=(data)=>axios.post(BASE_URL,data,config)

// Search for nearby places using coordinates
export const GetNearbyPlaces=(data)=>axios.post(NEARBY_URL,data,config)

// Generate photo URL from place photo reference
export const PHOTO_REF_URL='https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=800&maxWidthPx=800&key=' + import.meta.env.VITE_GOOGLE_API_KEY;
