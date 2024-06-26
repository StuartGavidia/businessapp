import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Settings from '../../components/Settings/Settings'

const SettingsPage:React.FC = () => {

    return (
      <Container fluid style={{ height: '100vh' }} className="signinpage-wrapper">
        <Row style={{ height: '100%', width: '100%', backgroundColor: 'white' }}>
            <Col
              className="justify-content-center"
              >
                {
                  <Settings></Settings>
                }
            </Col>
        </Row>
      </Container>
    )

}

export default SettingsPage;
