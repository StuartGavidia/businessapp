import { useState } from 'react'
import './SignInPage.css'
import SignIn from '../../components/SignIn/SignIn'
import Registration from '../../components/Registration/Registration'

const SignInPage = () => {

    const [isLoggingIn, setIsLoggingIn] = useState(true)

    return (
        <div className="container">
            <div className="half form-container">
                {
                    isLoggingIn
                    ? <SignIn setIsLoggingIn={setIsLoggingIn}/>
                    : <Registration setIsLoggingIn={setIsLoggingIn}/>
                }
            </div>
            <div className="half info-container">
                
            </div>
        </div>
    )
}

export default SignInPage