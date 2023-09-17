import React from 'react'
import './Price.css'
import PriceData from '../../interfaces/PriceData'

const Price = (props: PriceData) => {

    return (
        <div className="price-container" style={{backgroundColor: props.backgroundColor}}>
            <p>{props.price}</p>
        </div>
    )
}

export default Price