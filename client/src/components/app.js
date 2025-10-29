import React, { Component } from 'react'
import './app.css'
import Navbar from './Navbar'
import Content from './Content'
import DebugInfo from './DebugInfo'
import { connect } from 'react-redux'
import {
  loadWeb3,
  loadAccount,
  loadToken,
  loadExchange
} from '../store/interactions'
import { contractsLoadedSelector } from '../store/selectors'

class App extends Component {
  componentDidMount() {
    this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    try {
      const web3 = await loadWeb3(dispatch)
      if (!web3) {
        console.error(' Failed to load Web3')
        return
      }
      
      const networkId = await web3.eth.net.getId()
      console.log(' Network ID:', networkId)
      
      const account = await loadAccount(web3, dispatch)
      if (!account) {
        console.error(' Failed to load account')
        return
      }
      
      const token = await loadToken(web3, networkId, dispatch)
      if(!token) {
        window.alert('Token smart contract not detected on the current network. Please select another network with Metamask.')
        return
      }
      
      const exchange = await loadExchange(web3, networkId, dispatch)
      if(!exchange) {
        window.alert('Exchange smart contract not detected on the current network. Please select another network with Metamask.')
        return
      }
      
      console.log('All blockchain data loaded successfully')
    } catch (error) {
      console.error('Error loading blockchain data:', error)
      window.alert('Error loading blockchain data. Please check your MetaMask connection.')
    }
  }

 render() {
  return (
    <div style={{ background: '#f4f4f4', minHeight: '100vh' }}>
      <Navbar />
      <DebugInfo />
      <h1 style={{ textAlign: 'center', padding: '2rem' }}>🚀 React DApp is Working!</h1>
      { this.props.contractsLoaded ? <Content /> : <div className="content"></div> }
    </div>
  );
}

}

function mapStateToProps(state) {
  return {
    contractsLoaded: contractsLoadedSelector(state)
  }
}

export default connect(mapStateToProps)(App)
console.log("✅ app.js reloaded");



