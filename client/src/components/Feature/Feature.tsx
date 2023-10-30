import './Feature.css'
import FeatureData from '../../interfaces/FeatureData'
import Card from 'react-bootstrap/Card';

const Feature:React.FC<FeatureData> = ({title, reasonOne, reasonTwo, reasonThree, icon}) => {
    return (
      <Card className="d-flex flex-column">
        <div className="icon-container">
          <i className={`bi ${icon}`}></i>
        </div>
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>
            <li>{reasonOne}</li>
            <li>{reasonTwo}</li>
            <li>{reasonThree}</li>
          </Card.Text>
        </Card.Body>
      </Card>
    )
}

export default Feature
