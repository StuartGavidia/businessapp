import React, { useState } from 'react'
import './SignIn.css'
import SignInData from '../../interfaces/SignInData'
import UserServiceAPI from '../../api/userServiceAPI'
import { useNavigate } from 'react-router-dom'

const SignIn = (props: SignInData) => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    })
    const [error, setError] = useState("")

    const handleChange = (e: any) => {
        const { name, type } = e.target;
        const value = type === 'checkbox' ? e.target.checked : e.target.value;

        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log(formData)
        //need to send this data to user service for login confirmation
        try {
            await UserServiceAPI.getInstance().loginUser(formData);
            alert("Login succesful!")
            props.setIsLoggingIn(true)
            setError("");
            navigate("/dashboard")
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
                    <p className="register-header">Sign in to tache</p>
                    <p className="blue register-button" onClick={() => props.setIsLoggingIn(false)}>Register</p>
                </div>
                <form onSubmit={handleSubmit} className="signin-form">
                    <input 
                        type="text"
                        name="username"
                        onChange={handleChange}
                        placeholder="Username"
                        required
                    />
                    <input 
                        type="text"
                        name="password"
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />
                    <div className="signin-form-extrainfo">
                        <div className="signin-input">
                            <input 
                                id="remember-me" 
                                type="checkbox"
                                name="rememberMe"
                                onChange={handleChange}
                            />
                            <label htmlFor="remember-me">Remember Me</label>
                        </div>
                        <p className="blue">Forgot your password?</p>
                    </div>
                    {
                        error &&
                        <p className="error-message">{error}</p>
                    }
                    <button className="signin-form-button">Sign In</button>
                </form>
            </div>
        </div>
    )
}

export default SignIn