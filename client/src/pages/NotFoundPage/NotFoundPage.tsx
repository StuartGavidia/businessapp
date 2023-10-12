import { useEffect } from 'react'
import './NotFoundPage.css'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/")
        }, 3000)

        return () => {
            clearTimeout(timer)
        }
    }, [])

    return (
        <div>
            <h1>404</h1>
        </div>
    )
}

export default NotFoundPage