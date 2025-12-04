import Header from './custom/Header'
import { Toaster } from './ui/sonner'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <Toaster/>
      <div className="flex-1">
        <Outlet/>
      </div>
    </div>
  )
}

export default Layout

