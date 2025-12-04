import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import InfoSection from '../components/InfoSection';
import { toast } from 'sonner';
import HotelSection from '../components/HotelSection';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';

function ViewTrip() {
    const {tripId} = useParams();
    const [trip, setTrip] = useState([])

    useEffect(()=>{
        if (tripId) {
            GetTripData();
        }
    }, [tripId])

    // Fetch trip data from Firebase Firestore
    const GetTripData=async()=>{
        
        const docRef = doc(db, 'AITrips', tripId);
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            setTrip(docSnap.data());
        } else {
            toast.error("No trip Found!")
        }
    }

  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
        {/* Information Section */}
        <InfoSection trip={trip}/>

        { /* Recommended Hotels */}
        <HotelSection trip={trip}/>

        { /* Daily Plan */}
        <PlacesToVisit trip={trip}/>

        { /* Footer */}
        <Footer trip={trip}/>
    </div>
  )
}

export default ViewTrip