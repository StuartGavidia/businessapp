import './Analytics.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import BudgetServiceAPI from '../../api/budgetServiceAPI';
import Pagination from 'react-bootstrap/Pagination';
import { useEffect, useState, useCallback } from 'react';
import { BudgetFormData, PlaidTransactionData, RegularTransactionFormData } from '../../utils/types';
import { Button, FormControl, InputGroup, Navbar, Stack } from 'react-bootstrap';
import BudgetCard from './BudgetCard';
import AreaChart from './Components/AreaChart';
import BarChart from './Components/BarChart';
import LineChart from './Components/LineChart';
import { stringify } from 'querystring';
import Table from 'react-bootstrap/Table';
import TransactionModal from './Components/TransactionsModal';
import Budget from '../Budget/Budget';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { usePlaidLink } from "react-plaid-link";
import React from 'react';

const Analytics: React.FC = () => {

    /* Get Last & First Day of Current Month for Plaid Transactions*/
    function isTransactionInCurrentMonth(currTransactionDate: any) {
        // Convert the string date to a Date object
        const transactionDate = new Date(currTransactionDate);

        // Check if the transaction date is in the current month
        const currentDate = new Date();
        return transactionDate.getMonth() === currentDate.getMonth() &&
            transactionDate.getFullYear() === currentDate.getFullYear();
    }

    const [budgetData, setBudgetData] = useState<BudgetFormData[]>([]);
    const [chartStyle, setChartStyle] = useState('area')
    const [showTransactionModal, setShowTransactionModal] = useState(false)
    const [showBudgetModal, setShowBudgetModal] = useState(false)
    const [regularTransactionData, setRegularTransactionData] = useState<RegularTransactionFormData[]>([]);

    /* Pagination Methods for Recharts Visualizations (only using line-chart for now) */

    const renderChart = () => {

        return <LineChart combinedTransactions={combinedTransactions} />

    }

    //State variables for triggering Plaid Link
    const [token, setToken] = useState(null);
    const [balance, setBalance] = useState('');
    const [plaidTransactionData, setPlaidTransactionData] = useState<any[]>([]);
    const [transactionsMap, setTransactionsMap] = useState<Map<string, any[]>>(new Map());
    const [plaidUserCreated, setPlaidUserCreated] = useState(false);
    const [currentTransactionPage, setCurrentTransactionPage] = useState(1)
    const [combinedTransactions, setCombinedTransactions] = useState<any[]>([]);
    const [plaidBudgetsCreated, setPlaidBudgetsCreated] = useState(false);

    const transactionsPerPage = 6;

    const paginateTransactions = (pageNumber: any) => setCurrentTransactionPage(pageNumber);

    const onSuccess = useCallback(async (public_token: any) => {
        await fetch('/analytics/setAccessToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ public_token: public_token })
        });

        await getBalance();

    }, []);

    // Creates a Link token
    const createLinkToken = useCallback(async () => {
        const response = await fetch('/analytics/createLinkToken', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        setToken(data.link_token);
        localStorage.setItem("link_token", data.link_token);

    }, [setToken]);

    // Fetch balance data
    const getBalance = useCallback(async () => {
        const response = await fetch('/analytics/balance', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        setBalance(data.accounts[0].balances.available)

    }, []);

    const config = {
        token,
        onSuccess,
    };

    const { open, ready } = usePlaidLink(config);

    // Fetch Plaid Transaction Data
    const getPlaidTransactionData = async () => {
        const response = await fetch('/analytics/transactions', {
            method: 'GET'
        });
        const data = await response.json();
        var resultArray = []

        for (var i = 0; i < data.length; i++) {
            resultArray.push(data[i])
        }

        setPlaidTransactionData(resultArray)
    };

    const fetchRegularTransactionData = async () => {
        try {
            const data = await BudgetServiceAPI.getInstance().getRegularTransactions();
            setRegularTransactionData(data);

        } catch (error) {
            console.log('Error fetching Budget Data:', error);
        }
    };

    const fetchPlaidUser = async () => {
        try {
            const data = await BudgetServiceAPI.getInstance().fetchPlaidUser();

            if (data.exists === true) {
                setPlaidUserCreated(true)
            } else {
                setPlaidUserCreated(false)
            }

        } catch (error) {
            console.log('Error fetching Plaid User:', error);
        }
    };

    const fetchBudgetData = async () => {
        try {
            const data = await BudgetServiceAPI.getInstance().getBudget();
            setBudgetData(data);
        } catch (error) {
            console.log('Error fetching Budget Data:', error);
        }
    };

    const createPlaidBudgets = async () => {
        try {
            await BudgetServiceAPI.getInstance().createPlaidBudgets(plaidTransactionData);
            setPlaidBudgetsCreated(true);
        } catch (error) {
            console.log('Error fetching Budget Data:', error);
        }
    };

    // Method for formatting and combining Plaid Transactions with Regular Transactions for List
    const createCurrentTransactions = (plaidTransactions: any[], regularTransactions: RegularTransactionFormData[], transactionsPerPage: number) => {

        const formattedPlaidTransactions = plaidTransactions.map(plaidTransaction => ({
            ...plaidTransaction,
            account_name: [plaidTransaction.account_name[0]]
        }));

        const allTransactions = [...regularTransactions, ...formattedPlaidTransactions];

        const indexOfLastTransaction = currentTransactionPage * transactionsPerPage;
        const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;

        const currentTransactions = allTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

        return currentTransactions;
    }

    const createCombinedTransactions = (plaidTransactions: any[], regularTransactions: RegularTransactionFormData[]) => {

        const formattedPlaidTransactions = plaidTransactions.map(plaidTransaction => ({
            ...plaidTransaction,
            amount: Math.abs(plaidTransaction.amount),
            account_name: plaidTransaction.account_name[0]
        }));

        const allTransactions = [...regularTransactions, ...formattedPlaidTransactions];

        return allTransactions;
    }

    const currentTransactions = createCurrentTransactions(plaidTransactionData, regularTransactionData, transactionsPerPage);

    const createTransactionMap = (combinedTransaction: any[]) => {
        const resultMap = new Map();


        combinedTransaction.forEach(transaction => {
            const { transaction_date, ...rest } = transaction;

            if (resultMap.has(transaction_date)) {
                resultMap.get(transaction_date).push(rest);

            } else {
                resultMap.set(transaction_date, [rest]);

            }

        })

        console.log("result map:", resultMap);

        return resultMap;
    }

    // If Link Token doesn't exist, create a Link Token for current user
    useEffect(() => {

        if (token == null) {
            console.log("Link token doesn't exist for user!")
            createLinkToken();
        }
        else {
            console.log("Link token created!")
        }

    }, [ready, open]);

    useEffect(() => {

        createPlaidBudgets();
        fetchBudgetData();
        fetchRegularTransactionData();
        fetchPlaidUser();

    }, []);

    useEffect(() => {

        if (plaidUserCreated === true) {
            getBalance();
            getPlaidTransactionData();
        }
    }, [plaidUserCreated])

    useEffect(() => {
        if (regularTransactionData.length > 0 && plaidTransactionData.length > 0) {
            setCombinedTransactions(createCombinedTransactions(plaidTransactionData, regularTransactionData))
        }
    }, [regularTransactionData, plaidTransactionData])


    return (
        <>
            <Container fluid>
                <Row>
                    {/* Left Column */}
                    <Col md={5}>
                        <Container>
                            <Row>
                                <Col md={12} style={{ fontSize: '20px', fontWeight: 'bold' }}>Available Balance</Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    ${balance}
                                    <Row>
                                        <Col className='mt-4 kpi-container'>
                                            <div style={{ fontWeight: 'bold' }}>Net Income</div>
                                            <div className="mt-2">$14,700</div>

                                        </Col>
                                        <Col className='mt-4 kpi-container'>
                                            <div style={{ fontWeight: 'bold' }}>Expenses</div>
                                            <div className="mt-2">$1,200</div>

                                        </Col>
                                        <Col className='mt-4 kpi-container'>
                                            <div style={{ fontWeight: 'bold' }}> Budget Variance</div>
                                            <div className="mt-2">$-2,555</div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className='mt-4' style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Your Analytics</Col>
                                    </Row>
                                    <Row>
                                        <Col className='recharts-component'>
                                            <Row>
                                                {/* Include a base case if transactions don't exist */}
                                                {/* Render Area Chart */}
                                                {combinedTransactions &&
                                                    renderChart()}
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Container>
                    </Col>

                    {/* Transactions Column */}
                    <Col md={3}>
                        <Container>
                            <Stack gap={4}>
                                <Row>
                                    <Col md={12} style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>Transactions</Col>
                                </Row>
                                <Row>
                                    <Col className='mt-4'>
                                        {/* If Plaid User Exists, Display Button */}
                                        {!plaidUserCreated &&
                                            <Button variant='outline-dark' size='sm' style={{ marginBottom: '-15px' }} className='w-100' onClick={() => open()}>
                                                Connect your Bank Account
                                            </Button>
                                        }

                                        {/* Search Transaction Form */}
                                        <Form>
                                            <div style={{ marginTop: '-18px' }}>
                                                <Form.Group controlId="account_name" className="mb-3" style={{ borderRadius: '5px', width: '100%' }}>
                                                    {/* Expense Description */}
                                                    <Form.Group controlId="description" className="mb-3">
                                                        <Form.Label className="mb-3 prompt-label"></Form.Label>
                                                        <InputGroup>
                                                            <Button style={{ backgroundColor: '#3a4d39' }}>
                                                                <FontAwesomeIcon icon={faSearch} />
                                                            </Button>

                                                            <FormControl
                                                                type="text"
                                                                name="descriptions"
                                                                placeholder="Search"
                                                                style={{ border: '1px solid black', borderRadius: '0 5px 5px 0' }}
                                                            />
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Form.Group>
                                            </div>
                                        </Form>
                                        {/* Search Transaction Form */}

                                        {/* Create New Transaction Button */}

                                        <Button variant='outline-dark' size='sm' className='w-100' style={{ marginBottom: '5px' }} onClick={() => setShowTransactionModal(true)}>
                                            Add a New Transaction
                                        </Button>

                                        <TransactionModal showModal={showTransactionModal} onClose={() => setShowTransactionModal(false)} />

                                        {/* Create New Transaction Button */}

                                    </Col>
                                </Row>
                                {/* Recent Transactions */}

                                {regularTransactionData.length > 0 && plaidTransactionData.length > 0 ? (
                                    <Row>
                                        <div className="transactions-container">
                                            <nav className="pagination-container">
                                                <ul className="pagination">
                                                    {Array.from({ length: Math.ceil((plaidTransactionData.length + regularTransactionData.length) / transactionsPerPage) }).map((_, index) => (
                                                        <li key={index} className={`page-item ${currentTransactionPage === index + 1 ? 'active' : ''}`}>
                                                            <button className="page-link" onClick={() => paginateTransactions(index + 1)}>{index + 1}</button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </nav>
                                            <table className='recent-transaction-container'>
                                                <tbody>
                                                    {currentTransactions.map((transactionItem, index) => (
                                                        <tr key={index}>
                                                            <td className='recent-transaction-item padded-cell'>{transactionItem.descriptions}</td>
                                                            <td className='recent-transaction-item padded-cell'>{transactionItem.account_name}</td>
                                                            <td className='recent-transaction-item padded-cell'>{transactionItem.transaction_date}</td>
                                                            <td className='transaction-amount padded-cell'>${Math.abs(transactionItem.amount)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Row>
                                ) : (
                                    <Row>
                                        <div>No exisiting transactions</div>
                                    </Row>
                                )}

                                {regularTransactionData.length > 0 && plaidTransactionData.length < 0 ? (
                                    <table className='recent-transaction-container'>
                                        <tbody>
                                            {regularTransactionData.slice(-5).map((transactionItem, index) => (
                                                <tr key={index}>
                                                    <td className='recent-transaction-item padded-cell'>{transactionItem.descriptions}</td>
                                                    <td className='recent-transaction-item padded-cell'>{transactionItem.account_name}</td>
                                                    <td className='transaction-amount padded-cell'>${transactionItem.amount}</td>
                                                </tr>

                                            ))}
                                        </tbody>
                                    </table>

                                ) : (
                                    <Row>
                                        <div>{ /* No Transactions Exist? */}</div>
                                    </Row>
                                )}

                            </Stack>
                        </Container>
                    </Col>

                    {/* Budget Column */}
                    <Col md={3}>
                        <Container>
                            <Stack gap={4}>
                                <Row>
                                    <Col md={12} style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>Categories</Col>
                                </Row>
                                <Row style={{ marginTop: '7px' }}>
                                    <Col className='mt-4'>
                                        <Button variant='outline-dark' size='sm' className='w-100' style={{ marginBottom: '15px' }} onClick={() => setShowBudgetModal(true)}>
                                            Create a New Budget
                                        </Button>
                                        <Budget showModal={showBudgetModal} onClose={() => setShowBudgetModal(false)} />
                                        {plaidTransactionData.length > 0 && (
                                            budgetData.map((budgetItem, index) => {

                                                const regularTransactionsForAccount = combinedTransactions.filter(transaction => transaction.account_name === budgetItem.account_name
                                                    &&
                                                    isTransactionInCurrentMonth(transaction.transaction_date)
                                                );

                                                const totalSpend = regularTransactionsForAccount.reduce((total, transaction) => total + transaction.amount, 0);

                                                return (
                                                    <BudgetCard
                                                        key={index}
                                                        total_spend={totalSpend}
                                                        account_name={budgetItem.account_name}
                                                        allowance={budgetItem.allowance}
                                                    />
                                                );
                                            })
                                        )}
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
