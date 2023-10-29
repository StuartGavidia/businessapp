import './DashboardPage.css'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import UserServiceAPI from '../../api/userServiceAPI';
import { useEffect } from 'react'


const DashboardPage:React.FC = () => {

    const navigate = useNavigate();
    let inactivityTimer: number;

    useEffect(() => {
      document.addEventListener('mousemove', resetTimer);
      document.addEventListener('keypress', resetTimer);

      return () => {
        //when the component unmounts this cleans up event listeners
        document.removeEventListener('mousemove', resetTimer);
        document.removeEventListener('keypress', resetTimer);
      };
    }, []);

    const resetTimer = () => {
      window.clearTimeout(inactivityTimer);

      inactivityTimer = window.setTimeout(handleLogout, 15 * 60 * 1000); // 15 minutes
    };

    const handleLogout = async () => {
        try {
            await UserServiceAPI.getInstance().logoutUser();
            alert("Logout succesful!")
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.log("Error Logging out user");
          } else {
            console.log("An error has ocurred")
          }
        }
        navigate('/signin')
    }

    return (
        <div className="dashboard-container">
            <div className="sidebar">
              <h1>Testsdigjsijsijfhfs</h1>
            </div>
            {/* <div className="dashboard-nav">
                <div className="dashboard-nav-wrapper">
                    <div className="title">
                        <h1>ABC</h1>
                    </div>
                    <div className="dashboard-features">
                        <NavLink to="/dashboard" className="feature-div">
                            <img src="./assets/images/dashboardFeature.png" alt="Dashboard feature logo"/>
                            <p>Dashboard</p>
                        </NavLink>
                        <NavLink to="/dashboard/analytics" className="feature-div">
                            <img src="./assets/images/analyticsFeature.png" alt="Analytics feature logo"/>
                            <p>Analytics</p>
                        </NavLink>
                        <NavLink to="/dashboard/team" className="feature-div">
                            <img src="./assets/images/teamFeature.png" alt="Team feature logo"/>
                            <p>Team</p>
                        </NavLink>
                        <NavLink to="/dashboard/communication" className="feature-div">
                            <img src="./assets/images/communicationFeature.png" alt="Communication feature logo"/>
                            <p>Inbox</p>
                        </NavLink>
                        <NavLink to="/dashboard/settings" className="feature-div">
                            <img src="./assets/images/settingsFeature.png" alt="Settings feature logo"/>
                            <p>Settings</p>
                        </NavLink>
                    </div>
                    <div className="logout">
                        <div onClick={handleLogout} className="logout-div">
                            <img src="./assets/images/logoutFeature.png" alt="Logout feature logo"/>
                            <p>Logout</p>
                        </div>
                    </div>
                </div>
            </div> */}
            <div className="dashboard-main">
                <div className="dashboard-section-top">
                    <div className="dashboard-section-top-wrapper">
                        <p>This is the header</p>
                    </div>
                </div>
                <div className="dashboard-section-bottom">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
