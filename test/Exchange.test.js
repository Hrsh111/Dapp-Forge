const { tokens, EVM_REVERT, ETHER_ADDRESS,ether } = require('./helpers')
const Exchange = artifacts.require('./Exchange')
const Token = artifacts.require('./Token')
const chai = require('chai')
chai.use(require('chai-as-promised'))
chai.should()

contract('Exchange', ([deployer, feeAccount, user1, user2 ]) => {
    let exchange
    let token
    const feePercent = 10

    beforeEach(async () => {
        // deploy token
        token = await Token.new()
        // Transfer tokens to user1
        await token.transfer(user1, tokens(100), {from: deployer})
        // Deploy exchange
        exchange = await Exchange.new(feeAccount, feePercent)
    })

    describe('deployment', () => {
        it('tracks the fee account', async () => {
            const result = await exchange.feeAccount()
            result.should.equal(feeAccount)
        })

        it('tracks the fee percent', async () => {
            const result = await exchange.feePercent()
            result.toString().should.equal(feePercent.toString())
        })
    })
    describe('depositing ether', () => {
        let result
        let amount = ether(0.1)
        
        beforeEach(async()=>{
            result = await exchange.depositEther({from: user1, value: amount})
        })
        
        it('tracks the ether deposit', async()=>{
            const balance = await exchange.tokens(ETHER_ADDRESS, user1)
            balance.toString().should.equal(amount.toString())
        })
        
        it('emits a deposit event', async()=>{
            const log = result.logs[0]
            log.event.should.eq('Deposit')
            const event = log.args
            event.token.should.equal(ETHER_ADDRESS, 'token address is correct')
            event.user.should.equal(user1, 'user is correct')
            event.amount.toString().should.equal(amount.toString(), 'amount is correct')
            event.balance.toString().should.equal(amount.toString(), 'balance is correct')
        })
    })

    describe('Fallback', () => {
        it('rejects fallback function', async() => {
            await exchange.sendTransaction({value: 1, from: user1}).should.be.rejectedWith(EVM_REVERT)
        })
    })
    describe('withdrawing ether', () => {
        let result
        let amount = ether(0.1)
        
        describe('success', () => {
            beforeEach(async()=>{
                // First deposit ether
                await exchange.depositEther({from: user1, value: amount})
                // Then withdraw ether
                result = await exchange.withdrawEther(amount, {from: user1})
            })
            
            it('withdraws ether funds', async()=>{
                const balance = await exchange.tokens(ETHER_ADDRESS, user1)
                balance.toString().should.equal('0')
            })
            
            it('emits a withdraw event', async()=>{
                const log = result.logs[0]
                log.event.should.eq('Withdraw')
                const event = log.args
                event.token.should.equal(ETHER_ADDRESS, 'token address is correct')
                event.user.should.equal(user1, 'user is correct')
                event.amount.toString().should.equal(amount.toString(), 'amount is correct')
                event.balance.toString().should.equal('0', 'balance is correct')
            })
        })
        describe('failure', () => {
            it('rejects insufficient balance', async()=>{
                await exchange.withdrawEther(tokens(100), {from: user1}).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })

    describe('depositing tokens', () => {
        let result
        
        describe('success', () => {
            beforeEach(async()=>{
                await token.approve(exchange.address, tokens(10), {from: user1})
                result = await exchange.depositToken(token.address, tokens(10), {from: user1})
            })
            
            it('tracks the token deposit', async()=>{
                // check the token balance 
                let balance = await token.balanceOf(exchange.address)
                balance.toString().should.equal(tokens(10).toString())
                
                // check the user's token balance in exchange
                balance = await exchange.tokens(token.address, user1)
                balance.toString().should.equal(tokens(10).toString())
            })
            it('emits a deposit event', async()=>{
                const log = result.logs[0]
                log.event.should.eq('Deposit')
                const event = log.args
                event.token.should.equal(token.address, 'token address is correct')
                event.user.should.equal(user1, 'user is correct')
                event.amount.toString().should.equal(tokens(10).toString(), 'amount is correct')
                event.balance.toString().should.equal(tokens(10).toString(), 'balance is correct')
            })
        })
        
        describe('failure', () => {
            it('rejects ether deposits', async()=>{
                await exchange.depositToken(ETHER_ADDRESS, tokens(10), {from: user1}).should.be.rejectedWith(EVM_REVERT)
            })
            it('rejects invalid tokens', async()=>{
                await exchange.depositToken('0x0000000000000000000000000000000000000000', tokens(10), {from: deployer}).should.be.rejectedWith(EVM_REVERT)
            })
            it('fails when no tokens are approved', async()=>{
                // Don't approve any tokens before depositing
                await exchange.depositToken(token.address, tokens(10), {from: user1}).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })
    describe('withdrawing tokens', () => {
        let result
        let amount = tokens(10)
        
        describe('success', () => {
            beforeEach(async()=>{
                // First deposit tokens
                await token.approve(exchange.address, amount, {from: user1})
                await exchange.depositToken(token.address, amount, {from: user1})
                // Then withdraw tokens
                result = await exchange.withdrawToken(token.address, amount, {from: user1})
            })
            
            it('withdraws token funds', async()=>{
                // Check that user's balance in exchange is 0 after withdrawal
                const balance = await exchange.tokens(token.address, user1)
                balance.toString().should.equal('0')
            })
            
            it('emits a withdraw event', async()=>{
                const log = result.logs[0]
                log.event.should.eq('Withdraw')
                const event = log.args
                event.token.should.equal(token.address, 'token address is correct')
                event.user.should.equal(user1, 'user is correct')
                event.amount.toString().should.equal(amount.toString(), 'amount is correct')
                event.balance.toString().should.equal('0', 'balance is correct')
            })
        })
        describe('failure', () => {
            it('rejects ether withdrawals', async()=>{
                await exchange.withdrawToken(ETHER_ADDRESS, tokens(10), {from: user1}).should.be.rejectedWith(EVM_REVERT)
            })
            it('rejects insufficient balance', async()=>{
                await exchange.withdrawToken(token.address, tokens(100), {from: user1}).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })
    describe('checking balances', () => {
        it('checks the balance of an address', async()=>{
            // First deposit tokens
            await token.approve(exchange.address, tokens(10), {from: user1})
            await exchange.depositToken(token.address, tokens(10), {from: user1})
            
            // Then check the balance
            const balance = await exchange.balanceOf(token.address, user1)
            balance.toString().should.equal(tokens(10).toString())
        })
    })
    describe('making orders', () => {
        let result 
        beforeEach(async()=>{
            result = await exchange.makeOrder(token.address, tokens(1), ETHER_ADDRESS, ether(1), {from: user1})
        })
        it('tracks the newly crated order', async()=>{
            const orderCount = await exchange.orderCount()
            orderCount.toString().should.equal('1')
            const order = await exchange.orders(1)
            order.id.toString().should.equal('1')
            order.user.should.equal(user1)
            order.tokenGet.should.equal(token.address)
            order.tokenGive.should.equal(ETHER_ADDRESS)
            order.amountGive.toString().should.equal(tokens(1).toString())
            order.amountGet.toString().should.equal(ether(1).toString())
        })
        
        it('emits a order event', async()=>{
            const log = result.logs[0]
            log.event.should.eq('Order')
            const event = log.args
            event.id.toString().should.equal('1')
            event.user.should.equal(user1) 
            event.tokenGet.should.equal(token.address)
            event.amountGet.toString().should.equal(tokens(1).toString())
            event.tokenGive.should.equal(ETHER_ADDRESS)
            event.amountGive.toString().should.equal(ether(1).toString())
        })
    })
    describe('cancelling orders', () => {
        let result
        
        describe('success', () => {
            beforeEach(async()=>{
                result = await exchange.makeOrder(token.address, tokens(1), ETHER_ADDRESS, ether(1), {from: user1})
            })
            
            it('updates the cancelled order', async()=>{
                await exchange.cancelOrder(1, {from: user1})
                const orderCancelled = await exchange.orderCancelled(1)
                orderCancelled.should.equal(true)
            })
            
            it('emits a cancel event', async()=>{
                const result = await exchange.cancelOrder(1, {from: user1})
                const log = result.logs[0]
                log.event.should.eq('Cancel')
                const event = log.args
                event.id.toString().should.equal('1')
                event.user.should.equal(user1)
            })
        })
        
        describe('failure', () => {
            beforeEach(async()=>{
                await exchange.makeOrder(token.address, tokens(1), ETHER_ADDRESS, ether(1), {from: user1})
            })
            
            it('rejects invalid order', async()=>{
                const invalidOrderId = 99999;
                await exchange.cancelOrder(2, {from: user1}).should.be.rejectedWith(EVM_REVERT)
            })
            
            it('rejects non-owner order cancellation', async()=>{
                await exchange.cancelOrder(1, {from: user2}).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })

         describe('filling orders', () => {
         let result
         
         describe('success', () => {
             beforeEach(async()=>{
                 // Setup: user1 creates order to get 1 token for 0.1 ether (user1 wants tokens, offers ether)
                 await exchange.makeOrder(token.address, tokens(1), ETHER_ADDRESS, ether(0.1), {from: user1})
                 
                 // user1 needs to have ether to give to user2
                 await exchange.depositEther({from: user1, value: ether(0.1)})
                 
                 // user2 needs to have tokens to give to user1
                 await token.transfer(user2, tokens(2), {from: deployer})
                 await token.approve(exchange.address, tokens(2), {from: user2})
                 await exchange.depositToken(token.address, tokens(2), {from: user2})
                 
                 // user2 fills the order 
                 result = await exchange.fillOrder(1, {from: user2})
             })
             
             it('executes the trade & charges fees', async()=>{
                 let balance
                 
                 // user1 received tokens
                 balance = await exchange.balanceOf(token.address, user1)
                 balance.toString().should.equal(tokens(1).toString(), 'user1 received tokens')
                 
                 // user2 received ether (minus fee)
                 balance = await exchange.balanceOf(ETHER_ADDRESS, user2)
                 balance.toString().should.equal(ether(0.09).toString(), 'user2 received ether minus fee')
                 
                 // user1 ether deducted
                 balance = await exchange.balanceOf(ETHER_ADDRESS, user1)
                 balance.toString().should.equal('0', 'user1 ether deducted')
                 
                 // user2 tokens deducted with fee applied
                 balance = await exchange.balanceOf(token.address, user2)
                 balance.toString().should.equal(tokens(1).toString(), 'user2 tokens deducted with fee applied')
                 
                 // feeAccount received fee
                 const feeAccount = await exchange.feeAccount()
                 balance = await exchange.balanceOf(ETHER_ADDRESS, feeAccount)
                 balance.toString().should.equal(ether(0.01).toString(), 'feeAccount received fee')
             })
             
             it('updates filled orders', async()=>{
                 // Check that the order is marked as filled
                 const orderFilled = await exchange.orderFilled(1)
                 orderFilled.should.equal(true)
             })
             
             it('emits a "Trade" event', async()=>{
                 const log = result.logs[0]
                 log.event.should.eq('Trade')
                 const event = log.args
                 event.id.toString().should.equal('1', 'id is correct')
                 event.user.should.equal(user2, 'user is correct')
                 event.tokenGet.should.equal(token.address, 'tokenGet is correct')
                 event.amountGet.toString().should.equal(tokens(1).toString(), 'amountGet is correct')
                 event.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct')
                 event.amountGive.toString().should.equal(ether(0.1).toString(), 'amountGive is correct')
                 event.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
             })
         })
         
         describe('failure', () => {
             it('rejects filling already filled order', async()=>{
                 // Try to fill the order that was already filled in the success block
                 await exchange.fillOrder(1, {from: user2}).should.be.rejectedWith(EVM_REVERT)
             })
             
             it('rejects invalid order', async()=>{
                 await exchange.fillOrder(999, {from: user2}).should.be.rejectedWith(EVM_REVERT)
             })
             

         })
     })
     
     describe('fillOrder()', () => {
         describe('Check balances after filling user1 buy Tokens order', () => {
             beforeEach(async () => {
                 // user1 deposit 1 ETHER to the exchange
                 await exchange.depositEther({from: user1, value: ether(1)})
                 // user1 create order to buy 10 tokens for 1 ETHER
                 await exchange.makeOrder(token.address, tokens(10), ETHER_ADDRESS, ether(1), {from: user1})
                 // user2 gets tokens
                 await token.transfer(user2, tokens(11), {from: deployer})
                 // user2 approve exchange to spend his tokens
                 await token.approve(exchange.address, tokens(11), {from: user2})
                 // user2 deposit tokens + fee cost (1 token) to the exchange
                 await exchange.depositToken(token.address, tokens(11), {from: user2})
                 // user2 fills the order
                 await exchange.fillOrder('1', {from: user2})
             })

             it('user1 tokens balance on exchange should eq. 10', async () => {
                 await (await exchange.balanceOf(token.address, user1)).toString().should.eq(tokens(10).toString())
             })

             it('user1 ether balance on exchange should eq. 0', async () => {
                 await (await exchange.balanceOf(ETHER_ADDRESS, user1)).toString().should.eq('0')
             })

             it('user2 tokens balance on exchange should eq. 1', async () => {
                 await (await exchange.balanceOf(token.address, user2)).toString().should.eq(tokens(1).toString())
             })

             it('user2 ether balance on exchange should eq. 0.9', async () => {
                 await (await exchange.balanceOf(ETHER_ADDRESS, user2)).toString().should.eq(ether(0.9).toString())
             })
         })

         describe('Check balances after filling user1 buy Ether order', () => {
             beforeEach(async () => {
                 // User1 Gets the 10 tokens
                 await token.transfer(user1, tokens(10), {from: deployer})
                 // user1 approve exchange to spend his tokens
                 await token.approve(exchange.address, tokens(10), {from: user1})
                 // user1 approve send tokens to the exchange
                 await exchange.depositToken(token.address, tokens(10), {from: user1})
                 // user1 create order to buy 1 Ether for 10 tokens
                 await exchange.makeOrder(ETHER_ADDRESS, ether(1), token.address, tokens(10), {from: user1})
                 // user2 deposit 1 ETHER + fee cost (.1 ETH) to the exchange
                 await exchange.depositEther({from: user2, value: ether(1.1)})
                 // user2 fills the order
                 await exchange.fillOrder('1', {from: user2})
             })

             it('user1 tokens balance on exchange should eq. 0', async () => {
                 await (await exchange.balanceOf(token.address, user1)).toString().should.eq('0')
             })

             it('user1 Ether balance on exchange should eq. 1', async () => {
                 await (await exchange.balanceOf(ETHER_ADDRESS, user1)).toString().should.eq(ether(1).toString())
             })

             it('user2 tokens balance on exchange should eq. 9', async () => {
                 await (await exchange.balanceOf(token.address, user2)).toString().should.eq(tokens(9).toString())
             })

             it('user2 ether balance on exchange should eq. 0.1', async () => {
                 await (await exchange.balanceOf(ETHER_ADDRESS, user2)).toString().should.eq(ether(0.1).toString())
             })
         })
     })
})