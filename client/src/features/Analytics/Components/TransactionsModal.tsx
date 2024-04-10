import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import BudgetServiceAPI from '../../../api/budgetServiceAPI'
import React, { ChangeEvent } from 'react'
import { BudgetFormData } from '../../../utils/types'

interface ModalProps {
    showModal: boolean
    onClose: () => void
}

const TransactionModal: React.FC<ModalProps> = ({ showModal, onClose }) => {

    const [budgetData, setBudgetData] = useState<BudgetFormData[]>([]);

    const [transactionFormData, setTransactionFormData] = useState({
        account_name: "",
        amount: 0,
        descriptions: ""
    });

    const [transactionCreated, setTransactionCreated] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(transactionFormData);

        try {
            await BudgetServiceAPI.getInstance().createTransaction(transactionFormData);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err.message);
            } else {
                console.log("An error occurred")
            }
        }

        setTimeout(() => {
            setTransactionCreated(true);
        }, 150);

    };

    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;

        setTransactionFormData(prevState => ({ ...prevState, [name]: value }));
    };

    useEffect(() => {

        const fetchBudgetData = async () => {
            try {
                const data = await BudgetServiceAPI.getInstance().getBudget();
                setBudgetData(data);
        
                if (data.length > 0) {
                    setTransactionFormData(prevState => ({
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
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Create New Transaction</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="transaction-content" style={{ width: "100%", maxWidth: "450px", border: 'none' }}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="account_name" className="mb-3">
                            <Form.Label className="mb-3 prompt-label">Select an Account</Form.Label>
                            <Form.Select onChange={handleChange} value={transactionFormData.account_name} name="account_name">
                                {budgetData.length === 0 ? (
                                    <option>No Existing Budgets</option>
                                ) : (
                                    <>
                                        {budgetData.map((budgetItem, index) =>
                                            <option key={index} value={budgetItem.account_name}>{budgetItem.account_name}</option>
                                        )}
                                    </>
                                )}
                            </Form.Select>
                        </Form.Group>

                        {/* Select Amount Spent */}
                        <Form.Group controlId="number" className="mb-3">
                            <Form.Label className="mb-3 prompt-label">How much did you spend?</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    name="amount"
                                    placeholder="0"
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                                    required />
                            </InputGroup>
                        </Form.Group>

                        {/* Expense Description */}
                        <Form.Group controlId="description" className="mb-3">
                            <Form.Label className="mb-3 prompt-label">Enter transaction description</Form.Label>
                            <Form.Control
                                type="text"
                                name="descriptions"
                                placeholder="Software Renewal"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                                required />
                        </Form.Group>
                        <Button variant="dark" type="submit" className="w-100">
                            Save
                        </Button>
                    </Form>
                </div>
                {transactionCreated && <p>Transaction created!</p>}
            </Modal.Body>
        </Modal>
    )

}

export default TransactionModal;