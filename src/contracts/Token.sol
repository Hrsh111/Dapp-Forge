// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Token {
    using SafeMath for uint256;
    
    string public name = "DApp Token";
    string public symbol ="DAPP";
    uint256 public decimals=18;
    uint256 public totalSupply;
    
    // Track balances 
    mapping(address=> uint256) public balanceOf;
    
    // Track allowances
    mapping(address => mapping(address => uint256)) public allowance;

    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor(){
        totalSupply=1000000 *(10 ** decimals);
        balanceOf[msg.sender]= totalSupply;
    }
    
    function transfer(address _to, uint256 _value) public returns(bool success){
        require(_to != address(0), "Invalid recipient address");
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        _transfer(msg.sender, _to, _value);
        return true;
    }

    
    // Internal transfer function
    function _transfer(address _from, address _to, uint256 _value) internal {
        require(_to != address(0), "Invalid recipient address");
        balanceOf[_from] = balanceOf[_from].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        emit Transfer(_from, _to, _value);
    }
    
    
    // Approve tokens for spending
    function approve(address _spender, uint256 _value) public returns(bool success){
         require(_spender != address(0), "Invalid recipient address");
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }


    // Transfer tokens using allowance
    function transferFrom(address _from, address _to, uint256 _value) public returns(bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        require(_to != address(0), "Invalid recipient address");
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Insufficient allowance");
        
        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
        _transfer(_from, _to, _value);
        return true;
    }
}
