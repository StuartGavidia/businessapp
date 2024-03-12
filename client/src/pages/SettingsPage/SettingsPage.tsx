import { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Settings from '../../components/Settings/Settings'

const SettingsPage:React.FC = () => {

    return (
      <Container fluid style={{ height: '100vh' }} className="signinpage-wrapper">
        <Row style={{ height: '100%', width: '100%', backgroundColor: 'white' }}>
            <Col
              className="form-container d-flex align-items-center justify-content-center"
              >
                {
                  <Settings></Settings>
                }
            </Col>
            <Col md={6} className="info-container">
                {/* Empty for now */}
            </Col>
        </Row>
      </Container>
    )

}

export default SettingsPage;
