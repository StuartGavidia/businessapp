import './Analytics.css'
import { useNavigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import BudgetServiceAPI from '../../api/budgetServiceAPI'
import { useEffect, useState } from 'react';
import { BudgetFormData } from '../../utils/types';


const Analytics:React.FC = () => {

    const navigate = useNavigate();

    const [budgetData, setBudgetData] = useState<BudgetFormData[]>([]);

    const handleButtonClick = () => {
        navigate('/dashboard/budget');
    }

    useEffect(() => {
        const fetchBudgetData = async () => {
            try {
                const data = await BudgetServiceAPI.getInstance().getBudget();
                setBudgetData(data);
            } catch (error) {
                console.log('Error fetching Budget Data:', error);
            }
        };

        fetchBudgetData();
    }, []);

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
                            <div>
                                <ul>
                                    {budgetData.map((budget, index) => (
                                        <li key={index}>
                                            {`Account Name: ${budget.account_name}, Allowance: ${budget.allowance}`}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                </div>
             </div>
        </div>
        
    )
}

export default Analytics
