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

    const toggleShow = () => {
      setShow(prev => !prev)
    }

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
          <div className={show ? "sidebar d-none d-lg-block" : "sidebar d-none"}>
            <Offcanvas className="custom-offcanvas" show={show} onHide={toggleShow} responsive="lg" style={{height: "100%", backgroundColor: "#87CEEB"}}>
              <Offcanvas.Header closeButton className="justify-content-end">

              </Offcanvas.Header>
              <Offcanvas.Body className="justify-content-center pt-0 mt-0" style={{height: "100%"}}>
                <Sidebar />
              </Offcanvas.Body>
            </Offcanvas>
          </div>
          <div className="main-panel">
            <div className="main-panel-navbar">
              <Navbar style={{ width: "100%" }}>
                <i className="bi bi-list ps-3" onClick={toggleShow} style={{fontSize: '3rem', cursor: "pointer"}}></i>
                <Container fluid>
                  <Navbar.Brand>Title is ABC?</Navbar.Brand>
                  <Navbar.Toggle />
                  <Navbar.Collapse className="justify-content-end pe-4">
                    <Navbar.Text onClick={handleLogout} style={{cursor: "pointer"}}>
                      Logout
                    </Navbar.Text>

                  </Navbar.Collapse>
                </Container>
              </Navbar>
            </div>
            <div className="content p-4">
              <Outlet />
            </div>
          </div>
        </div>
      </>
    )
}

export default DashboardPage
