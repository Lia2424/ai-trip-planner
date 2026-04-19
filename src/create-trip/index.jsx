import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AI_PROMPT, SelectBudgetOptions, SelectTravelersList } from '@/constants/options'
import { toast } from 'sonner';
import { chatSession } from '@/service/AIModel';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPlacePredictions, getPlaceDetails } from '@/service/GooglePlacesService';
import { User, Users, UsersRound, DollarSign, Wallet, Sparkles, Zap } from 'lucide-react';

function CreateTrip() {
    const [location, setLocation] = useState();
    const [formData, setFormData] = useState([]);
    const [searchParams] = useSearchParams();
    const [openDialogue, setOpenDialogue] = useState(false);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const debounceRef = useRef(null);
    const suggestionsRef = useRef(null);
    const inputContainerRef = useRef(null);

    // Note: We use the newer Places API (New) REST endpoint, so we don't need to initialize Google Maps JS API
    // The getPlacePredictions function will use the REST API directly

    // Check if user came from sign-in button
    useEffect(() => {
        if (searchParams.get('signin') === 'true') {
            const user = localStorage.getItem('user');
            if (!user) {
                setOpenDialogue(true);
            }
        }
    }, [searchParams]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if click is outside both the input container and suggestions list
            if (
                inputContainerRef.current &&
                !inputContainerRef.current.contains(event.target) &&
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target)
            ) {
                setSuggestions([]);
            }
        };

        if (suggestions.length > 0) {
            // Use a small delay to allow click events to fire first
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [suggestions]);

    // Handle location search with debouncing to reduce API calls
    const handleSearch = (text) => {
        setQuery(text);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        // Debounce API call to avoid excessive requests
        debounceRef.current = setTimeout(async () => {
            if (text.length < 2) {
                setSuggestions([]);
                return;
            }
            try {
                const results = await getPlacePredictions(text);
                setSuggestions(results || []);
            } catch (error) {
                console.error('Error fetching place predictions:', error);
                setSuggestions([]);
            }
        }, 400);
    };

    // Handle location selection from autocomplete suggestions
    const handleSelect = async (prediction) => {
        try {
            const placeDetails = await getPlaceDetails(prediction.place_id);
            const formatted = placeDetails.formatted || prediction.description || "Unknown";
            const city = placeDetails.city || "";
            const country = placeDetails.country || "";
            
            // Format display: "City, Country" or just formatted address
            const displayLocation = city && country ? `${city}, ${country}` : formatted;

            setLocation(displayLocation);
            setQuery(displayLocation);
            setSuggestions([]);

            setFormData((prev) => ({
                ...prev,
                location: formatted,
                city: city,
                country: country,
            }));
        } catch (error) {
            console.error('Error fetching place details:', error);
            const formatted = prediction.description || "Unknown";
            setLocation(formatted);
            setQuery(formatted);
            setSuggestions([]);
            setFormData((prev) => ({
                ...prev,
                location: formatted,                  
            }));
        }
    };

    const navigate = useNavigate();

    // Update form data when user makes selections
    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        })
    }

    useEffect(() => {
        // Form data updated
    }, [formData])

    const login = useGoogleLogin({
        onSuccess: (codeResp) => GetUserProfile(codeResp),
        onError: () => {
            toast.error('Failed to sign in');
        }
    })

    // Generate AI-powered travel plan based on user inputs
    const OnGenerateTrip = async () => {
        if (!formData.location ||!formData?.noOfDays || !formData?.budget || !formData?.traveler) {
            toast("Please fill all details.");
            return;
        }

        if (Number(formData?.noOfDays) <= 0) {
            toast("Trip duration must be at least 1 day.");
            return;
        }

        if (formData?.noOfDays > 50) {
            toast("Trip duration cannot exceed 50 days.");
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading("Generating your trip plan... This may take 30-60 seconds.");
        
        try {
            // Build AI prompt with user preferences
            const FINAL_PROMPT = AI_PROMPT
                .replace('{location}', formData?.location || 'Unknown')
                .replace('{totalDays}', formData?.noOfDays)
                .replace('{traveler}', formData?.traveler)
                .replace('{budget}', formData?.budget)

            // Generate trip plan using Google Gemini AI with timeout
            // Note: AI generation can take 30-60 seconds for complex trips
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout. The AI is taking too long. Please try again.')), 90000)
            );
            
            const aiPromise = chatSession.sendMessage(FINAL_PROMPT);
            const result = await Promise.race([aiPromise, timeoutPromise]);
            
            toast.dismiss(loadingToast);
            toast.success("Trip plan generated successfully!");
            
            console.log('Full AI Result:', result); // Debug log
            
            // Handle different response structures from Gemini API
            let responseText = '';
            if (result?.response?.text) {
                // Standard response structure
                responseText = result.response.text();
            } else if (result?.response) {
                // Try alternative response structure
                const response = result.response;
                if (response.candidates && response.candidates[0]?.content?.parts?.[0]?.text) {
                    responseText = response.candidates[0].content.parts[0].text;
                } else if (response.text) {
                    responseText = typeof response.text === 'function' ? response.text() : response.text;
                }
            } else if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
                // Direct candidates structure
                responseText = result.candidates[0].content.parts[0].text;
            } else if (typeof result === 'string') {
                // String response
                responseText = result;
            }
            
            if (!responseText || responseText.trim().length === 0) {
                console.error('No valid response text found. Result structure:', result);
                throw new Error('No response from AI. Please try again.');
            }
            
            console.log('AI Response Text:', responseText); // Debug log
            
            // Clean the response - remove markdown code blocks if present
            let cleanedResponse = responseText.trim();
            if (cleanedResponse.startsWith('```json')) {
                cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            } else if (cleanedResponse.startsWith('```')) {
                cleanedResponse = cleanedResponse.replace(/```\n?/g, '').trim();
            }
            
            await SaveAiTrip(cleanedResponse);
        } catch (error) {
            toast.dismiss(loadingToast);
            setLoading(false);
            console.error('Error generating trip:', error);
            const errorMessage = error.message || 'Failed to generate trip. Please try again.';
            toast.error(errorMessage);
        }
    }

    const GetUserProfile = (tokenInfo) => {
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.access_token}`,
                Accept: 'Application/json'
            }
        }).then((resp) => {
            localStorage.setItem('user', JSON.stringify(resp.data));
            setOpenDialogue(false);
            OnGenerateTrip();
        }).catch((error) => {
            console.error('Error fetching user profile:', error);
            toast.error('Failed to sign in. Please try again.');
            setOpenDialogue(false);
        })
    }

    // Save generated trip to Firebase Firestore
    const SaveAiTrip = async (TripData) => {
        const saveToast = toast.loading("Saving your trip...");
        
        try {
            // Get user if signed in (optional)
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            const docId = Date.now().toString()

            // Parse JSON response
            let parsedData;
            try {
                parsedData = JSON.parse(TripData);
            } catch (parseError) {
                console.error('Failed to parse AI response:', parseError);
                console.error('Response text:', TripData);
                throw new Error('Invalid response format from AI. Please try again.');
            }

            // Validate the structure
            if (!parsedData.travel_plan) {
                throw new Error('Invalid trip data structure. Please try again.');
            }

            // Add timeout for Firestore save
            const saveTimeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Save timeout. Please try again.')), 10000)
            );
            
            const savePromise = setDoc(doc(db, "AITrips", docId), {
                userSelection: formData,
                tripData: parsedData,
                userEmail: user?.email || null, // Optional - null if not signed in
                id: docId,
                imageCache: {
                    destinationImage: "/placeholder.jpg", 
                },
            });
            
            await Promise.race([savePromise, saveTimeoutPromise]);
            
            toast.dismiss(saveToast);
            setLoading(false);
            toast.success("Trip saved successfully!");
            navigate('/view-trip/' + docId)
        } catch (error) {
            toast.dismiss(saveToast);
            setLoading(false);
            console.error('Error saving trip:', error);
            toast.error(error.message || 'Failed to save trip. Please try again.');
        }
    }

    const getTravelerIcon = (iconName) => {
        const iconClass = "w-8 h-8 text-primary";
        switch(iconName) {
            case 'user': return <User className={iconClass} />;
            case 'users': return <Users className={iconClass} />;
            case 'users-round': return <UsersRound className={iconClass} />;
            default: return <User className={iconClass} />;
        }
    };

    const getBudgetIcon = (iconName) => {
        const iconClass = "w-8 h-8 text-primary";
        switch(iconName) {
            case '💵': return <DollarSign className={iconClass} />;
            case '💰': return <Wallet className={iconClass} />;
            case '💸': return <Sparkles className={iconClass} />;
            default: return <DollarSign className={iconClass} />;
        }
    };

    return (
        <div className='container mx-auto px-4 lg:px-6 mt-10 max-w-5xl pb-16'>
            <div className='travel-card travel-grid relative overflow-hidden p-6 md:p-8 lg:p-10'>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <div className="mb-8">
              <span className="travel-kicker">Sunset planner</span>
              <h2 className='font-heading font-bold text-3xl md:text-5xl mt-4 text-balance text-foreground'>
                Tell us where you want to chase the
                <span className='sunset-text'> next golden hour</span>
              </h2>
              <p className='mt-3 text-white/68 text-lg max-w-2xl'>Drop in a destination, choose your pace, and we’ll sketch a trip that feels warmer, calmer, and easier to browse.</p>
            </div>

            <div className="relative w-full my-5" ref={inputContainerRef}>
                <Input
                    type="text"
                    placeholder="Search for a city or destination"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => {
                        // Keep suggestions open when input is focused
                        if (query.length >= 2 && suggestions.length === 0) {
                            handleSearch(query);
                        }
                    }}
                    className="h-14 w-full rounded-2xl border-white/12 bg-black/10 text-foreground placeholder:text-white/35 shadow-warm focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                />

                {suggestions.length > 0 && (
                    <ul 
                        ref={suggestionsRef}
                        className="absolute w-full mt-2 z-[100] max-h-60 overflow-y-auto rounded-2xl border border-white/12 bg-popover/95 text-popover-foreground shadow-warm-lg backdrop-blur-xl"
                        onMouseDown={(e) => {
                            // Prevent input blur when clicking on suggestions
                            e.preventDefault();
                        }}
                    >
                        {suggestions.map((prediction, idx) => (
                            <li
                                key={prediction.place_id || idx}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleSelect(prediction);
                                }}
                                className="px-4 py-3 hover:bg-white/8 hover:text-accent-foreground cursor-pointer select-none active:bg-accent transition-colors"
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleSelect(prediction);
                                    }
                                }}
                            >
                                <div className="font-medium">{prediction.structured_formatting?.main_text || prediction.description || 'Unknown'}</div>
                                {prediction.structured_formatting?.secondary_text && (
                                    <div className="text-sm text-muted-foreground">
                                        {prediction.structured_formatting.secondary_text}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {location && (
                <p className="text-white/60 text-sm -my-2">
                    Selected: <strong>{location}</strong>
                </p>
            )}

            <div className='mt-8 flex flex-col gap-8'>
                <div>
                    <h2 className='text-xl font-semibold mb-4 text-foreground'>How many days are you staying?</h2>
                    <Input
                        placeholder={'Ex. 4'}
                        type="number"
                        min={1}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="h-14 rounded-2xl border-white/12 bg-black/10 text-foreground placeholder:text-white/35 shadow-warm focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                        onKeyDown={(e) => {
                            if (["-", "+", "e", "E"].includes(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "");
                            handleInputChange('noOfDays', val);
                        }}
                    />
                </div>
            </div>

            <div className='mt-12'>
                <h2 className='text-xl font-semibold mb-4 text-foreground'>Who are you travelling with?</h2>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5'>
                    {SelectTravelersList.map((item, index) => (
                        <div key={index}
                            onClick={() => handleInputChange('traveler', item.people)}
                            className={`p-6 border cursor-pointer rounded-[24px] transition-all
                        ${formData?.traveler == item.people ? 'border-primary bg-primary/12 shadow-warm-lg -translate-y-1' : 'border-white/10 bg-white/6 hover:border-white/20 hover:bg-white/8 hover:-translate-y-1'}
                        `}>
                            <div className='flex justify-center mb-3'>
                                {getTravelerIcon(item.icon)}
                            </div>
                            <h2 className='font-bold text-base text-center text-foreground'>{item.title}</h2>
                            <h2 className='text-xs text-white/60 mt-2 text-center'>{item.desc}</h2>
                        </div>
                    ))}
                </div>
            </div>

            <div className='mt-12'>
                <h2 className='text-xl font-semibold mb-4 text-foreground'>What is your budget?</h2>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5'>
                    {SelectBudgetOptions.map((item, index) => (
                        <div key={index}
                            onClick={() => handleInputChange('budget', item.title)}
                            className={`p-6 border cursor-pointer rounded-[24px] transition-all
                        ${formData?.budget == item.title ? 'border-primary bg-primary/12 shadow-warm-lg -translate-y-1' : 'border-white/10 bg-white/6 hover:border-white/20 hover:bg-white/8 hover:-translate-y-1'}
                        `}>
                            <div className='flex justify-center mb-3'>
                                {getBudgetIcon(item.icon)}
                            </div>
                            <h2 className='font-bold text-lg text-center text-foreground'>{item.title}</h2>
                            <h2 className='text-sm text-white/60 mt-2 text-center'>{item.desc}</h2>
                        </div>
                    ))}
                </div>
            </div>

            <div className='my-10 justify-center flex'>
                <Button 
                    size="lg"
                    className='text-lg py-6 px-12 font-semibold min-w-52'
                    disabled={loading}
                    onClick={OnGenerateTrip}>
                    {loading ?
                        <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' /> : 'Generate Sunset Plan'
                    }
                </Button>
            </div>

            <Dialog open={openDialogue} onOpenChange={setOpenDialogue}>
                <DialogContent className="sm:max-w-md travel-surface border-white/12">
                    <DialogHeader>
                        <DialogTitle className="sr-only">Sign In</DialogTitle>
                        <DialogDescription className="space-y-6">
                            <div className="flex flex-col items-center pt-2">
                                <div className="flex items-center space-x-2">
                                    <Zap className="h-5 w-5 text-primary" />
                                    <span className="font-bold text-lg text-foreground">TripKitAI</span>
                                </div>
                            </div>
                            
                            <div className="space-y-4 text-center">
                                <div>
                                    <h2 className='font-semibold text-lg text-foreground mb-2'>Sign In With Google</h2>
                                    <p className='text-sm text-white/65'>Sign in to save and manage your trips</p>
                                </div>
                                <Button
                                    onClick={login}
                                    className='w-full flex gap-3 items-center justify-center py-6'>
                                    <FcGoogle className='h-5 w-5' />
                                    <span>Sign In With Google</span>
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            </div>
        </div>
    )
}

export default CreateTrip