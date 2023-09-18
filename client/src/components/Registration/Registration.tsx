import { useState } from 'react'
import './Registration.css'
import RegistrationData from '../../interfaces/RegistrationData'
import Role from './Role'
import UserServiceAPI from '../../api/userServiceAPI'

const Registration = (props: RegistrationData) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: Role.EMPLOYEE,
        managerCode: ''
    })
    const [error, setError] = useState("");


    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleRoleChange = (option: string) => {
        const roleKey = 'role'
        option === 'Employee'
        ? setFormData(prevState => ({ ...prevState, [roleKey]:  Role.EMPLOYEE}))
        : setFormData(prevState => ({ ...prevState, [roleKey]:  Role.MANAGER}))
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        //need to send this data to user service for register confirmation
        try {
            await UserServiceAPI.getInstance().registerUser(formData);
            alert("Registration was succesful!")
            props.setIsLoggingIn(true)
            setError("");
          } catch (err: any) {
            setError(err.message);
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
                    <p className="blue register-button" onClick={() => props.setIsLoggingIn(true)}>Log in</p>
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
                            className={`role-option left-choice ${formData.role === Role.EMPLOYEE ? 'highlighted' : ''}`}
                            onClick={() => handleRoleChange('Employee')}
                        >
                            Employee
                        </div>
                        <div className="separator"></div>
                        <div
                            className={`role-option right-choice ${formData.role === Role.MANAGER ? 'highlighted' : ''}`}
                            onClick={() => handleRoleChange('Manager')}
                        >
                            Manager
                        </div>
                    </div>
                    {
                        formData.role === Role.EMPLOYEE &&
                        <input 
                            type="text"
                            name="managerCode"
                            onChange={handleChange}
                            placeholder="Manager Code"
                            required
                        />
                    }
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