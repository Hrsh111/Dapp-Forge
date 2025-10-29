import React from 'react'
import { connect } from 'react-redux'

const DebugInfo = ({ web3, token, exchange, account }) => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: '60px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      fontSize: '12px',
      zIndex: 1000,
      maxWidth: '300px'
    }}>
      <h6>Debug Info</h6>
      <div>Web3: {web3?.connection ? ' Loaded' : ' Not Loaded'}</div>
      <div>Account: {account || ' Not Connected'}</div>
      <div>Token: {token?.loaded ? 'Loaded' : ' Not Loaded'}</div>
      <div>Exchange: {exchange?.loaded ? ' Loaded' : ' Not Loaded'}</div>
      <div>Contracts: {token?.loaded && exchange?.loaded ? ' Ready' : ' Not Ready'}</div>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    token: state.token,
    exchange: state.exchange,
    account: state.web3?.account
  }
}

export default connect(mapStateToProps)(DebugInfo)
