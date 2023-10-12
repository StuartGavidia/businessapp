import { Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage/LandingPage'
import SignInPage from './pages/SignInPage/SignInPage'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'
import Dashboard from './features/Dashboard/Dashboard'
import Analytics from './features/Analytics/Analytics'
import Calendar from './features/Calendar/Calendar'
import Communication from './features/Communication/Communication'
import Settings from './features/Settings/Settings'

function App() {
  return (
    <Routes>
      <Route path="" element={<LandingPage />}/>
      <Route path="signIn" element={<SignInPage />}/>
      <Route path="dashboard" element={<DashboardPage />}>
        <Route index element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />}/>
        <Route path="calendar" element={<Calendar />}/>
        <Route path="communication" element={<Communication />}/>
        <Route path="settings" element={<Settings />}/>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
