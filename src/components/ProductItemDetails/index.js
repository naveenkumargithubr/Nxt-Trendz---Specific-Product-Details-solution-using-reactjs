// Write your code here

import {Component} from 'react'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {Link} from 'react-router-dom'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

// here we initialize the switch cases to handle responses
const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

// set the variable in setState to store the fetched data

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productsData: {},
    similarProductsData: [],
    quantity: 1,
  }

  // make the api call to server
  componentDidMount() {
    this.getProductsItemDetails()
  }

  // here we converting the variable snakecase to camel_Case (similiarproductitem)
  getFormedData = data => ({
    availability: data.availability,
    brand: data.brand,
    price: data.price,
    rating: data.rating,
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    totalReviews: data.total_reviews,
    description: data.description,
  })

  // getting the data from the server and also get the id of specific product item

  getProductsItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    // here we updating the loader whenever api is called this loader is displayed
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token') // here we get the jwttoken for authentication
    const apiUrl = `https://apis.ccbp.in/products/${id}` // specific id of the item
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`, // it is validating when the user is prime user or not..?
      },
    }
    const response = await fetch(apiUrl, options)

    // success response
    if (response.ok === true) {
      const fetchedData = await response.json()

      const updatedData = this.getFormedData(fetchedData)
      const updateSimilarProductData = fetchedData.similar_products.map(
        eachSimilarProduct => this.getFormedData(eachSimilarProduct),
      )
      this.setState({
        productsData: updatedData,
        similarProductsData: updateSimilarProductData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onIncrement = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }

  onDecrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  // display the specific product item deatails
  renderProductDetailedView = () => {
    const {productsData, similarProductsData, quantity} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      description,
      availability,
      brand,
      totalReviews,
    } = productsData

    return (
      <>
        <div className="detailed-products-item-container">
          <div className="img-container">
            <img src={imageUrl} alt="product" className="product-img" />
          </div>

          <div className="item-card-detailed-view-cont">
            <h1 className="product-title">{title}</h1>
            <p className="price-style">{`Rs ${price}/-`}</p>
            <div className="rating-reviews-container">
              <div className="rating-container2">
                <p className="rating-name">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-img"
                />
              </div>
              <p className="reviews-name">{`${totalReviews} Reviews`}</p>
            </div>
            <p className="desc-style">{description}</p>
            <div className="available-brand-container">
              <p className="available-style">
                <span className="span-style">Available: </span>
                {availability}
              </p>
              <p className="available-style">
                <span className="span-style">Available: </span> {brand}
              </p>
            </div>
            <hr />
            <div className="counting-container">
              <button
                type="button"
                className="dash-button"
                onClick={this.onDecrement} //   testid="minus"
              >
                <BsDashSquare className="dash-icon" />
              </button>
              <p className="quantity-style">{quantity}</p>
              <button
                type="button"
                className="dash-button"
                onClick={this.onIncrement} //   testid="plus"
              >
                <BsPlusSquare className="dash-icon" />
              </button>
            </div>
            <button type="button" className="add-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-head">Similar Products</h1>
        <div className="unorder-list">
          <ul className="similar-products-container-home">
            {similarProductsData.map(eachItem => (
              <SimilarProductItem
                key={eachItem.id}
                similarProductDetails={eachItem}
              />
            ))}
          </ul>
        </div>
      </>
    )
  }

  // loader response
  renderInprogressView = () => (
    // testid="loader"
    <div className="loader-container">
      <Loader type="ThreeDots" color="blue" height={50} width={50} />
    </div>
  )

  // failure response

  renderFailureBanner = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="continue-btn">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  // here we insert the all the responses here using the switch component
  renderProductDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailedView()
      case apiStatusConstants.inProgress:
        return this.renderInprogressView()
      case apiStatusConstants.failure:
        return this.renderFailureBanner()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-main-cont">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
