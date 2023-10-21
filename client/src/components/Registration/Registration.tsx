import { useState } from 'react'
import './Registration.css'
import UserServiceAPI from '../../api/userServiceAPI'
import RegistrationProps from '../../interfaces/RegistrationProps'

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
        <div className="signin-page-component">
            <div className="signin-page-wrapper">
                <div className="signin-logo-wrapper">
                    <img src="./assets/images/businessLogo.png" alt="Pro Connect Business Logo"/>
                    <p>tache</p>
                </div>
                <div className="register">
                    <p className="register-header">Register to tache</p>
                    <p className="blue register-button" onClick={() => setIsLoggingIn(true)}>Log in</p>
                </div>
                <form onSubmit={handleSubmit} className="signin-form">
                    <input 
                        type="text"
                        name="firstName"
                        onChange={handleChange}
                        placeholder="First Name"
                        required
                    />
                    <input 
                        type="text"
                        name="lastName"
                        onChange={handleChange}
                        placeholder="Last Name"
                        required
                    />
                    <input 
                        type="text"
                        name="username"
                        onChange={handleChange}
                        placeholder="Username"
                        required
                    />
                    <input 
                        type="email"
                        name="email"
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                    <input 
                        type="text"
                        name="password"
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />
                    <input 
                        type="text"
                        name="confirmPassword"
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        required
                    />
                    <div className="role-wrapper">
                        <div
                            className={`role-option left-choice ${!formData.hasDirectReports ? 'highlighted' : ''}`}
                            onClick={() => toggleDirectReports(false)}
                        >
                            I have no Direct Reports
                        </div>
                        <div className="separator"></div>
                        <div
                            className={`role-option right-choice ${formData.hasDirectReports ? 'highlighted' : ''}`}
                            onClick={() => toggleDirectReports(true)}
                        >
                            I have Direct Reports
                        </div>
                    </div>
                    <input 
                        type="text"
                        name="managerCode"
                        onChange={handleChange}
                        placeholder="Manager Code"
                        required
                    />
                    <input 
                        type="text"
                        name="positionName"
                        onChange={handleChange}
                        placeholder="Position Name (ex: Builder, Chef, Manager ... )"
                        required
                    />
                    <input 
                        type="text"
                        name="companyCode"
                        onChange={handleChange}
                        placeholder="Company Code"
                        required
                    />
                    {
                        error &&
                        <p className="error-message">{error}</p>
                    }
                    <button className="signin-form-button">Register</button>
                </form>
            </div>
        </div>
    )
}

export default Registration