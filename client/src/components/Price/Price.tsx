import './Price.css'
import PriceData from '../../interfaces/PriceData'

const Price:React.FC<PriceData> = ({ price, backgroundColor }) => {

    return (
        <div className="price-container" style={{backgroundColor: backgroundColor}}>
            <p>{price}</p>
        </div>
    )
}

export default Price