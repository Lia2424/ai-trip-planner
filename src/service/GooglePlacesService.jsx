// Google Places API (New) Service - Uses REST endpoints, no Google Maps JS API required
// Get place predictions using newer Places API (New) REST endpoint
export const getPlacePredictions = async (input) => {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('VITE_GOOGLE_API_KEY is not set');
    return [];
  }

  try {
    const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
      },
      body: JSON.stringify({
        input: input,
        includedRegionCodes: [],
        includedPrimaryTypes: ['locality', 'administrative_area_level_1'],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      // Convert to format expected by component
      if (data.suggestions) {
        // Filter out countries and only return cities/locales
        const filteredSuggestions = data.suggestions.filter((suggestion) => {
          const types = suggestion.placePrediction.placePredictionTypes || [];
          // Exclude country types
          return !types.includes('country') && !types.includes('political');
        });
        
        return filteredSuggestions.map((suggestion) => ({
          place_id: suggestion.placePrediction.placeId,
          description: suggestion.placePrediction.text.text,
          structured_formatting: {
            main_text: suggestion.placePrediction.text.text,
            secondary_text: suggestion.placePrediction.text.matches?.[0]?.text || '',
          },
        }));
      }
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('Places API autocomplete error:', response.status, errorData);
      return [];
    }
  } catch (error) {
    console.error('Places API (New) autocomplete failed:', error);
    return [];
  }
};

// Get place details using newer Places API (New) REST endpoint
export const getPlaceDetails = async (placeId) => {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GOOGLE_API_KEY is not set');
  }

  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'formattedAddress,name,geometry,id',
      },
    });

    if (response.ok) {
      const place = await response.json();
      return {
        formatted: place.formattedAddress || place.name?.text || 'Unknown',
        name: place.name?.text || 'Unknown',
        placeId: place.id || placeId,
        geometry: place.geometry,
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Place details not found: ${response.status} ${JSON.stringify(errorData)}`);
    }
  } catch (error) {
    console.error('Places API (New) getPlaceDetails failed:', error);
    throw error;
  }
};

