// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarProductDetails} = props
  const {title, brand, price, imageUrl, rating} = similarProductDetails

  // skeleton of the similar product item
  return (
    <li className="similar-product-container">
      <img
        src={imageUrl}
        alt={`similar products ${title}`}
        className="similar-img"
      />
      <h1 className="similar-title">{title}</h1>
      <p className="similar-brand">{`by ${brand}`}</p>
      <div className="price-rate-container">
        <p className="similar-price">{`Rs ${price}`}</p>
        <div className="rating-container">
          <p className="similar-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="similar-star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
