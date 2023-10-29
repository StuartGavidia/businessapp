import { useState } from 'react'
import './SignInPage.css'
import SignIn from '../../components/SignIn/SignIn'
import Registration from '../../components/Registration/Registration'
import { Container, Row, Col } from 'react-bootstrap'

const SignInPage:React.FC = () => {

    const [isLoggingIn, setIsLoggingIn] = useState(true)

    return (
      <Container fluid style={{ height: '100vh' }}>
        <Row style={{ height: '100%' }}>
            <Col md={6} className="form-container d-flex align-items-center justify-content-center">
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
