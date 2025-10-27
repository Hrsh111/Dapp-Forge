const { tokens, EVM_REVERT } = require('./helpers')
const Token = artifacts.require('./Token')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

// Setup chai
chai.use(chaiAsPromised)
chai.should()
const assert = chai.assert

contract('Token', (accounts) => {
    const name= 'DApp Token'
    const symbol='DAPP'
    const decimals= 18
    const totalSupply = tokens(1000000).toString()
    let token
    let deployer = accounts[0]
    let receiver = accounts[1]
    let exchange = accounts[2]
    
    beforeEach(async()=> {
        token = await Token.new()
    })
  describe('deployment', () => {
    it('tracks the name', async () => {
      const result = await token.name()
        assert.equal(result, name)
    })
    it('tracks the symbol', async()=>{
        const result= await token.symbol()
        assert.equal(result, symbol)
    })
    it('tracks the decimals', async()=>{
        const result = await token.decimals()
        assert.equal(result, decimals)
    })
    it('tracks the total supply', async() => {
        const result =await token.totalSupply()
        assert.equal(result.toString(), totalSupply)
    })
    it('assigns the total supply to the deployer', async()=>{
        const result = await token.balanceOf(accounts[0])
        assert.equal(result.toString(), totalSupply)
    })

  })
  
      describe('delegated token transfers ', () => {
    let result
    let amount 
    
    describe('success', async() => {
      beforeEach(async()=>{
          amount = tokens(100)
          result = await token.transfer(receiver, amount, {from: deployer})
      })

      it('transfers token balances', async () => {
        let balanceOf
        
        // Check deployer balance
        balanceOf = await token.balanceOf(deployer)
        balanceOf.toString().should.equal(tokens(999900).toString())
        
        // Check receiver balance  
        balanceOf = await token.balanceOf(receiver)
        balanceOf.toString().should.equal(tokens(100).toString())
      })
      
      it('emits a transfer event', async()=>{
          const log = result.logs[0]
          log.event.should.eq('Transfer')
          const event = log.args
          event.from.toString().should.equal(deployer, 'from is correct')
          event.to.should.equal(receiver, 'to is correct')
          event.value.toString().should.equal(amount.toString(), 'value is correct')
      })
    })
    
    describe('failure', async() => {
      it('rejects insufficient balance', async()=>{
        let invalidAmount = tokens(1000001) // More than the total supply
        await token.transfer(receiver, invalidAmount, {from: deployer}).should.be.rejectedWith(EVM_REVERT);
      })
      
      it('rejects transfer when sender has no tokens', async()=>{
        // Transfer all tokens from deployer to receiver first
        await token.transfer(receiver, tokens(1000000), {from: deployer})
        // Now try to transfer from deployer (who has 0 tokens) to another account
        await token.transfer(accounts[2], tokens(10), {from: deployer}).should.be.rejectedWith(EVM_REVERT);
      })
      
      it('rejects invalid recipients', async()=>{
        await token.transfer('0x0000000000000000000000000000000000000000', tokens(10), {from: deployer}).should.be.rejectedWith(EVM_REVERT);
      })
    })
  })
  
  describe('approving tokens', () => {
    let amount
    let result 
    beforeEach(async()=>{
      amount = tokens(100)
      result = await token.approve(exchange, amount, {from: deployer})
    })

    describe('success', async() => {
      it('allocates an allowance for a spender', async()=>{
        const allowance = await token.allowance(deployer, exchange)
        allowance.toString().should.equal(amount.toString())
      })
      it('emits a Approval event', async()=>{
        const log = result.logs[0]
        log.event.should.eq('Approval')
        const event = log.args
        event.owner.toString().should.equal(deployer, 'from is correct')
        event.spender.should.equal(exchange, 'spender is correct')
        event.value.toString().should.equal(amount.toString(), 'value is correct')
      })
    })
    
    describe('failure', async() => {
      it('rejects invalid spender', async()=>{
        await token.approve('0x0000000000000000000000000000000000000000', amount, {from: deployer}).should.be.rejectedWith(EVM_REVERT);
      })
    })
  })

  describe('delegated token transfers (transferFrom)', () => {
    let amount
    let result
    
    describe('success', () => {
      beforeEach(async() => {
        amount = tokens(100)
        // First approve tokens
        await token.approve(exchange, amount, {from: deployer})
        // Then transfer using transferFrom
        result = await token.transferFrom(deployer, receiver, amount, {from: exchange})
      })

      it('transfers token balances', async() => {
        let balanceOf
        
        // Check deployer balance
        balanceOf = await token.balanceOf(deployer)
        balanceOf.toString().should.equal(tokens(999900).toString())
        
        // Check receiver balance  
        balanceOf = await token.balanceOf(receiver)
        balanceOf.toString().should.equal(tokens(100).toString())
      })

      it('resets the allowance', async() => {
        const allowance = await token.allowance(deployer, exchange)
        allowance.toString().should.equal('0')
      })

      it('emits a Transfer event', async() => {
        const log = result.logs[0]
        log.event.should.eq('Transfer')
        const event = log.args
        event.from.toString().should.equal(deployer, 'from is correct')
        event.to.should.equal(receiver, 'to is correct')
        event.value.toString().should.equal(amount.toString(), 'value is correct')
      })
    })

    describe('failure', () => {
      it('rejects insufficient amounts', async() => {
        // Try to transfer more than approved
        await token.transferFrom(deployer, receiver, tokens(1000), {from: exchange}).should.be.rejectedWith(EVM_REVERT)
      })
    })
  })
})
   