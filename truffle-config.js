require('babel-register');
require('babel-polyfill');
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const path = require("path");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",    // Ganache network id
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(
          process.env.PRIVATE_KEY, // Single private key
          `https://kovan.infura.io/v3/${process.env.INFURA_PROJECT_ID}` // Use PROJECT_ID
        )
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 42
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: path.join(__dirname, "client/src/contracts"), // Match your current setup
  migrations_directory: './migrations/',
  compilers: {
    solc: {
      version: "0.8.19",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
      }
    }
  },
  mocha: {
    timeout: 100000
  }
}