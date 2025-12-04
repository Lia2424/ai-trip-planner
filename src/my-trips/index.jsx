import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {
    const navigation = useNavigate();
    const [userTrips, setUserTrips] = useState([]);

    useEffect(() => {
        GetUserTrips();
    }, [])

    // Fetch all trips for the authenticated user from Firebase
    const GetUserTrips = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigation('/');
            return;
        }

        setUserTrips([]);
        const q = query(collection(db, 'AITrips'), where('userEmail', '==', user?.email));
        const querySnapshot = await getDocs(q);
        setUserTrips([]);
        
        querySnapshot.forEach((doc) => {
            setUserTrips(prevVal => [...prevVal, doc.data()])
        });
    };

    return (
        <div className='container mx-auto px-4 lg:px-6 mt-10 max-w-7xl'>
            <h2
              className='font-bold text-3xl bg-clip-text text-transparent'
              style={{ backgroundImage: 'var(--gradient)' }}
            >
              My Trips
            </h2>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-5 gap-5'>
                {userTrips?.length>0?userTrips.map((trip, index) => (
                    <UserTripCardItem trip={trip} key={index}/>
                ))
            : [1,2,3,4,5,6].map((item, index)=>(
                <div key={index} className='h-[220px] w-full bg-slate-200 animate-pulse rounded-xl'>
                </div>
            ))}
            </div>
        </div>
    )
}

export default MyTrips