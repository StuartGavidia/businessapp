import './Footer.css'
import Container from 'react-bootstrap/Container';

const Footer:React.FC = () => {
    return (
      <Container fluid className="bg-body-tertiary py-3">
        <div className="d-flex justify-content-between align-items-center">
          <span>
            <img src="./assets/images/businessLogo.png" alt="Pro Connect Logo" style={{height: 32, width: 32}}/>
            Ibiz
          </span>
          <span>© 2023 - Ibiz</span>
        </div>
      </Container>
    )
}

export default Footer
