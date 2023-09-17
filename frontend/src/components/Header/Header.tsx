import React from 'react'
import './Header.css'
import { NavLink } from 'react-router-dom'

const Header = () => {

    function scrollToProjects(sectionId: string){
        setTimeout(() => {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 300)
    }

    return (
        <div className="header">
            <div className="header-start">
                <div className="logo-wrapper">
                    <img src="./assets/images/businessLogo.png" className="logo"/>
                    <p>tache</p>
                </div>
                <div className="nav-page">
                    <NavLink to="/" className="link" onClick={() => scrollToProjects('features')}>Features</NavLink>
                    <NavLink to="/" className="link" onClick={() => scrollToProjects('prices')}>Pricing</NavLink>
                    <NavLink to="/" className="link" onClick={() => scrollToProjects('contact')}>Contact</NavLink>
                </div>
            </div>
            <NavLink className="signin-component" to="/signin">
                <button className="signin-nav-button">Sign in/Up</button>
            </NavLink>
        </div>
    )
}

export default Header