import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
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
import UserServiceAPI from './api/userServiceAPI'
import ProtectedRouteProps from './interfaces/ProtectedRouteProps'
import { AppConfigProvider } from './providers/AppConfigProvider'

const ProtectedRoute: React.FC<ProtectedRouteProps> =  ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await UserServiceAPI.getInstance().isLoggedIn();
        setIsAuthenticated(true);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.log(err.message)
        } else {
          console.log("an error has occured")
        }
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    //TODO: Here we can display a loading spinner that we need to create
    return null;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" />;
};

function App() {
  return (
    <Routes>
      <Route path="" element={<LandingPage />}/>
      <AppConfigProvider>
        <Route path="signIn" element={<SignInPage />}/>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />}/>
          <Route path="calendar" element={<Calendar />}/>
          <Route path="communication" element={<Communication />}/>
          <Route path="settings" element={<Settings />}/>
        </Route>
      </AppConfigProvider>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
