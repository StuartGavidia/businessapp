import { useState } from 'react'
import './SignInPage.css'
import SignIn from '../../components/SignIn/SignIn'
import Registration from '../../components/Registration/Registration'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const SignInPage:React.FC = () => {

    const [isLoggingIn, setIsLoggingIn] = useState(true)

    return (
      <Container fluid style={{ height: '100vh' }} className="signinpage-wrapper">
        <Row style={{ height: '100%', backgroundColor: 'white' }}>
            <Col
              md={6}
              className="form-container d-flex align-items-center justify-content-center"
              >
                {
                    isLoggingIn
                    ? <SignIn setIsLoggingIn={setIsLoggingIn}/>
                    : <Registration setIsLoggingIn={setIsLoggingIn}/>
                }
            </Col>
            <Col md={6} className="info-container">
                {/* Empty for now */}
            </Col>
        </Row>
      </Container>
    )

}

export default SignInPage
