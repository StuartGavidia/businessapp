import './Analytics.css'
import { useNavigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

const Analytics:React.FC = () => {

    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/dashboard/budget');
    }

    return (
        <div className="analytics-content">
            <h1>Analytics Feature</h1>
            <div className="container">
                <div className="row">
                        <div className="col-md-9">
                        <div className="container px-4">
                            <div className="row gx-5">
                                <div className="col">
                                    <div className="p-3 border bg-light">Net Income: $51,000</div>
                                </div>
                                <div className="col">
                                    <div className="p-3 border bg-light">Expenses: $27,000</div>
                                </div>
                                <div className="col">
                                    <div className="p-3 border bg-light">Budget Variance: -$1,400 </div>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="create-budget">
                            <Outlet />
                                <button type="button" className="btn btn-outline-primary" onClick={handleButtonClick}>Create Budget</button>
                            </div>
                        </div>
                </div>
             </div>
        </div>
        
    )
}

export default Analytics
