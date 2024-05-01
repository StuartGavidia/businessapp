import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import BudgetServiceAPI from '../../../api/budgetServiceAPI'
import React, { ChangeEvent } from 'react'
import { BudgetFormData } from '../../../utils/types'
import Nav from 'react-bootstrap/Nav'

interface ModalProps {
    showModal: boolean
    onClose: () => void
}

const TransactionModal: React.FC<ModalProps> = ({ showModal, onClose }) => {

    const [budgetData, setBudgetData] = useState<BudgetFormData[]>([]);

    const [regularTransactionFormData, setRegularTransactionFormData] = useState({
        account_name: '',
        amount: 0,
        descriptions: ''
    });

    const [incomeTransactionFormData, setIncomeTransactionFormData] = useState({
        amount: 0,
        descriptions: ''
    })

    const [regularTransactionCreated, setRegularTransactionCreated] = useState(false)

    const [selectedTransactionType, setSelectedTransactionType] = useState('Regular')

    const handleRegularSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await BudgetServiceAPI.getInstance().createRegularTransaction(regularTransactionFormData);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err.message);
            } else {
                console.log("An error occurred")
            }
        }

        setTimeout(() => {
            setRegularTransactionCreated(true);
        }, 150);

    };

    const handleIncomeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await BudgetServiceAPI.getInstance().createIncomeTransaction(incomeTransactionFormData)
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err.message);
            } else {
                console.log("An error occurred")
            }
        }
    };


    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const {name, value} = e.target;

        if (selectedTransactionType === 'Regular') {
            setRegularTransactionFormData(prevState => ({ ...prevState, [name]: value }));

        } else {
            setIncomeTransactionFormData(prevState => ({ ...prevState, [name]: value }))
        }
    };

    useEffect(() => {

        const fetchBudgetData = async () => {
            try {
                const data = await BudgetServiceAPI.getInstance().getBudget();
                setBudgetData(data);

                if (data.length > 0) {
                    setRegularTransactionFormData(prevState => ({
                        ...prevState,
                        account_name: data[0].account_name
                    }));
                }
            } catch (error) {
                console.log('Error fetching Budget Data:', error);
            }
        };

        fetchBudgetData();
    }, []);


    return (
        <Modal show={showModal} onHide={onClose} aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Body>
                <div className="transaction-content" style={{ width: "100%", maxWidth: "450px", border: 'none' }}>
                    <Nav fill variant='underline' >
                        <Nav.Item>
                            <Nav.Link onClick={() => setSelectedTransactionType('Regular')} eventKey='link-1'>Regular</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={() => setSelectedTransactionType('Income')} eventKey='link-2'>Income</Nav.Link>
                        </Nav.Item>
                    </Nav>

                    {selectedTransactionType === 'Regular' ? (

                        <Form onSubmit={handleRegularSubmit}>
                            <div style={{ marginBottom: '25px' }}>
                                <Form.Group controlId="account_name" className="mb-3" style={{ border: '1px solid black', borderRadius: '5px' }} >
                                    <Form.Select onChange={handleChange} value={regularTransactionFormData.account_name} name="account_name">
                                        {budgetData.length === 0 ? (
                                            <option>No existing budgets..</option>
                                        ) : (
                                            <>
                                                {budgetData.map((budgetItem, index) =>
                                                    <option key={index} value={budgetItem.account_name}>{budgetItem.account_name}</option>
                                                )}
                                            </>
                                        )}
                                    </Form.Select>
                                </Form.Group>
                            </div>

                            {/* Select Amount Spent */}
                            <Form.Group controlId="number" className="mb-3" style={{ marginTop: '15px' }}>
                                <InputGroup>
                                    <InputGroup.Text>$</InputGroup.Text>
                                    <Form.Control
                                        type="number"
                                        name="amount"
                                        placeholder="0"
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                                        required
                                        style={{ border: '1px solid black' }} />
                                </InputGroup>
                            </Form.Group>

                            {/* Expense Description */}
                            <Form.Group controlId="description" className="mb-3">
                                <Form.Label className="mb-3 prompt-label"></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="descriptions"
                                    placeholder=" e.g. Google Cloud Expenses"
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                                    required
                                    style={{ border: '1px solid black', marginTop: '-14px' }} />
                            </Form.Group>
                            <Button variant="dark" type="submit" className="w-100">
                                Save
                            </Button>
                        </Form>

                    ) :

                        <Form onSubmit={handleIncomeSubmit}>
                            {/* Select Amount Spent */}
                            <Form.Group controlId="number" className="mb-3">
                                <InputGroup>
                                    <InputGroup.Text>$</InputGroup.Text>
                                    <Form.Control
                                        type="number"
                                        name="amount"
                                        placeholder="0"
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                                        required
                                        style={{ border: '1px solid black' }} />
                                </InputGroup>
                            </Form.Group>

                            {/* Expense Description */}
                            <Form.Group controlId="description" className="mb-3">
                                <Form.Label className="mb-3 prompt-label"></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="descriptions"
                                    placeholder="e.g. Paid for Services"
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                                    required
                                    style={{ border: '1px solid black', marginTop: '-14px' }} />
                            </Form.Group>
                            <Button variant="dark" type="submit" className="w-100">
                                Save
                            </Button>
                        </Form>
                    }

                </div>
                <div style={{ marginTop: '10px' }}>{regularTransactionCreated && <p>Transaction created!</p>}</div>
            </Modal.Body>
        </Modal>
    )

}

export default TransactionModal;