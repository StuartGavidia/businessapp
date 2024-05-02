import './Analytics.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import BudgetServiceAPI from '../../api/budgetServiceAPI';
import Pagination from 'react-bootstrap/Pagination';
import { useEffect, useState, useCallback } from 'react';
import { BudgetFormData, PlaidTransactionData, RegularTransactionFormData } from '../../utils/types';
import { Button, FormControl, InputGroup, Stack, Accordion } from 'react-bootstrap';
import BudgetCard from './BudgetCard';
import BarChart from './Components/BarChart';
import LineChart from './Components/LineChart';
import PieChart from './Components/PieChart';
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
    const isTransactionInCurrentMonth = (currTransactionDate: any) => {
        const transactionDate = new Date(currTransactionDate);

        const currentDate = new Date();
        return transactionDate.getMonth() === currentDate.getMonth() &&
            transactionDate.getFullYear() === currentDate.getFullYear();
    }

    /* Current Budget Month */
    const today = new Date();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const currentMonth = months[today.getMonth()];
    const currentYear = today.getFullYear()

    const [budgetData, setBudgetData] = useState<BudgetFormData[]>([]);
    const [showTransactionModal, setShowTransactionModal] = useState(false)
    const [showBudgetModal, setShowBudgetModal] = useState(false)
    const [regularTransactionData, setRegularTransactionData] = useState<RegularTransactionFormData[]>([]);
    const [token, setToken] = useState(null);
    const [balance, setBalance] = useState('');
    const [plaidTransactionData, setPlaidTransactionData] = useState<any[]>([]);
    const [plaidUserCreated, setPlaidUserCreated] = useState(false);
    const [currentTransactionPage, setCurrentTransactionPage] = useState(1)
    const [combinedTransactions, setCombinedTransactions] = useState<any[]>([]);
    const [plaidBudgetsCreated, setPlaidBudgetsCreated] = useState(false);
    const [spendStats, setSpendStats] = useState({ totalSpendLastMonth: 0, totalSpendThisMonth: 0 })
    const [chartStyle, setChartStyle] = useState('line')

    /* Pagination Methods for Recharts Visualizations (only using line-chart for now) */

    const renderLineChart = () => {
        return <LineChart combinedTransactions={combinedTransactions} />

    }

    const renderPieChart = () => {
        return <PieChart combinedTransactions={combinedTransactions} />
    }

    const handleNextClick = () => {
        if (chartStyle === 'line') setChartStyle('bar')
        else if (chartStyle === 'bar') setChartStyle('line')

    }

    const handlePrevClick = () => {
        if (chartStyle === 'line') setChartStyle('bar')
        else if (chartStyle === 'bar') setChartStyle('line')

    }

    const renderChart = () => {
        switch (chartStyle) {
            case 'line':
                return <LineChart combinedTransactions={combinedTransactions} />
            case 'bar':
                return <BarChart combinedTransactions={combinedTransactions} />

        }
    }

    const transactionsPerPage = 8;

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

        console.log("plaid transactions", data)

        for (var i = 0; i < data.length; i++) {
            resultArray.push(data[i])
        }

        const transactions = [
            { account_name: ['Travel'], amount: -250, descriptions: 'United Airlines', transaction_date: 'Thu, 1 May 2024' },
            { account_name: ['Travel'], amount: 5.4, descriptions: 'Uber 063015 SF**POOL**', transaction_date: 'Thu, 1 May 2024' },
            { account_name: ['Travel'], amount: 6.33, descriptions: 'Uber 072515 SF**POOL**', transaction_date: 'Thu, 1 May 2024' },
            { account_name: ['Food and Drink'], amount: 89.4, descriptions: 'Starbucks', transaction_date: 'Thu, 1 May 2024' }
        ];

        for (let i = 0; i < transactions.length; i++) {
            const transaction = transactions[i];
            resultArray.push(transaction);
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
            console.log(budgetData)
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

        if (plaidTransactions.length > 0) {
            const formattedPlaidTransactions = plaidTransactions.map(plaidTransaction => ({
                ...plaidTransaction,
                account_name: [plaidTransaction.account_name[0]]
            }));

            const allTransactions = [...regularTransactions, ...formattedPlaidTransactions];
            const sortedTransactions = allTransactions.sort((a, b) => {
                // Assuming both regular and Plaid transactions have a 'transaction_date' field
                const dateA = new Date(a.transaction_date).getTime();
                const dateB = new Date(b.transaction_date).getTime();

                // Sorting in descending order by date
                return dateB - dateA;
            });

            const indexOfLastTransaction = currentTransactionPage * transactionsPerPage;
            const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;

            // Slice the sorted transactions to get the transactions for the current page
            const currentTransactions = sortedTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

            return currentTransactions;

        } else {

            const allTransactions = [...regularTransactions];
            const indexOfLastTransaction = currentTransactionPage * transactionsPerPage;
            const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
            const currentTransactions = allTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

            return currentTransactions
        }
    }

    const createCombinedTransactions = (plaidTransactions: any[], regularTransactions: RegularTransactionFormData[]) => {

        if (plaidTransactions.length > 0) {
            const formattedPlaidTransactions = plaidTransactions.map(plaidTransaction => ({
                ...plaidTransaction,
                amount: Math.abs(plaidTransaction.amount),
                account_name: plaidTransaction.account_name[0]
            }));

            const allTransactions = [...regularTransactions, ...formattedPlaidTransactions];

            console.log("Spend Stats", allTransactions)

            return allTransactions;

        } else {

            const allTransactions = [...regularTransactions];

            return allTransactions;

        }
    }

    const createSpendStats = (combinedTransactions: any[]) => {
        const today = new Date();

        // Create array containing transactions from current month
        const currentMonthTransactions = combinedTransactions.filter((transaction: any) => {
            const transactionDate = new Date(transaction.transaction_date);

            return (
                transactionDate.getMonth() === today.getMonth() &&
                transactionDate.getFullYear() === today.getFullYear()
            );
        });

        // Create array containing transactions from last month
        const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthTransactions = combinedTransactions.filter((transaction: any) => {
            const transactionDate = new Date(transaction.transaction_date);

            return (
                transactionDate.getMonth() === firstDayOfLastMonth.getMonth() &&
                transactionDate.getFullYear() === firstDayOfLastMonth.getFullYear()
            )
        })

        const totalSpendLastMonth = lastMonthTransactions.reduce((total: any, transaction: any) => total + transaction.amount, 0);
        const totalSpendThisMonth = currentMonthTransactions.reduce((total: any, transaction: any) => total + transaction.amount, 0);

        return {
            totalSpendLastMonth,
            totalSpendThisMonth
        };
    }

    const currentTransactions = createCurrentTransactions(plaidTransactionData, regularTransactionData, transactionsPerPage);

    // If Link Token doesn't exist, create a Link Token for current user
    useEffect(() => {

        if (token == null) {
            createLinkToken();
        }
        else {
            console.log("Link token created!")
        }

    }, [ready, open]);

    useEffect(() => {

        fetchBudgetData();
        fetchRegularTransactionData();
        fetchPlaidUser();

    }, [plaidBudgetsCreated, plaidUserCreated]);

    useEffect(() => {

        createPlaidBudgets();

    }, [plaidTransactionData])

    useEffect(() => {

        if (plaidUserCreated === true) {
            getBalance();
            getPlaidTransactionData();
        }
    }, [plaidUserCreated])

    useEffect(() => {
        if (regularTransactionData.length > 0 || plaidTransactionData.length > 0) {
            setCombinedTransactions(createCombinedTransactions(plaidTransactionData, regularTransactionData))
        }
        console.log(regularTransactionData)
    }, [regularTransactionData, plaidTransactionData])

    useEffect(() => {
        setSpendStats(createSpendStats(combinedTransactions))

    }, [combinedTransactions])

    useEffect(() => {
        console.log("Spend Stats", spendStats)

    }, [spendStats])


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
                                            <div className="mt-2"><span style={{ fontWeight: 'bold' }}>${spendStats.totalSpendThisMonth.toFixed(0)}</span> spent</div>
                                            <Row>
                                                <div className="mt-2"><span style={{ fontWeight: 'bold' }}>${spendStats.totalSpendLastMonth.toFixed(0)}</span> spent last month</div>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className='mt-4' style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>{currentMonth}, {currentYear}</Col>
                                    </Row>
                                    <Row>
                                        <Col className='recharts-component'>
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
                                            <Button variant='outline-dark' size='sm' style={{ marginBottom: '2px' }} className='w-100' onClick={() => open()}>
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

                                {regularTransactionData.length > 0 || plaidTransactionData.length > 0 ? (
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
                                                <thead>
                                                    <tr>
                                                        <th className='recent-transaction-header padded-cell'>Vendor</th>
                                                        <th className='recent-transaction-header padded-cell'>Account</th>
                                                        <th className='recent-transaction-header padded-cell'>Date</th>
                                                        <th className='transaction-amount padded-cell'>Amount</th>
                                                    </tr>
                                                </thead>
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
                                        <Row>
                                            <Col className='mt-4' style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'right', marginRight: '10px' }}> {`${currentMonth}, ${currentYear}`}</Col>
                                        </Row>

                                        {budgetData.length > 0 ? (
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
                                                        currentMonthTransactions={regularTransactionsForAccount}
                                                    />
                                                );
                                            })

                                        ) : (
                                            <Row>
                                                <div>No exisiting budgets</div>
                                            </Row>

                                        )}
                                    </Col>
                                </Row>
                                {combinedTransactions.length > 0 &&
                                    <Row>
                                        <Col className='recharts-component'> <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Cost Allocation</div>
                                            <Row>
                                                {/* Include a base case if transactions don't exist */}
                                                {/* Render Area Chart */}

                                                {renderPieChart()}
                                            </Row>
                                        </Col>
                                    </Row>
                                }
                            </Stack>
                        </Container>
                    </Col>

                </Row>
            </Container>
        </>
    )
}

export default Analytics
