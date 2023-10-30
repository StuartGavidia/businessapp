import { useState } from 'react'
import './Contact.css'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Contact:React.FC = () => {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        company: "",
        email: "",
        phoneNumber: "",
        message: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log(formData)
        //Here we need to send this data to a backend service for saving. I think we can put this in the
        //communications service. Let's create a table for contact messages.
      };

    return (
      <Row className="justify-content-center">
        <Col lg={8}>
          <Form onSubmit={handleSubmit}>
            <Row className="mt-2">
              <Form.Group as={Col} controlId="formFirstName">
                <Form.Label><strong>First Name *</strong></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required />
              </Form.Group>
              <Form.Group as={Col} controlId="formLastName">
                <Form.Label><strong>Last Name *</strong></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required />
              </Form.Group>
            </Row>
            <Form.Group className="mt-2" controlId="formCompany">
              <Form.Label><strong>Company *</strong></Form.Label>
              <Form.Control
                type="text"
                placeholder="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required />
            </Form.Group>
            <Form.Group className="mt-2" controlId="formEmail">
              <Form.Label><strong>Email *</strong></Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required />
            </Form.Group>
            <Form.Group className="mt-2" controlId="formPhone">
              <Form.Label><strong>Phone Number *</strong></Form.Label>
              <Form.Control
                type="tel"
                placeholder="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required />
            </Form.Group>
            <Form.Group className="mt-2" controlId="formMessage">
              <Form.Label><strong>Message</strong></Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Write your message here..."
                name="message"
                value={formData.message}
                onChange={handleChange} />
            </Form.Group>
            <Form.Group className="my-3 d-flex justify-content-center">
              <Button variant="primary" type="submit">
                  Submit
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    )
}

export default Contact
