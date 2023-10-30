import { useState } from 'react'
import './SignIn.css'
import UserServiceAPI from '../../api/userServiceAPI'
import { useNavigate } from 'react-router-dom'
import SignInProps from '../../interfaces/SignInProps'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Stack from 'react-bootstrap/Stack';

const SignIn: React.FC<SignInProps> = ({ setIsLoggingIn }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    })
    const [error, setError] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type } = e.target;
        const value = type === 'checkbox' ? e.target.checked : e.target.value;

        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData)
        //need to send this data to user service for login confirmation
        try {
            await UserServiceAPI.getInstance().loginUser(formData);
            alert("Login succesful!")
            setIsLoggingIn(true)
            setError("");
            navigate("/dashboard")
          } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An error occurred")
            }
        }
    };

    return (
      <div className="signin-content" style={{width: "100%", maxWidth: "450px"}}>
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
              <p className="h2">Sign in to abc</p>
            </Col>
            <Col>
              <p className="signin-helper" onClick={() => setIsLoggingIn(false)}>Register</p>
            </Col>
          </Row>
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
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
          <div className="mb-3">
            <Row className="align-items-center">
              <Col>
                <Form.Check
                  type="checkbox"
                  label="Remember Me"
                  id="remember-me"
                  name="rememberMe"
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <p className="signin-helper">Forgot your Password?</p>
              </Col>
            </Row>
            {
              error &&
              <p className="error-message">{error}</p>
            }
          </div>
          <Button variant="primary" type="submit" className="w-100">
              Sign In
          </Button>
        </Form>
      </div>
    )
}

export default SignIn
