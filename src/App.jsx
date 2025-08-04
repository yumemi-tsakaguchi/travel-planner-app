import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import PlanWizard from './pages/PlanWizard'
import TripDetail from './pages/TripDetail'
import './App.css'

function App() {
  return (
    <Router basename="/travel-planner-app">
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/plan" element={<PlanWizard />} />
            <Route path="/trip/:id" element={<TripDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
