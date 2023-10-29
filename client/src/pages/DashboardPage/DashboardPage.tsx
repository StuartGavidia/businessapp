import './DashboardPage.css'
import { Outlet, useNavigate } from 'react-router-dom'
import UserServiceAPI from '../../api/userServiceAPI';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Sidebar from '../../features/Sidebar/Sidebar';


const DashboardPage:React.FC = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
      <>
        <div className="wrapper">
          <div className="sidebar d-none d-lg-block">
            <Offcanvas show={show} onHide={handleClose} responsive="lg">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Click X to close</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body className="justify-content-center">
                <Sidebar />
              </Offcanvas.Body>
            </Offcanvas>
          </div>
          <div className="main-panel">
            <div className="main-panel-navbar">
              <Button variant="primary" className="d-lg-none" onClick={handleShow}>
                Launch
              </Button>
              <div onClick={handleLogout}>
                <p>Logout</p>
              </div>
            </div>
            <div className="content">
              <Outlet />
            </div>
          </div>
        </div>
      </>
    )
}

export default DashboardPage
