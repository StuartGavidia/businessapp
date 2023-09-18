import React, { useEffect } from 'react'
import './NotFoundPage.css'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        setTimeout(() => {
            navigate("/")
        }, 3000)
    })

    return (
        <div>
            <h1>404</h1>
        </div>
    )
}

export default NotFoundPage