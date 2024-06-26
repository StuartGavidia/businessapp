import Card from "react-bootstrap/Card"
import ProgressBar from "react-bootstrap/ProgressBar"
import React, { useState } from 'react'
import { currencyFormatter } from '../../utils/card'

import BudgetServiceAPI from "../../api/budgetServiceAPI";
import CloseButton from 'react-bootstrap/CloseButton'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import { Accordion, useAccordionButton } from "react-bootstrap";


interface BudgetCardProps {
    total_spend: number;
    account_name: string;
    allowance: number;
    currentMonthTransactions: any[]
}

const BudgetCard: React.FC<BudgetCardProps> = (props) => {

    const { total_spend, account_name, allowance, currentMonthTransactions } = props


    function getProgresBarVariant(total_spend: number, allowance: number) {
        const ratio = total_spend / allowance;

        if (ratio < .5) {
            return "primary"
        }
        if (ratio < .75) {
            return "warning"
        }
        return "danger"
    }

    const [showDeleteBudgetModal, setShowDeleteBudgetModal] = useState(false)

    const [budgetDeleted, setBudgetDeleted] = useState(false)

    const handleDelete = async (account_name: string) => {

        try {
            await BudgetServiceAPI.getInstance().deleteBudget(account_name);
            console.log(`${account_name} budget was successfully deleted.`)

        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log(`Error deleting ${account_name} budget: ${err.message}`);
            } else {
                console.log('An unexpected error occurred while deleting the budget.');
            }
        }

        setTimeout(() => {
            setBudgetDeleted(true);
        }, 150);

    }

    const closeModal = () => {
        setShowDeleteBudgetModal(false)
    }


    const CustomToggle = ({ children, eventKey }: { children: string, eventKey: string }) => {
        const decoratedOnClick = useAccordionButton(eventKey)

        return (
            <div
                className="me-auto"
                style={{ fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', }}
                onClick={decoratedOnClick}
            >
                {children}
            </div>
        );
    };



    return (
        <Accordion defaultActiveKey={"0"} flush>
            <Card style={{ marginBottom: '16px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', border: 'none' }}>
                <Card.Body>
                    <Card.Title className="d-flex justify-content-between align-items-baseline fw-normal mb-3">
                        <CustomToggle eventKey="1">{account_name}</CustomToggle>
                        <div className="d-flex align-items-baseline">
                            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{currencyFormatter.format(total_spend)}</span>
                            <span className="text-muted ms-1" style={{ fontSize: '12px' }}> / {currencyFormatter.format(allowance)}</span>
                        </div>

                        {/* Delete Budget Feature */}
                        <div className="d-flex justify-content-end align-items-baseline" style={{ paddingLeft: '8px' }}>
                            <CloseButton style={{ padding: '0.15rem', fontSize: '0.75rem' }} onClick={() => setShowDeleteBudgetModal(true)} />
                            <Modal show={showDeleteBudgetModal} onHide={closeModal} aria-labelledby="contained-modal-title-vcenter"
                                centered>
                                <Modal.Body className="d-flex flex-column align-items-center">
                                    <div className="mb-auto text-center">
                                        <span>Are you sure you want to delete the <span style={{ fontWeight: 'bold' }}>{account_name}</span> budget?</span>
                                    </div>
                                    <div className="d-flex justify-content-end" style={{ marginTop: '15px' }}>
                                        <Button className="me-2" style={{ marginRight: '10px' }} variant="secondary" onClick={() => setShowDeleteBudgetModal(false)}>Cancel</Button>
                                        <Button variant="danger" onClick={() => handleDelete(account_name)}>Yes, delete it</Button>
                                    </div>
                                    <div style={{ marginTop: '15px', paddingBottom: '1px' }}>{budgetDeleted && <p><span style={{ fontWeight: 'bold' }}>{account_name}</span> budget successfully deleted!</p>}</div>

                                </Modal.Body>
                            </Modal>
                        </div>

                    </Card.Title>
                    <ProgressBar className="rounded-pill"
                        style={{ height: '10px' }}
                        variant={getProgresBarVariant(total_spend, allowance)}
                        min={0}
                        max={allowance}
                        now={total_spend} />
                </Card.Body>
                <Accordion.Collapse eventKey="1">
                    <Card.Body>
                            <table className='transaction-rollup-container'>
                                <tbody>
                                    {currentMonthTransactions.map((transactionItem, index) => (
                                        <tr key={index}>
                                            <td className='recent-transaction-item padded-cell'>{transactionItem.descriptions}</td>
                                            <td className='recent-transaction-item padded-cell'>{transactionItem.account_name}</td>
                                            <td className='recent-transaction-item padded-cell'>{transactionItem.transaction_date}</td>
                                            <td className='transaction-amount padded-cell'>${Math.abs(transactionItem.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
    
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>

    )
}

export default BudgetCard;
