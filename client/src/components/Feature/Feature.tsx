import './Feature.css'
import FeatureData from '../../interfaces/FeatureData'

const Feature:React.FC<FeatureData> = ({imgSource, alt, title, reasonOne, reasonTwo, reasonThree}) => {
    return (
        <div className="feature-component">
            <img src={imgSource} alt={alt}/>
            <p>{title}</p>
            <ul>
                <li>{reasonOne}</li>
                <li>{reasonTwo}</li>
                <li>{reasonThree}</li>
            </ul>
        </div>
    )
}

export default Feature
