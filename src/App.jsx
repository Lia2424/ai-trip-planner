import Hero from './components/custom/Hero'

function App() {
  return (
    <div className="bg-background overflow-hidden" style={{ height: 'calc(100vh - 64px)', maxHeight: 'calc(100vh - 64px)' }}> 
      <Hero/>
    </div>
  )
}

export default App
