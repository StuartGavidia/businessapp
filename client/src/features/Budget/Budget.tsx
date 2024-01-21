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


const Budget: React.FC = () => {
    const [formData, setFormData] = useState({
        account_name: "",
        occurance: 0,
        allowance: 0,
        budget_date: "",
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
        <div className="budget-content" style={{ width: "100%", maxWidth: "450px" }}>
            <h4>Create a Budget</h4>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="account_name" className="mb-3">
                    <Form.Label className="mb-3 prompt-label">Choose an Account Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Account Name"
                        name="account_name"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                    />
                </Form.Group>
                <Form.Group controlId="occurance" className="mb-3">
                    <Form.Label className="mb-3 prompt-label">How often will this happen?</Form.Label><br />
                    <Form.Check
                        type="radio"
                        label="Monthly"
                        name="occurance"
                        value="monthly"
                        onChange={handleChange}
                        inline
                    />
                    <Form.Check
                        type="radio"
                        label="Quarterly"
                        name="occurance"
                        value="quarterly"
                        onChange={handleChange}
                        inline />
                    <Form.Check
                        type="radio"
                        label="Once"
                        name="occurance"
                        value="once"
                        onChange={handleChange}
                        inline />
                </Form.Group>
                <Form.Group>
                    <Form.Label className='mb-3 prompt-label'>Select a Start Date</Form.Label>
                    <CalendarComp onSelect={handleChange}/>
                </Form.Group>
                <Form.Group controlId="number" className="mb-3">
                    <Form.Label className="mb-3 prompt-label">Amount</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control
                            type="number"
                            name="allowance"
                            placeholder="0"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                            required />
                    </InputGroup>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                    Save
                </Button>
            </Form>
            {budgetCreated && <p>{formData.account_name} budget created!</p>}
        </div>
    )
}

export default Budget