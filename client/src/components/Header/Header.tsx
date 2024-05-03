import './Header.css'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';

const Header:React.FC = () => {

    function scrollToProjects(sectionId: string){
        setTimeout(() => {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 300)
    }

    return (
      <Navbar key='sm' expand='sm' className="bg-body-tertiary mb-3" sticky="top">
        <Container fluid>
          <Navbar.Brand href="#"><img src="./assets/images/businessLogo.png" alt="Pro Connect Logo" style={{height: 32, width: 32}}/> Ibiz</Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} />
          <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link onClick={() => scrollToProjects('features')}>Features</Nav.Link>
                <Nav.Link onClick={() => scrollToProjects('prices')}>Pricing</Nav.Link>
                <Nav.Link onClick={() => scrollToProjects('contact')}>Contact</Nav.Link>
              </Nav>
              <NavLink className="navlink-landing" to="/signin">
                <Button variant="outline-success" className="ms-auto">
                  Sign in/Up
                </Button>
              </NavLink>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
}

export default Header
