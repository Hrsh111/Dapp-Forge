// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Migrations
 * @dev Contract to manage deployment migrations
 * Compatible with Truffle and modern Solidity versions
 */
contract Migrations {
    address public owner;
    uint public lastCompletedMigration;

    /**
     * @dev Modifier to restrict access to owner only
     */
    modifier restricted() {
        require(
            msg.sender == owner,
            "This function is restricted to the contract's owner"
        );
        _;
    }

    /**
     * @dev Constructor sets the original owner of the contract to the sender account
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Set the last completed migration
     * @param completed The migration number that was completed
     */
    function setCompleted(uint completed) public restricted {
        lastCompletedMigration = completed;
    }

    /**
     * @dev Upgrade the contract to a new address
     * @param newAddress The address of the new contract
     */
    function upgrade(address newAddress) public restricted {
        Migrations upgraded = Migrations(newAddress);
        upgraded.setCompleted(lastCompletedMigration);
    }
}