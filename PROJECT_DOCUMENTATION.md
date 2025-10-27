# Blockchain DApp Capstone Project Documentation

## Project Overview
This document tracks the development process of the blockchain decentralized application (DApp) capstone project. It explains key concepts, implementation details, and troubleshooting steps to help understand the project better.

## Project Structure
- `/src/contracts/`: Contains Solidity smart contracts
- `/migrations/`: Contains deployment scripts for the contracts
- `/client/`: Contains the React frontend application
- `/test/`: Contains test files for smart contracts

## Smart Contracts

### Token Contract
The Token contract (`/src/contracts/Token.sol`) is a simple ERC-20 like token implementation:

```solidity
pragma solidity ^0.8.19;

contract Token {
    string public name = "My name";
}
```

Currently, this contract only defines a name property. In a complete implementation, it would include functions for transfers, approvals, and other token operations.

### Migrations Contract
The Migrations contract (`/src/contracts/migrations.sol`) is used by Truffle to track which migrations have been applied to the blockchain:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Migrations {
    address public owner;
    uint public lastCompletedMigration;
    
    modifier restricted() {
        require(
            msg.sender == owner,
            "This function is restricted to the contract's owner"
        );
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function setCompleted(uint completed) public restricted {
        lastCompletedMigration = completed;
    }
    
    function upgrade(address newAddress) public restricted {
        Migrations upgraded = Migrations(newAddress);
        upgraded.setCompleted(lastCompletedMigration);
    }
}
```

## Deployment Scripts

### 1_initial_migration.js
This script deploys the Migrations contract:

```javascript
const Migrations = artifacts.require("Migrations");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
```

### 2_deploy_contracts.js
This script deploys the Token contract:

```javascript
const Token = artifacts.require("Token");

module.exports = function (deployer) {
  deployer.deploy(Token);
};
```

## Testing

### Setting Up Testing with Chai
We've set up testing using the Chai assertion library. Chai provides a more expressive and readable way to write test assertions.

1. Added Chai and Chai-as-promised to the project dependencies:
   ```json
   "devDependencies": {
     "@truffle/hdwallet-provider": "^2.1.15",
     "chai": "^4.3.7",
     "chai-as-promised": "^7.1.1",
     "truffle": "^5.11.5"
   }
   ```

2. Created a test file for the Token contract:
   ```javascript
   const Token = artifacts.require('./Token')
   const chai = require('chai')
   const chaiAsPromised = require('chai-as-promised')
   
   // Setup chai
   chai.use(chaiAsPromised)
   const assert = chai.assert
   
   contract('Token', (accounts) => {
     describe('deployment', () => {
       it('tracks the name', async () => {
         const token = await Token.new()
         const result = await token.name()
         assert.equal(result, 'My name', 'Token name should match')
       })
     })
   })
   ```

## Troubleshooting

### Gas Cost Visibility in Ganache
When deploying contracts to Ganache, you might not see a noticeable reduction in ETH balance because:

1. Simple contracts like our current Token contract require very little gas to deploy
2. The gas cost might be so minimal that it's not easily visible in the main account balance
3. To see the exact gas used, check individual transaction details in Ganache

### Testing Issues

#### Node.js Compatibility
When running tests, we encountered an issue with TypeScript files in the node_modules directory. This was resolved by:

1. Removing the separate node_modules in the test directory
2. Running tests with `npx truffle test` instead of `npm test`

#### µWS Compatibility Warning
You may see this warning when running tests:
```
This version of µWS is not compatible with your Node.js build:
Error: Cannot find module '../binaries/uws_darwin_arm64_127.node'
...
Falling back to a NodeJS implementation; performance may be degraded.
```

This is just a warning, not an error. Ganache is using a fallback implementation because it can't find the optimized binary for your specific system. This only affects performance, not functionality.

#### Common Test Errors

1. **Typo in variable names**: Always double-check variable names in your tests. For example, we fixed an error where `result` was misspelled as `reuslt` in the assertion.

2. **Assertion style mismatch**: Make sure you're using the correct assertion style. For example:
   - When using `assert` style: `assert.equal(result, 'My name', 'Token name should match')`
   - When using `should` style: `result.should.equal('My name')`
   
   Note that to use the `should` style, you need to add `chai.should()` to your test setup.

## Next Steps

1. Expand the Token contract with more functionality (transfers, balances, etc.)
2. Add more comprehensive tests
3. Develop the frontend interface in the client directory
4. Connect the frontend to the deployed contracts

## Resources

- [Truffle Documentation](https://trufflesuite.com/docs/truffle/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Chai Documentation](https://www.chaijs.com/)
- [Web3.js Documentation](https://web3js.readthedocs.io/)


