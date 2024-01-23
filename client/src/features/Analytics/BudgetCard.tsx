import { Card, ProgressBar } from "react-bootstrap"
import React from 'react'
import { currencyFormatter } from '../../utils/card'
import { FontSizes } from "@fluentui/react";

interface BudgetCardProps {
    total_spend: number
    account_name: string;
    allowance: number
}

const BudgetCard: React.FC<BudgetCardProps> = (props) => {
    const {total_spend, account_name, allowance } = props

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

    return (
        <Card style={{marginBottom: '16px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', border: 'none'}}>
            <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-baseline fw-normal mb-3">
                    <div className="me-2" style={{fontSize: '16px', fontWeight: 'bold'}}>{account_name}</div>
                    <div className="d-flex align-items-baseline">
                        <span style={{ fontWeight: 'bold', fontSize: '16px'}}>{currencyFormatter.format(total_spend)}</span>
                    <span className="text-muted ms-1" style={{fontSize: '12px'}}> / { currencyFormatter.format(allowance)}</span>
                    </div>
                </Card.Title>
                <ProgressBar className="rounded-pill" 
                style={{ height: '10px'}}
                variant={getProgresBarVariant(total_spend, allowance)}
                min={0}
                max={allowance}
                now={total_spend}/>
            </Card.Body>
        </Card>
    )
}

export default BudgetCard;