import './Analytics.css'
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import BudgetServiceAPI from '../../api/budgetServiceAPI'
import { useEffect, useState } from 'react';
import { BudgetFormData } from '../../utils/types';
import { FontWeights } from '@fluentui/react';
import { Accordion, Button, Stack } from 'react-bootstrap';
import BudgetCard from './BudgetCard'
import { loadStripe } from '@stripe/stripe-js'

const Analytics: React.FC = () => {

    const navigate = useNavigate();

    const [budgetData, setBudgetData] = useState<BudgetFormData[]>([]);

    const stripePromise = loadStripe('pk_test_51O4uCWFy63ZKr0XeJWxVbfQrS2XQNezYEVSMQGJ1dtBm1EUwnTHdt36jLKOZV4XssTSeiBpLgl9epXFZRSw1EKr500dvZwj033')

    const handleButtonClick = () => {
        navigate('/dashboard/budget');
    }

    useEffect(() => {
        const createStripeCustomer = async () => {

            try {
                await BudgetServiceAPI.getInstance().createStripeCustomer();
                console.log('Stripe Customer created successfully')

            } catch (error: any) {
                if (error.response && error.response.data && error.response.data.success === true) {

                    console.log('Stripe Customer already exists')

                } else {
                    console.log('Error creating Stripe Customer', error)
                }
            }

        };

        createStripeCustomer();

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

    const createFinancialConnectionSession = async () => {
        try {
            const client_secret = await BudgetServiceAPI.getInstance().createFinancialConnectionSession()

            const stripe = await stripePromise;

            const financialConnectionsSessionResult = await stripe?.collectFinancialConnectionsAccounts({
                clientSecret: client_secret,
              });

            console.log("Accounts Collected:", financialConnectionsSessionResult)

              // Perform Different Actions w/ financialConnectionsSessionResult
            
        } catch (error) {

            console.error('Error initiating Financial Connections session:', error);
        }
    }

    return (
        <>
            <Container fluid>
                <Row>
                    {/* Left Column */}
                    <Col md={8}>
                        <Container>
                            <Row>
                                <Col md={12} style={{ fontSize: '20px', fontWeight: 'bold' }}>Available Balance</Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    $999,999.00 {/* Placeholder */}
                                    <Row>
                                        <Col className="mt-4"
                                            style={{
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                padding: '10px',
                                                width: 'auto',
                                                borderRadius: '15px',
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                marginRight: '20px'
                                            }}><div>
                                                <div style={{ fontWeight: 'bold' }}>Net Income</div>
                                                <div className="mt-2">$14,700</div>
                                            </div>
                                        </Col>
                                        <Col className="mt-4"
                                            style={{
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                padding: '10px',
                                                width: 'auto',
                                                borderRadius: '15px',
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                marginRight: '20px'
                                            }}><div>
                                                <div style={{ fontWeight: 'bold' }}>Expenses</div>
                                                <div className="mt-2">$1,200</div>
                                            </div>
                                        </Col>
                                        <Col className="mt-4"
                                            style={{
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                padding: '10px',
                                                width: 'auto',
                                                borderRadius: '15px',
                                                justifyContent: 'center',
                                                textAlign: 'center'
                                            }}>
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}> Budget Variance</div>
                                                <div className="mt-2">$-2,555</div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className='mt-4' style={{ fontSize: '20px', fontWeight: 'bold' }}>Your Analytics</Col>
                                    </Row>
                                    <Row>
                                        <Col md={4}
                                            style={{
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                padding: '10px',
                                                width: 'auto',
                                                borderRadius: '15px',
                                                justifyContent: 'center',
                                            }}>
                                            Income & Expenses
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Container>
                    </Col>

                    {/* Right Column */}
                    <Col md={4}>
                        <Container>
                            <Stack gap={4}>
                                <Row>
                                    <Col md={12} style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>Budget</Col>
                                </Row>
                                <Row>
                                    <Col className='mt-4'>
                                        <Outlet />
                                        <Button variant="dark" size="sm" className='w-100' style={{marginBottom: '16px'}} onClick={handleButtonClick}>
                                            Create New Budget
                                        </Button>
                                        <Button variant="dark" size="sm" className='w-100' style={{marginBottom: '16px'}} onClick={createFinancialConnectionSession}>
                                            Connect your Bank Account
                                        </Button>

                                         {budgetData.map((budgetItem, index) => (
                                            <BudgetCard
                                            key={index}
                                            total_spend={700}
                                            account_name={budgetItem.account_name}
                                            allowance={budgetItem.allowance}
                                            />
                                         ))}
                                    </Col>
                                </Row>
                            </Stack>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Analytics
