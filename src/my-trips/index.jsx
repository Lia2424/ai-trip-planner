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
        <div className='container mx-auto px-4 lg:px-6 mt-10 max-w-7xl'>
            <h2
              className='font-bold text-3xl bg-clip-text text-transparent'
              style={{ backgroundImage: 'var(--gradient)' }}
            >
              My Trips
            </h2>

            {error && (
                <div className='mt-5 p-4 bg-destructive/10 border border-destructive/20 rounded-lg'>
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
                        <div key={index} className='h-[220px] w-full bg-slate-200 animate-pulse rounded-xl'>
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
                <div className='mt-10 text-center py-10'>
                    <p className='text-muted-foreground text-lg'>No trips found. Start planning your first trip!</p>
                </div>
            )}
        </div>
    )
}

export default MyTrips