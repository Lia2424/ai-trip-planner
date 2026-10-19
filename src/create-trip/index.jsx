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

const getGenerationError = (error) => {
    const rawMessage = String(error?.message || error || '');

    if (/\b402\b|prepayment credits|billing/i.test(rawMessage)) {
        return {
            title: 'Trip generation is temporarily unavailable.',
            description: 'The Gemini API project has no remaining credits. Add credits in Google AI Studio, then try again.',
            showBillingLink: true,
        };
    }

    if (/\b429\b|quota|rate limit/i.test(rawMessage)) {
        return {
            title: 'The trip planner is busy right now.',
            description: 'The AI usage limit has been reached. Wait a moment and try again.',
            showBillingLink: false,
        };
    }

    if (/api key|permission|unauthorized|forbidden|\b401\b|\b403\b/i.test(rawMessage)) {
        return {
            title: 'Trip generation is not configured correctly.',
            description: 'Check the Gemini API key and project permissions, then try again.',
            showBillingLink: false,
        };
    }

    return {
        title: 'We couldn’t create this trip.',
        description: 'Please check your connection and try again in a moment.',
        showBillingLink: false,
    };
};

function CreateTrip() {
    const [searchParams] = useSearchParams();
    const destinationParam = searchParams.get('destination')?.trim() || '';
    const [location, setLocation] = useState(destinationParam || undefined);
    const [formData, setFormData] = useState(() => destinationParam
        ? { location: destinationParam }
        : {}
    );
    const [openDialogue, setOpenDialogue] = useState(false);
    const [loading, setLoading] = useState(false);
    const [generationError, setGenerationError] = useState(null);
    const [query, setQuery] = useState(destinationParam);
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
        setLocation(undefined);
        setFormData(prev => ({ ...prev, location: '', city: '', country: '' }));

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

        setGenerationError(null);
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
            const friendlyError = getGenerationError(error);
            setGenerationError(friendlyError);
            toast.error(friendlyError.title, {
                description: friendlyError.description,
                duration: 10000,
            });
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
        <div className='page-shell max-w-4xl'>
            <div className='travel-card relative p-6 md:p-8 lg:p-10'>

            <div className="mb-8">
              <span className="travel-kicker">Let’s go somewhere</span>
              <h1 className='font-heading text-4xl md:text-5xl mt-4 text-balance'>Your next adventure,<br /><em className='font-normal text-primary'>made personal.</em></h1>
              <p className='mt-3 text-muted-foreground text-lg max-w-2xl'>A few details are all it takes. We’ll bring together places to stay, things to see, and a day-by-day plan that fits you.</p>
            </div>

            <div className="relative w-full my-5" ref={inputContainerRef}>
                <label htmlFor="destination" className="form-label">01 — Where are you dreaming of?</label>
                <Input
                    id="destination"
                    autoComplete="off"
                    type="text"
                    placeholder="Search for a city or destination"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => {
                        // Keep suggestions open when input is focused
                        if (!location && query.length >= 2 && suggestions.length === 0) {
                            handleSearch(query);
                        }
                    }}
                    className="h-14 w-full rounded-2xl border-border bg-background text-foreground placeholder:text-muted-foreground shadow-warm focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                />

                {suggestions.length > 0 && (
                    <ul
                        ref={suggestionsRef}
                        className="absolute w-full mt-2 z-[100] max-h-60 overflow-y-auto rounded-2xl border border-border bg-popover/95 text-popover-foreground shadow-warm-lg "
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
                                className="px-4 py-3 hover:bg-muted hover:text-accent-foreground cursor-pointer select-none active:bg-accent transition-colors"
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
                <p className="text-muted-foreground text-sm -my-2">
                    Selected: <strong>{location}</strong>
                </p>
            )}

            <div className='mt-8 flex flex-col gap-8'>
                <div>
                    <label htmlFor="duration" className="form-label">02 — How long is your getaway?</label>
                    <Input
                        id="duration"
                        aria-describedby="duration-help"
                        max={50}
                        placeholder="e.g. 4"
                        type="number"
                        min={1}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="h-14 rounded-2xl border-border bg-background text-foreground placeholder:text-muted-foreground shadow-warm focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
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
                    <p id="duration-help" className="mt-2 text-xs text-muted-foreground">From a quick escape to a longer adventure. Choose 1–50 days.</p>
                </div>
            </div>

            <div className='mt-12'>
                <h2 className='text-xl font-semibold mb-4 text-foreground'>03 — Who’s coming along?</h2>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5'>
                    {SelectTravelersList.map((item, index) => (
                        <button type="button" key={index}
                            onClick={() => handleInputChange('traveler', item.people)}
                            aria-pressed={formData?.traveler === item.people}
                            className={`p-4 sm:p-5 border-2 cursor-pointer rounded-2xl transition-all
                        ${formData?.traveler == item.people ? 'border-primary bg-secondary ring-1 ring-primary' : 'border-border bg-card hover:border-primary hover:bg-secondary'}
                        `}>
                            <div className='flex justify-center mb-3'>
                                {getTravelerIcon(item.icon)}
                            </div>
                            <span className='block font-bold text-base text-center text-foreground'>{item.title}</span>
                            <span className='block text-xs text-muted-foreground mt-2 text-center'>{item.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className='mt-12'>
                <h2 className='text-xl font-semibold mb-4 text-foreground'>04 — What’s your travel style?</h2>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5'>
                    {SelectBudgetOptions.map((item, index) => (
                        <button type="button" key={index}
                            onClick={() => handleInputChange('budget', item.title)}
                            aria-pressed={formData?.budget === item.title}
                            className={`p-4 sm:p-5 border-2 cursor-pointer rounded-2xl transition-all
                        ${formData?.budget == item.title ? 'border-primary bg-secondary ring-1 ring-primary' : 'border-border bg-card hover:border-primary hover:bg-secondary'}
                        `}>
                            <div className='flex justify-center mb-3'>
                                {getBudgetIcon(item.icon)}
                            </div>
                            <span className='block font-bold text-lg text-center text-foreground'>{item.title}</span>
                            <span className='block text-sm text-muted-foreground mt-2 text-center'>{item.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className='mt-10 border-t border-border pt-7 flex flex-col items-center gap-3'>
                {generationError && (
                    <div role="alert" className="mb-3 w-full rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-left">
                        <p className="font-semibold text-destructive">{generationError.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{generationError.description}</p>
                        {generationError.showBillingLink && (
                            <a
                                href="https://ai.studio/projects"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex text-sm font-semibold text-primary underline underline-offset-4"
                            >
                                Manage Gemini billing ↗
                            </a>
                        )}
                    </div>
                )}
                <Button
                    size="lg"
                    className='text-sm sm:text-base py-6 px-5 sm:px-8 font-semibold w-full sm:w-auto rounded-full'
                    disabled={loading}
                    aria-busy={loading}
                    onClick={OnGenerateTrip}>
                    {loading ?
                        <><AiOutlineLoading3Quarters className='h-5 w-5 animate-spin' /> Planning your adventure…</> : 'Create my itinerary'
                    }
                </Button>
                <p role="status" className="text-sm text-muted-foreground text-center">{loading ? "Gathering ideas and putting your days together. This may take up to a minute." : "Your plans, with room for a little spontaneity."}</p>
            </div>

            <Dialog open={openDialogue} onOpenChange={setOpenDialogue}>
                <DialogContent className="sm:max-w-md travel-surface border-border">
                    <DialogHeader>
                        <DialogTitle className="sr-only">Sign In</DialogTitle>
                        <DialogDescription asChild><div className="space-y-6">
                            <div className="flex flex-col items-center pt-2">
                                <div className="flex items-center space-x-2">
                                    <Zap className="h-5 w-5 text-primary" />
                                    <span className="font-bold text-lg text-foreground">TripKitAI</span>
                                </div>
                            </div>

                            <div className="space-y-4 text-center">
                                <div>
                                    <h2 className='font-semibold text-lg text-foreground mb-2'>Sign In With Google</h2>
                                    <p className='text-sm text-muted-foreground'>Sign in to save and manage your trips</p>
                                </div>
                                <Button
                                    onClick={login}
                                    className='w-full flex gap-3 items-center justify-center py-6'>
                                    <FcGoogle className='h-5 w-5' />
                                    <span>Sign In With Google</span>
                                </Button>
                            </div>
                        </div></DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            </div>
        </div>
    )
}

export default CreateTrip
