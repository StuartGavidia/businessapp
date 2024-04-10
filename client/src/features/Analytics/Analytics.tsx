import './Analytics.css'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import BudgetServiceAPI from '../../api/budgetServiceAPI'
import Pagination from 'react-bootstrap/Pagination';
import { useEffect, useState } from 'react';
import { BudgetFormData, StripeAccountData, RegularTransactionFormData } from '../../utils/types';
import { FontWeights } from '@fluentui/react';
import { Button, Navbar, Stack } from 'react-bootstrap';
import BudgetCard from './BudgetCard';
import { loadStripe } from '@stripe/stripe-js';
import AreaChart from './Components/AreaChart';
import BarChart from './Components/BarChart'
import LineChart from './Components/LineChart'
import { render } from '@fullcalendar/core/preact.js';
import { stringify } from 'querystring';
import Table from 'react-bootstrap/Table';
import TransactionModal from './Components/TransactionsModal';
import Budget from '../Budget/Budget';


const Analytics: React.FC = () => {

    const [budgetData, setBudgetData] = useState<BudgetFormData[]>([]);

    const stripePromise = loadStripe('pk_test_51O4uCWFy63ZKr0XeJWxVbfQrS2XQNezYEVSMQGJ1dtBm1EUwnTHdt36jLKOZV4XssTSeiBpLgl9epXFZRSw1EKr500dvZwj033')

    const [hasStripeAccount, setHasStripeAccount] = useState<boolean | null>(null);

    const [stripeAccountBalance, setStripeAccountBalance] = useState(0)

    const [chartStyle, setChartStyle] = useState('line')

    const [showTransactionModal, setShowTransactionModal] = useState(false)

    const [showBudgetModal, setShowBudgetModal] = useState(false)

    const [regularTransactionData, setRegularTransactionData] = useState<RegularTransactionFormData[]>([]);

    /* pagination methods for recharts visualizations */
    const handleNextClick = () => {
        if (chartStyle === 'line') setChartStyle('bar')
        else if (chartStyle === 'bar') setChartStyle('area')
        else if (chartStyle === 'area') setChartStyle('line')

    }

    const handlePrevClick = () => {
        if (chartStyle === 'line') setChartStyle('area')
        else if (chartStyle === 'area') setChartStyle('bar')
        else if (chartStyle === 'bar') setChartStyle('line')

    }

    const renderChart = () => {
        switch (chartStyle) {
            case 'line':
                return <LineChart />
            case 'bar':
                return <BarChart />
            case 'area':
                return <AreaChart />

        }
    }

    useEffect(() => {

        /* checks to see if account exists with stripe; used for conditional rendering of connect button */
        BudgetServiceAPI.getInstance().checkStripeAccountID()
            .then(result => {
                setHasStripeAccount(result);
            })
            .catch(error => {
                console.error('Error checking Stripe Account ID', error);
            });

        /* request account balance through stripe api. Is currently null */
        BudgetServiceAPI.getInstance().getStripeBalance()
            .then(result => {
                setStripeAccountBalance(result.balance)
            })
            .catch(error => {
                console.error('Error retrieving account balance', error)
            })

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

        const fetchRegularTransactionData = async () => {
            try {
                const data = await BudgetServiceAPI.getInstance().getRegularTransactions();
                setRegularTransactionData(data);

            } catch (error) {
                console.log('Error fetching Budget Data:', error);
            }
        };

        fetchRegularTransactionData();

    }, []);

    const createFinancialConnectionSession = async () => {
        try {
            const client_secret = await BudgetServiceAPI.getInstance().createFinancialConnectionSession()

            const stripe = await stripePromise;

            const financialConnectionsSessionResult = await stripe?.collectFinancialConnectionsAccounts({
                clientSecret: client_secret,
            });

            try {

                let accountId = financialConnectionsSessionResult?.financialConnectionsSession?.accounts[0].id
                if (accountId) {
                    let accountData: StripeAccountData = {
                        accountId: accountId
                    };

                    await BudgetServiceAPI.getInstance().storeStripeAccountID(accountData);
                    setHasStripeAccount(true);
                }

            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.log(err.message);
                } else {
                    console.log("An error occurred")
                }
            }

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
                                    ${stripeAccountBalance} {/* Placeholder */}
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
                                        <Col
                                            style={{
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                padding: '10px',
                                                width: 'auto',
                                                borderRadius: '15px',
                                                justifyContent: 'center',
                                            }}>
                                            <Row>
                                                <Pagination>
                                                    <Pagination.Prev onClick={handlePrevClick} />
                                                    <Pagination.Next onClick={handleNextClick} />
                                                </Pagination>
                                                {renderChart()}
                                            </Row>
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
                                    <Col md={12} style={{ fontSize: '20px', fontWeight: 'bold' }}>Budget</Col>
                                </Row>
                                <Row>
                                    <Col className='mt-4'>
                                        <Button variant='dark' size='sm' className='w-100' style={{ marginBottom: '16px' }} onClick={() => setShowBudgetModal(true)}>
                                            Create New Budget
                                        </Button>
                                        <Budget showModal={showBudgetModal} onClose={() => setShowBudgetModal(false)} />
                                        <Button variant='dark' size='sm' className='w-100' style={{ marginBottom: '16px' }} onClick={() => setShowTransactionModal(true)}>
                                            Create New Transaction
                                        </Button>
                                        <TransactionModal showModal={showTransactionModal} onClose={() => setShowTransactionModal(false)} />
                                        {!hasStripeAccount && (
                                            <Button variant='dark' size='sm' className='w-100' style={{ marginBottom: '16px' }} onClick={createFinancialConnectionSession}>
                                                Connect your Bank Account
                                            </Button>
                                        )}
                                        {budgetData.map((budgetItem, index) => {

                                            const regularTransactionsForAccount = regularTransactionData.filter(transaction => transaction.account_name === budgetItem.account_name);

                                            const totalSpend = regularTransactionsForAccount.reduce((total, transaction) => total + transaction.amount, 0);

                                            return (
                                                <BudgetCard
                                                    key={index}
                                                    total_spend={totalSpend}
                                                    account_name={budgetItem.account_name}
                                                    allowance={budgetItem.allowance}
                                                />
                                            );
                                        })}
                                    </Col>
                                </Row>
                                {/* Recent Transactions */}
                                <Row>
                                    <Col className='mt-4' style={{ fontSize: '20px', fontWeight: 'bold' }}>Recent Transactions</Col>
                                </Row>

                                {regularTransactionData.length > 0 ? (
                                    <Row>
                                        <Table style={{
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                            padding: '10px',
                                            borderRadius: '15px',
                                            justifyContent: 'center',
                                        }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ fontWeight: 'bold', border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Account Name</th>
                                                    <th style={{ fontWeight: 'bold', border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Amount</th>
                                                    <th style={{ fontWeight: 'bold', border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Description</th>
                                                </tr>

                                                {regularTransactionData.slice(-5).map((transactionItem, index) => (
                                                    <tr key={index}>
                                                        <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{transactionItem.account_name}</td>
                                                        <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>${transactionItem.amount}</td>
                                                        <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{transactionItem.descriptions}</td>
                                                    </tr>
                                                ))}
                                            </thead>
                                        </Table>
                                    </Row>
                                ) : (
                                    <Row>
                                        <div>No exisiting transactions</div>
                                    </Row>

                                )}
                            </Stack>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Analytics
