import Web3 from 'web3'
import {
  web3Loaded,
  web3AccountLoaded,
  tokenLoaded,
  exchangeLoaded,
  cancelledOrdersLoaded,
  filledOrdersLoaded,
  allOrdersLoaded,
  orderCancelling,
  orderCancelled,
  orderFilling,
  orderFilled,
  etherBalanceLoaded,
  tokenBalanceLoaded,
  exchangeEtherBalanceLoaded,
  exchangeTokenBalanceLoaded,
  balancesLoaded,
  balancesLoading,
  buyOrderMaking,
  sellOrderMaking,
  orderMade
} from './actions'
import Token from '../contracts/token.json'
import Exchange from '../contracts/Exchange.json'
import { ETHER_ADDRESS } from '../helpers'

export const loadWeb3 = async (dispatch) => {
  try {
    console.log('🌐 Loading Web3...')
    
    if (typeof window.ethereum !== 'undefined') {
      console.log('✅ MetaMask detected')
      
      // Request account access
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        console.log(' Account access granted')
      } catch (error) {
        console.error(' User denied account access:', error)
        window.alert('Please connect MetaMask and grant account access.')
        return null
      }
      
      const web3 = new Web3(window.ethereum)
      dispatch(web3Loaded(web3))
      console.log(' Web3 loaded and dispatched')
      return web3
    } else {
      console.error(' MetaMask not detected')
      window.alert('Please install MetaMask')
      window.location.assign("https://metamask.io/")
      return null
    }
  } catch (error) {
    console.error(' Error loading Web3:', error)
    window.alert('Error loading Web3. Please check MetaMask installation.')
    return null
  }
}

export const loadAccount = async (web3, dispatch) => {
  try {
    console.log('👤 Loading account...')
    const accounts = await web3.eth.getAccounts()
    console.log('📋 Available accounts:', accounts)
    
    if (accounts.length === 0) {
      console.error(' No accounts found. Please connect MetaMask.')
      window.alert('Please connect MetaMask and select an account.')
      return null
    }
    
    const account = accounts[0]
    console.log(' Using account:', account)
    dispatch(web3AccountLoaded(account))
    return account
  } catch (error) {
    console.error(' Error loading account:', error)
    window.alert('Error loading account. Please check MetaMask connection.')
    return null
  }
}

export const loadToken = async (web3, networkId, dispatch) => {
  try {
    console.log(' Loading token contract for network:', networkId)
    
    // Handle different Ganache network IDs
    let contractAddress
    if (Token.networks[networkId]) {
      contractAddress = Token.networks[networkId].address
    } else if (networkId === 1337 && Token.networks[5777]) {
      // Ganache sometimes uses 1337, but contracts might be deployed on 5777
      contractAddress = Token.networks[5777].address
      console.log('🔄 Using 5777 network address for Ganache 1337')
    } else {
      throw new Error(`Token contract not found on network ${networkId}`)
    }
    
    const token = new web3.eth.Contract(Token.abi, contractAddress)
    console.log('✅ Token contract loaded:', contractAddress)
    dispatch(tokenLoaded(token))
    console.log('💾 Token dispatched to Redux')
    return token
  } catch (error) {
    console.error('❌ Token contract not deployed to the current network. Please select another network with Metamask.')
    console.error('Available networks:', Object.keys(Token.networks))
    console.error('Current network ID:', networkId)
    return null
  }
}

export const loadExchange = async (web3, networkId, dispatch) => {
  try {
    console.log('🏪 Loading exchange contract for network:', networkId)
    
    // Handle different Ganache network IDs
    let contractAddress
    if (Exchange.networks[networkId]) {
      contractAddress = Exchange.networks[networkId].address
    } else if (networkId === 1337 && Exchange.networks[5777]) {
      // Ganache sometimes uses 1337, but contracts might be deployed on 5777
      contractAddress = Exchange.networks[5777].address
      console.log('🔄 Using 5777 network address for Ganache 1337')
    } else {
      throw new Error(`Exchange contract not found on network ${networkId}`)
    }
    
    const exchange = new web3.eth.Contract(Exchange.abi, contractAddress)
    console.log('✅ Exchange contract loaded:', contractAddress)
    dispatch(exchangeLoaded(exchange))
    console.log('💾 Exchange dispatched to Redux')
    return exchange
  } catch (error) {
    console.error('❌ Exchange contract not deployed to the current network. Please select another network with Metamask.')
    console.error('Available networks:', Object.keys(Exchange.networks))
    console.error('Current network ID:', networkId)
    return null
  }
}

export const loadAllOrders = async (exchange, dispatch) => {
  // Fetch cancelled orders with the "Cancel" event stream
  const cancelStream = await exchange.getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest' })
  // Format cancelled orders
  const cancelledOrders = cancelStream.map((event) => event.returnValues)
  // Add cancelled orders to the redux store
  dispatch(cancelledOrdersLoaded(cancelledOrders))

  // Fetch filled orders with the "Trade" event stream
  const tradeStream = await exchange.getPastEvents('Trade', { fromBlock: 0, toBlock: 'latest' })
  // Format filled orders
  const filledOrders = tradeStream.map((event) => event.returnValues)
  // Add cancelled orders to the redux store
  dispatch(filledOrdersLoaded(filledOrders))

  // Load order stream
  const orderStream = await exchange.getPastEvents('Order', { fromBlock: 0,  toBlock: 'latest' })
  // Format order stream
  const allOrders = orderStream.map((event) => event.returnValues)
  // Add open orders to the redux store
  dispatch(allOrdersLoaded(allOrders))
}

export const subscribeToEvents = async (exchange, dispatch) => {
  exchange.events.Cancel({}, (error, event) => {
    dispatch(orderCancelled(event.returnValues))
  })

  exchange.events.Trade({}, (error, event) => {
    dispatch(orderFilled(event.returnValues))
  })

  exchange.events.Deposit({}, (error, event) => {
    dispatch(balancesLoaded())
  })

  exchange.events.Withdraw({}, (error, event) => {
    dispatch(balancesLoaded())
  })

  exchange.events.Order({}, (error, event) => {
    dispatch(orderMade(event.returnValues))
  })
}

export const cancelOrder = (dispatch, exchange, order, account) => {
  exchange.methods.cancelOrder(order.id).send({ from: account })
  .on('transactionHash', (hash) => {
     dispatch(orderCancelling())
  })
  .on('error', (error) => {
    console.log(error)
    window.alert('There was an error!')
  })
}

export const fillOrder = (dispatch, exchange, order, account) => {
  exchange.methods.fillOrder(order.id).send({ from: account })
  .on('transactionHash', (hash) => {
     dispatch(orderFilling())
  })
  .on('error', (error) => {
    console.log(error)
    window.alert('There was an error!')
  })
}

export const loadBalances = async (dispatch, web3, exchange, token, account) => {
  if(typeof account !== 'undefined') {
      // Ether balance in wallet
      const etherBalance = await web3.eth.getBalance(account)
      dispatch(etherBalanceLoaded(etherBalance))

      // Token balance in wallet
      const tokenBalance = await token.methods.balanceOf(account).call()
      dispatch(tokenBalanceLoaded(tokenBalance))

      // Ether balance in exchange
      const exchangeEtherBalance = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call()
      dispatch(exchangeEtherBalanceLoaded(exchangeEtherBalance))

      // Token balance in exchange
      const exchangeTokenBalance = await exchange.methods.balanceOf(token.options.address, account).call()
      dispatch(exchangeTokenBalanceLoaded(exchangeTokenBalance))

      // Trigger all balances loaded
      dispatch(balancesLoaded())
    } else {
      window.alert('Please login with MetaMask')
    }
}

export const depositEther = (dispatch, exchange, web3, amount, account) => {
  exchange.methods.depositEther().send({ from: account,  value: web3.utils.toWei(amount, 'ether') })
  .on('transactionHash', (hash) => {
    dispatch(balancesLoading())
  })
  .on('error',(error) => {
    console.error(error)
    window.alert(`There was an error!`)
  })
}

export const withdrawEther = (dispatch, exchange, web3, amount, account) => {
  exchange.methods.withdrawEther(web3.utils.toWei(amount, 'ether')).send({ from: account })
  .on('transactionHash', (hash) => {
    dispatch(balancesLoading())
  })
  .on('error',(error) => {
    console.error(error)
    window.alert(`There was an error!`)
  })
}

export const depositToken = (dispatch, exchange, web3, token, amount, account) => {
  amount = web3.utils.toWei(amount, 'ether')

  token.methods.approve(exchange.options.address, amount).send({ from: account })
  .on('transactionHash', (hash) => {
    exchange.methods.depositToken(token.options.address, amount).send({ from: account })
    .on('transactionHash', (hash) => {
      dispatch(balancesLoading())
    })
    .on('error',(error) => {
      console.error(error)
      window.alert(`There was an error!`)
    })
  })
}

export const withdrawToken = (dispatch, exchange, web3, token, amount, account) => {
  exchange.methods.withdrawToken(token.options.address, web3.utils.toWei(amount, 'ether')).send({ from: account })
  .on('transactionHash', (hash) => {
    dispatch(balancesLoading())
  })
  .on('error',(error) => {
    console.error(error)
    window.alert(`There was an error!`)
  })
}

export const makeBuyOrder = (dispatch, exchange, token, web3, order, account) => {
  const tokenGet = token.options.address
  const amountGet = web3.utils.toWei(order.amount, 'ether')
  const tokenGive = ETHER_ADDRESS
  const amountGive = web3.utils.toWei((order.amount * order.price).toString(), 'ether')

  exchange.methods.makeOrder(tokenGet, amountGet, tokenGive, amountGive).send({ from: account })
  .on('transactionHash', (hash) => {
    dispatch(buyOrderMaking())
  })
  .on('error',(error) => {
    console.error(error)
    window.alert(`There was an error!`)
  })
}

export const makeSellOrder = (dispatch, exchange, token, web3, order, account) => {
  const tokenGet = ETHER_ADDRESS
  const amountGet = web3.utils.toWei((order.amount * order.price).toString(), 'ether')
  const tokenGive = token.options.address
  const amountGive = web3.utils.toWei(order.amount, 'ether')

  exchange.methods.makeOrder(tokenGet, amountGet, tokenGive, amountGive).send({ from: account })
  .on('transactionHash', (hash) => {
    dispatch(sellOrderMaking())
  })
  .on('error',(error) => {
    console.error(error)
    window.alert(`There was an error!`)
  })
}