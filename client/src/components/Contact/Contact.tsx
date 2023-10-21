import { useState } from 'react'
import './Contact.css'

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
        <form onSubmit={handleSubmit} className="contact-form">
            <div className="names">
                <div className="input">
                    <label htmlFor="firstName"><span className="required-asterik">*</span> First Name</label>
                    <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input">
                    <label htmlFor="lastName"><span className="required-asterik">*</span> Last Name</label>
                    <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div className="input">
                <label htmlFor="company"><span className="required-asterik">*</span> Company</label>
                <input
                    id="company"
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="input">
                <label htmlFor="email"><span className="required-asterik">*</span> Email</label>
                <input
                    id="email"
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="input">
                <label htmlFor="phoneNumber"><span className="required-asterik">*</span> Phone Number</label>
                <input
                    id="phoneNumber"
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="input message-wrapper">
                <label htmlFor="message">Message</label>
                <input
                    type="text"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                />
            </div>
            <div className="button-wrapper">
                <button type="submit">Submit</button>
            </div>
        </form>
    )
}

export default Contact
