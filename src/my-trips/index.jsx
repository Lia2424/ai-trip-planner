import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import UserTripCardItem from './components/UserTripCardItem';
import { toast } from 'sonner';

function MyTrips() {
    const navigation = useNavigate();
    const [userTrips, setUserTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        GetUserTrips();
    }, [])

    // Fetch all trips for the authenticated user from Firebase
    const GetUserTrips = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                navigation('/');
                return;
            }

            const user = JSON.parse(userStr);
            if (!user?.email) {
                navigation('/');
                return;
            }

            setUserTrips([]);
            const q = query(collection(db, 'AITrips'), where('userEmail', '==', user.email));
            
            // Add timeout to prevent hanging
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout. Please try again.')), 15000)
            );
            
            const queryPromise = getDocs(q);
            const querySnapshot = await Promise.race([queryPromise, timeoutPromise]);
            
            const trips = [];
            querySnapshot.forEach((doc) => {
                trips.push(doc.data());
            });
            
            setUserTrips(trips);
        } catch (err) {
            console.error('Error fetching trips:', err);
            setError(err.message || 'Failed to load trips. Please try again.');
            toast.error(err.message || 'Failed to load trips. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container mx-auto px-4 lg:px-6 mt-10 max-w-7xl pb-16'>
            <span className='travel-kicker'>Saved escapes</span>
            <h2 className='mt-4 font-bold text-3xl md:text-4xl text-foreground'>
              Your <span className='sunset-text'>sunset-themed</span> trip library
            </h2>

            {error && (
                <div className='mt-5 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl'>
                    <p className='text-destructive'>{error}</p>
                    <button 
                        onClick={GetUserTrips}
                        className='mt-2 text-sm underline hover:no-underline'
                    >
                        Try again
                    </button>
                </div>
            )}

            {loading ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-5 gap-5'>
                    {[1,2,3,4,5,6].map((item, index)=>(
                        <div key={index} className='h-[280px] w-full animate-pulse rounded-[28px] border border-white/10 bg-white/6'>
                        </div>
                    ))}
                </div>
            ) : userTrips?.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-5 gap-5'>
                    {userTrips.map((trip, index) => (
                        <UserTripCardItem trip={trip} key={index}/>
                    ))}
                </div>
            ) : (
                <div className='mt-10 text-center py-10 travel-card'>
                    <p className='text-white/70 text-lg'>No trips found yet. Start planning your first escape.</p>
                </div>
            )}
        </div>
    )
}

export default MyTrips