import React from 'react'
import './Feature.css'
import FeatureData from '../../interfaces/FeatureData'

const Feature = (props: FeatureData) => {
    return (
        <div className="feature-component">
            <img src={props.imgSource} alt={props.alt}/>
            <p>{props.title}</p>
            <ul>
                <li>{props.reasonOne}</li>
                <li>{props.reasonTwo}</li>
                <li>{props.reasonThree}</li>
            </ul>
        </div>
    )
}

export default Feature