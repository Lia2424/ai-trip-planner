import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Initialize Gemini model with JSON response format
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});

// AI generation configuration for consistent JSON responses
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

// Export chat session for trip generation
export const chatSession = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                {text: "Generate travel plan for Location: Paris, for 3 days for couple with cheap budget, give me hotels options list with hotel name, hotel address, price in USD (US dollars), hotel image url, geo coordinates, rating out of 5 stars, descriptions, and suggest an itenerary with one place name at a time, place details, place image url, geo coordinates, ticket pricing in USD (US dollars), rating, with each day's plan having the best time to visit the locations in JSON format. All prices must be in USD format like $50-$70 or $100 per person."},
            ],
        },
        {
            role: "model",
            parts: [
                {text:
                    "```json\n" +
                    JSON.stringify(
                      {
                        travel_plan: {
                          location: "Paris",
                          days: 3,
                          travelers: "couple",
                          budget: "cheap",
                          hotels: [
                            {
                              name: "Hôtel Richard",
                              address: "39 Rue Richard Lenoir, 75011 Paris, France",
                              price_per_night: "$70-$90",
                              image_url: "https://example.com/hotel_richard.jpg",
                              geo_coordinates: { latitude: 48.8579, longitude: 2.3837 },
                              rating: 7.5,
                              description:
                                "A simple and clean hotel located in the vibrant 11th arrondissement, close to public transport and local eateries. Offers basic amenities perfect for budget-conscious travelers.",
                            },
                            {
                              name: "HotelF1 Paris Porte de Châtillon",
                              address: "26 Rue de Châtillon, 75014 Paris, France",
                              price_per_night: "$50-$70",
                              image_url: "https://example.com/hotelf1_chatillon.jpg",
                              geo_coordinates: { latitude: 48.8252, longitude: 2.3278 },
                              rating: 6.8,
                              description:
                                "A no-frills hotel offering compact rooms with shared bathrooms, ideal for those looking for the absolute cheapest option. Good access to public transport to reach the city center.",
                            },
                            {
                              name: "Generator Paris",
                              address: "9 Place du Colonel Fabien, 75010 Paris, France",
                              price_per_night: "$60-$80 (private room)",
                              image_url: "https://example.com/generator_paris.jpg",
                              geo_coordinates: { latitude: 48.8785, longitude: 2.3653 },
                              rating: 8.2,
                              description:
                                "A stylish hostel offering private rooms as well as dorms. Known for its lively atmosphere, rooftop bar, and convenient location near Canal Saint-Martin. A great option for a young couple on a budget.",
                            },
                          ],
                          itinerary: [
                            {
                              day: 1,
                              theme: "Iconic Landmarks & Romantic Stroll",
                              plan: [
                                {
                                  place_name: "Eiffel Tower",
                                  details:
                                    "Start your Parisian adventure with the most iconic landmark. Admire it from Trocadéro, then take a leisurely stroll around the Champ de Mars. Consider a picnic here if weather permits.",
                                  image_url: "https://example.com/eiffel_tower.jpg",
                                  geo_coordinates: { latitude: 48.8584, longitude: 2.2945 },
                                  ticket_pricing:
                                    "Free to view from outside; approx. $12-$30 for summit access (book in advance!)",
                                  rating: 9.5,
                                  best_time_to_visit:
                                    "Morning (9:00 AM – 11:00 AM) to avoid crowds, or evening for sunset/sparkling lights (hourly after dark)",
                                },
                                {
                                  place_name: "Arc de Triomphe",
                                  details:
                                    "Walk or take a short metro ride to this majestic arch. Enjoy the view of the Champs-Élysées and the 'axe historique'. Climb to the top for panoramic city views.",
                                  image_url: "https://example.com/arc_de_triomphe.jpg",
                                  geo_coordinates: { latitude: 48.8738, longitude: 2.295 },
                                  ticket_pricing:
                                    "Free to view from outside; approx. $15 to climb to the top",
                                  rating: 9.0,
                                  best_time_to_visit:
                                    "Late morning (11:00 AM – 1:00 PM) or late afternoon (4:00 PM – 6:00 PM)",
                                },
                              ],
                            },
                            {
                              day: 2,
                              theme: "Art, Culture & Bohemian Charm",
                              plan: [
                                {
                                  place_name: "Louvre Museum",
                                  details:
                                    "Dedicate your morning to one of the world's largest art museums. Focus on key masterpieces like the Mona Lisa and Venus de Milo to manage your time. Book tickets online!",
                                  image_url: "https://example.com/louvre_museum.jpg",
                                  geo_coordinates: { latitude: 48.8606, longitude: 2.3376 },
                                  ticket_pricing:
                                    "Approx. $20-$25 (online booking recommended)",
                                  rating: 9.7,
                                  best_time_to_visit:
                                    "Early morning (9:00 AM – 10:00 AM) or Wednesday/Friday evenings (until 9:45 PM) for fewer crowds",
                                },
                              ],
                            },
                          ],
                        },
                      },
                      null,
                      2
                    ) +
                    "\n```",
                },
            ],
        },
    ],
});



 