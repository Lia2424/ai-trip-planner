// Google Places Autocomplete Service
let autocompleteService = null;
let placesService = null;

// Initialize Google Maps services
export const initGooglePlaces = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteService = new window.google.maps.places.AutocompleteService();
      placesService = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );
      resolve();
      return;
    }

    // Load Google Maps script if not already loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          clearInterval(checkInterval);
          autocompleteService = new window.google.maps.places.AutocompleteService();
          placesService = new window.google.maps.places.PlacesService(
            document.createElement('div')
          );
          resolve();
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCYaHLAYlJ8lO2uaVzwqrfLEfp3GI91neE';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      autocompleteService = new window.google.maps.places.AutocompleteService();
      placesService = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Get place predictions
export const getPlacePredictions = async (input) => {
  if (!autocompleteService) {
    await initGooglePlaces();
  }

  return new Promise((resolve, reject) => {
    autocompleteService.getPlacePredictions(
      {
        input,
        types: ['(cities)'], // Focus on cities
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          resolve(predictions);
        } else {
          resolve([]);
        }
      }
    );
  });
};

// Get place details
export const getPlaceDetails = async (placeId) => {
  if (!placesService) {
    await initGooglePlaces();
  }

  return new Promise((resolve, reject) => {
    placesService.getDetails(
      {
        placeId,
        fields: ['formatted_address', 'name', 'geometry', 'place_id'],
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          resolve({
            formatted: place.formatted_address || place.name,
            name: place.name,
            placeId: place.place_id,
            geometry: place.geometry,
          });
        } else {
          reject(new Error('Place details not found'));
        }
      }
    );
  });
};

