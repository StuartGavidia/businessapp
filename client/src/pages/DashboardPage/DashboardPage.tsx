import './DashboardPage.css'
import { Outlet, useNavigate } from 'react-router-dom'
import UserServiceAPI from '../../api/userServiceAPI';
import { useEffect, useState, useCallback, useRef } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Sidebar from '../../features/Sidebar/Sidebar';
import Container from 'react-bootstrap/Container';


const DashboardPage:React.FC = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const navigate = useNavigate();
    const inactivityTimer = useRef<number | null>(null);

    const handleLogout = useCallback(async () => {
      try {
        await UserServiceAPI.getInstance().logoutUser();
        alert("Logout successful!")
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.log("Error Logging out user");
        } else {
          console.log("An error has occurred")
        }
      }
      navigate('/signin');
    }, [navigate]);


    const resetTimer = useCallback(() => {
      if (inactivityTimer.current !== null) {
        window.clearTimeout(inactivityTimer.current);
      }
      inactivityTimer.current = window.setTimeout(handleLogout, 15 * 60 * 1000); // 15 minutes
    }, [handleLogout]);


    useEffect(() => {
      document.addEventListener('mousemove', resetTimer);
      document.addEventListener('keypress', resetTimer);

      return () => {
        //when the component unmounts this cleans up event listeners
        document.removeEventListener('mousemove', resetTimer);
        document.removeEventListener('keypress', resetTimer);
      };
    }, [resetTimer]);

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
              <i className="bi bi-list d-lg-none" onClick={handleShow} style={{fontSize: '3rem', cursor: "pointer"}}></i>
              <Navbar style={{flex: "1"}}>
                <Container>
                  <Navbar.Brand>NavBar text</Navbar.Brand>
                  <Navbar.Toggle />
                  <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text onClick={handleLogout} style={{cursor: "pointer"}}>
                      Logout
                    </Navbar.Text>
                  </Navbar.Collapse>
                </Container>
              </Navbar>
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
