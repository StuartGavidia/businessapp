import './Budget.css'
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import BudgetServiceAPI from '../../api/budgetServiceAPI'
import { Calendar } from 'react-date-range'
import CalendarComp from './Components/CalendarComp.tsx'
import { FormControl } from 'react-bootstrap'
import format from 'date-fns/format'
import React, { ChangeEvent } from 'react'
import './Components/CalendarComp.css'
import Modal from 'react-bootstrap/Modal'

interface ModalProps {

    showModal: boolean
    onClose: () => void

}

const Budget: React.FC<ModalProps> = ({ showModal, onClose }) => {
    const [formData, setFormData] = useState({
        account_name: "",
        allowance: 0


    })

    const [budgetCreated, setBudgetCreated] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | Date) => {
        if (e instanceof Date) {
            // Handle Date input
            const formattedDate = format(e, "yyyy-MM-dd");
            setFormData(prevState => ({ ...prevState, budget_date: formattedDate }));
        } else {
            // Handle non-Date inputs
            const { name, type } = e.target;
            const value = type === 'radio'
                ? e.currentTarget.value === "monthly"
                    ? 12
                    : e.currentTarget.value === "quarterly"
                        ? 4
                        : 1
                : type === 'number'
                    ? parseFloat(e.target.value)
                    : e.target.value;

            setFormData(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);

        try {
            await BudgetServiceAPI.getInstance().createBudget(formData);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err.message);
            } else {
                console.log("An error occurred")
            }
        }

        setTimeout(() => {
            setBudgetCreated(true);
        }, 150);

    };

    return (
        <Modal show={showModal} onHide={onClose} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Body>
                <div className="budget-content" style={{ width: "100%", maxWidth: "450px", border: 'none' }}>
                    <Form onSubmit={handleSubmit}>
                    <div className="d-flex flex-wrap">
                        <Form.Group controlId="account_name" className="mb-3 flex-grow-1 me-3">
                            <Form.Label className="mb-3 prompt-label">Account Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. Software"
                                name="account_name"
                                style={{
                                    width: 'auto',
                                    justifyContent: 'center',
                                    border: '1px solid black'
                                }}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                            />
                        </Form.Group>

                        </div>

                        <Form.Group controlId="number" className="mb-3">
                            <Form.Label className="mb-3 prompt-label">Allowance</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    name="allowance"
                                    placeholder="0"
                                    style={{
                                        width: 'auto',
                                        border: '1px solid black'
                                    }}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                                    required />
                            </InputGroup>

                        </Form.Group>
                        <Button variant="dark" type="submit" className="w-100">
                            Save
                        </Button>
                    </Form>
                    <div style={{ marginTop: '10px' }}>{budgetCreated && <p><span style={{ fontWeight: 'bold' }}>{formData.account_name}</span> budget created!</p>}</div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default Budget
