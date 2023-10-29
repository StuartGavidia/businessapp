import { useState } from 'react'
import './Registration.css'
import UserServiceAPI from '../../api/userServiceAPI'
import RegistrationProps from '../../interfaces/RegistrationProps'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Stack from 'react-bootstrap/Stack';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const Registration: React.FC<RegistrationProps> = ({ setIsLoggingIn }) => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      hasDirectReports: false,
      managerCode: '',
      companyCode: '',
      positionName: ''
    })
    const [error, setError] = useState("");

    const toggleDirectReports = (hasDirectReports: boolean) => {
      setFormData(prevState => ({ ...prevState, ['hasDirectReports']: hasDirectReports }))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log(formData)
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        //need to send this data to user service for register confirmation
        try {
          await UserServiceAPI.getInstance().registerUser(formData);
          alert("Registration was succesful!")
          setIsLoggingIn(true)
          setError("");
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An error occurred");
          }
        }
    };

    return (
        <div className="signin-content my-5" style={{width: "100%", maxWidth: "450px"}}>
          <Stack direction="horizontal" gap={3}>
            <Image
              src="./assets/images/businessLogo.png"
              alt="ABC Logo"
              style={{ width: '3rem', height: '3rem' }}
            />
            <h2>ABC</h2>
          </Stack>
          <div className="mt-5">
            <Row className="align-items-center">
              <Col>
                <p className="h2">Register to abc</p>
              </Col>
              <Col>
                <p className="signin-helper" onClick={() => setIsLoggingIn(true)}>Log in</p>
              </Col>
            </Row>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="firstName" className="mb-3">
              <Form.Control
                type="text"
                placeholder="First Name"
                name="firstName"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="lastName" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Last Name"
                name="lastName"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="username" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="email" className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="password" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="confirmPassword" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <ButtonGroup className="mb-3">
              <ToggleButton
                id="has-reports"
                type="checkbox"
                variant="primary"
                checked={formData.hasDirectReports}
                value="1"
                onChange={(e) => toggleDirectReports(true)}
              >
                Has Direct Reports
              </ToggleButton>
              <ToggleButton
                id="not-has-reports"
                type="checkbox"
                variant="primary"
                checked={!formData.hasDirectReports}
                value="2"
                onChange={(e) => toggleDirectReports(false)}
            >
              Has No Direct Reports
              </ToggleButton>
            </ButtonGroup>
            <Form.Group controlId="managerCode" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Manager Code"
                name="managerCode"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="positionName" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Position Name (ex: Builder, Chef, Manager ... )"
                name="positionName"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="companyCode" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Company Code"
                name="companyCode"
                onChange={handleChange}
                required
              />
            </Form.Group>
            {
              error &&
              <p className="error-message">{error}</p>
            }
            <Button variant="primary" type="submit" className="w-100">
                Register
            </Button>
          </Form>
        </div>
    )
}

export default Registration
