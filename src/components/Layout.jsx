import Header from './custom/Header'
import { Toaster } from './ui/sonner'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:p-4">Skip to content</a>
      <Header/>
      <Toaster/>
      <main id="main-content" className="flex-1">
        <Outlet/>
      </main>
      <footer className="border-t border-border px-5 py-7 text-sm text-muted-foreground"><div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3"><span className="font-semibold text-foreground">TripKitAI <span className="font-normal text-muted-foreground">— Made for the journey.</span></span><a href="/faq" className="hover:underline">A little help along the way ↗</a></div></footer>
    </div>
  )
}

export default Layout

