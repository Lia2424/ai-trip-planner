import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router'
import CreateTrip from './create-trip'
import Layout from './components/Layout'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ViewTrip from './view-trip/[tripId]'
import MyTrips from './my-trips'
import FAQPage from './faq'

// Application routes configuration
const router=createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children: [
      {
        path: '/',
        element: <App/>
      },
      {
        path: '/Create-trip',
        element:<CreateTrip/>
      },
      {
        path:'/view-trip/:tripId',
        element:<ViewTrip/>
      },
      {
        path:'/my-trips',
        element:<MyTrips/>
      },
      {
        path:'/faq',
        element:<FAQPage/>
      }
    ]
  }
])

// Initialize React app with OAuth provider and routing
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <RouterProvider router={router}/>
    </GoogleOAuthProvider>
  </StrictMode>,
)
