import React, { Component } from 'react'
import { connect } from 'react-redux'
import { exchangeSelector } from '../store/selectors'
import { loadAllOrders } from '../store/interactions'

class OrderLoader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      result: null,
      error: null
    }
  }

  loadOrders = async () => {
    if (!this.props.exchange) {
      console.log(' Exchange not available')
      return
    }

    this.setState({ loading: true, error: null })
    
    try {
      console.log(' Starting order loading...')
      
      // This will show the promise in console
      const promise = loadAllOrders(this.props.exchange, this.props.dispatch)
      console.log('Order loading promise:', promise)
    
      const result = await promise
      console.log(' Order loading resolved:', result)
      
      this.setState({ 
        loading: false, 
        result 
      })
      
    } catch (error) {
      console.error(' Order loading failed:', error)
      this.setState({ 
        loading: false, 
        error: error.message 
      })
    }
  }

  render() {
    const { loading, result, error } = this.state
    
    return (
      <div className="card bg-dark text-white">
        <div className="card-header">
          Order Loader Test
        </div>
        <div className="card-body">
          <button 
            className="btn btn-primary mb-3"
            onClick={this.loadOrders}
            disabled={loading || !this.props.exchange}
          >
            {loading ? '🔄 Loading...' : '📋 Load Orders'}
          </button>
          
          {result && (
            <div className="alert alert-success">
              <h6> Orders Loaded Successfully!</h6>
              <p>Cancelled: {result.cancelledOrders}</p>
              <p>Filled: {result.filledOrders}</p>
              <p>All: {result.allOrders}</p>
            </div>
          )}
          
          {error && (
            <div className="alert alert-danger">
              <h6> Error Loading Orders</h6>
              <p>{error}</p>
            </div>
          )}
          
          {!this.props.exchange && (
            <div className="alert alert-warning">
              <h6> Exchange Not Available</h6>
              <p>Please ensure contracts are loaded first.</p>
            </div>
          )}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    exchange: exchangeSelector(state)
  }
}

export default connect(mapStateToProps)(OrderLoader)
