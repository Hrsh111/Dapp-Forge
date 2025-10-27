# Project Files Documentation

This document provides a brief description of each file in the project, explaining its purpose and role in the DApp.

## Root Directory

- `.gitattributes`: Git configuration file that specifies how certain files should be treated.
- `PROJECT_DOCUMENTATION.md`: Comprehensive documentation of the project, including concepts and implementation details.
- `README.md`: Basic project information and setup instructions.
- `package.json`: Node.js project configuration file that lists dependencies and scripts for the backend.
- `package-lock.json`: Auto-generated file that locks dependency versions for consistent installations.
- `truffle-config.js`: Configuration file for Truffle framework, defining networks, compiler options, and directory paths.

## Smart Contracts

- `/src/contracts/Token.sol`: A simple token contract that currently only defines a name property.
- `/src/contracts/migrations.sol`: Utility contract used by Truffle to track which migrations have been applied to the blockchain.
- `/src/.gitkeep`: Empty file to ensure Git tracks the otherwise empty directory.

## Migrations

- `/migrations/1_initial_migration.js`: Deploys the Migrations contract to the blockchain.
- `/migrations/2_deploy_contracts.js`: Deploys the Token contract to the blockchain.
- `/migrations/.gitkeep`: Empty file to ensure Git tracks the otherwise empty directory.

## Testing

- `/test/Token.test.js`: Contains tests for the Token contract using Chai assertion library.
- `/test/.babelrc`: Babel configuration file for transpiling modern JavaScript in tests.
- `/test/.env`: Environment variables for testing.
- `/test/.gitkeep`: Empty file to ensure Git tracks the otherwise empty directory.
- `/test/package.json`: Node.js project configuration for the test directory with its own dependencies.
- `/test/package-lock.json`: Auto-generated file that locks dependency versions for the test directory.

## Frontend (Client)

- `/client/package.json`: Node.js project configuration for the React frontend.
- `/client/package-lock.json`: Auto-generated file that locks dependency versions for the frontend.
- `/client/README.md`: Information about the React frontend.
- `/client/.gitignore`: Specifies files that Git should ignore in the client directory.

### Client Public Files

- `/client/public/index.html`: The main HTML file that serves as the entry point for the React app.
- `/client/public/favicon.ico`: Website icon displayed in browser tabs.
- `/client/public/logo192.png` and `/client/public/logo512.png`: React logo images in different sizes.
- `/client/public/manifest.json`: Web app manifest file for Progressive Web App functionality.
- `/client/public/robots.txt`: Instructions for web crawlers.

### Client Source Files

- `/client/src/App.js`: Main React component that renders the application UI.
- `/client/src/App.css`: Styles for the App component.
- `/client/src/App.test.js`: Tests for the App component.
- `/client/src/index.js`: Entry point for the React application that renders the App component.
- `/client/src/index.css`: Global styles for the application.
- `/client/src/logo.svg`: React logo displayed in the app.
- `/client/src/reportWebVitals.js`: Utility to measure performance metrics.
- `/client/src/setupTests.js`: Configuration for React testing.
- `/client/src/contracts/`: Directory where compiled contract artifacts are stored for frontend interaction.

## Key Relationships

1. Smart contracts in `/src/contracts/` are compiled and their artifacts are placed in `/client/src/contracts/` (configured in `truffle-config.js`).
2. Migration scripts in `/migrations/` deploy the contracts to the blockchain.
3. Tests in `/test/` verify the functionality of the smart contracts.
4. The React frontend in `/client/` interacts with the deployed contracts using Web3.js.

## Development Workflow

1. Write/modify smart contracts in `/src/contracts/`
2. Create/update migration scripts in `/migrations/`
3. Write tests in `/test/`
4. Run tests with `npm test`
5. Deploy contracts with `npm run migrate`
6. Develop the frontend in `/client/`
7. Start the frontend with `npm run client`