import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'
import LandingPage from './pages/LandingPage/LandingPage'
import SignInPage from './pages/SignInPage/SignInPage'
import SettingsPage from './pages/SettingsPage/SettingsPage'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'
import Dashboard from './features/Dashboard/Dashboard'
import Analytics from './features/Analytics/Analytics'
import Budget from './features/Budget/Budget'
import Calendar from './features/Calendar/Calendar'
import Communication from './features/Communication/Communication'
import UserServiceAPI from './api/userServiceAPI'
import ProtectedRouteProps from './interfaces/ProtectedRouteProps'
import AppConfigLayout from './layouts/AppConfigLayout'
import { ThemeProvider } from './theme/ThemeContext';
import Spinner from './components/Spinner/Spinner'
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating an async operation (e.g., fetching data)
    const fetchData = async () => {
      // Assume the loading time is 2 seconds
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };

    fetchData();
  }, []);

   if (loading) {
    return <Spinner/> 
   } else {
    return (
    <Routes>
      <Route path="" element={<LandingPage />}/>
      <Route element={<AppConfigLayout />}>
        <Route path="signIn" element={<SignInPage />}/>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <ThemeProvider>
              <DashboardPage />
            </ThemeProvider>
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />}/>
          <Route path="budget" element={<Budget />} />
          <Route path="calendar" element={<Calendar />}/>
          <Route path="communication" element={<Communication />}/>
          <Route path="settings" element={
          <ProtectedRoute>
            <ThemeProvider>
              <SettingsPage />
            </ThemeProvider>
          </ProtectedRoute>
        }/>       
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>);
   }
}

export default App
