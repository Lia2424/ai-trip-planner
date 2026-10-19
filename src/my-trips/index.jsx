import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
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
        <div className='page-shell'>
            <span className='travel-kicker'>Saved escapes</span>
            <div className='mt-4 flex flex-wrap justify-between items-center gap-4'><div><h1 className='section-heading'>A world of plans.</h1><p className='mt-3 text-muted-foreground'>Your next adventures, all in one place.</p></div><Link to='/create-trip' className='rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground'>+ Plan a new trip</Link></div>

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
                <div role='status' aria-label='Loading your trips' className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-5 gap-5'>
                    {[1,2,3,4,5,6].map((item, index)=>(
                        <div key={index} className='h-[280px] w-full animate-pulse rounded-[28px] border border-border bg-muted'>
                        </div>
                    ))}
                </div>
            ) : userTrips?.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-5 gap-5'>
                    {userTrips.map((trip, index) => (
                        <UserTripCardItem trip={trip} key={index}/>
                    ))}
                </div>
            ) : !error && (
                <div className='mt-10 text-center py-10 travel-card'>
                    <span className='travel-kicker'>A fresh page</span><h2 className='section-heading mt-4'>Your first adventure is waiting.</h2><p className='mt-4 text-muted-foreground'>Start with a destination. We’ll help you find your way.</p><Link to='/create-trip' className='mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-primary-foreground'>Plan my first trip ↗</Link>
                </div>
            )}
        </div>
    )
}

export default MyTrips