import './Price.css'
import PriceData from '../../interfaces/PriceData'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'


const Price:React.FC<PriceData> = ({ price, backgroundColor }) => {
    return (
      <Card className="text-center" style={{backgroundColor: backgroundColor}}>
      <Card.Header>Featured</Card.Header>
      <Card.Body>
        <Card.Title>The Price</Card.Title>
        <div>{price}</div>
        <Card.Text>
          With supporting text below as a natural lead-in to additional content.
        </Card.Text>
        <Button variant="primary">Buy</Button>
      </Card.Body>
    </Card>
    )
}

export default Price
