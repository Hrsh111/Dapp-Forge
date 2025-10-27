// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./Token.sol";

// TODO:
// [X] Set the fee account
// [X] Deposit Ether
// [X] Withdraw Ether
// [X] Deposit tokens
// [X] Withdraw tokens
// [X] Check balances
// [X] Make order
// [X] Cancel order
// [X] Fill order
// [X] Charge fees

contract Exchange {
    using SafeMath for uint256;
    
    address public feeAccount; // the account that receives exchange
    uint256 public feePercent; // the fee percentage
    address constant ETHER = address(0);// store ether in tokens with blank address
    
    // Track token balances for users
    mapping(address => mapping(address => uint256)) public tokens;
    mapping(uint256 => _Order) public orders;
    uint256 public orderCount;
    mapping(uint256 => bool) public orderCancelled;
    mapping(uint256 => bool) public orderFilled;


    // Events 
    event Deposit(address token, address user, uint256 amount , uint256 balance);
    event Withdraw(address token, address user, uint256 amount, uint256 balance);
    event Trade(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    event Cancel(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
// a way to model the order 
    struct _Order{
        uint256 id;
        address user;
        address tokenGet;
        address tokenGive;
        uint256 amountGive;
        uint256 amountGet;
        uint256 timestamp;
      
    }
    
    // a way to store the order 

    // add the order to the storage 


    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    // fallback: reverts if Ether is sent to this smart contract by mistake 
    fallback() external {
        revert("Fallback is not allowed");
    }
    
      function depositEther() payable public {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
      }
    // Deposit tokens
    function depositToken(address _token, uint256 _amount) public {
        // Don't allow Ether deposits
        require (_token != ETHER, "Use the depositEther function to deposit Ether");
        // Transfer tokens from user to exchange
        require(Token(_token).transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        // Update token balance for user
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }
    function withdrawEther(uint256 _amount) public {
        require(tokens[ETHER][msg.sender] >= _amount, "Insufficient balance");
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
        payable(msg.sender).transfer(_amount);
    }
    function withdrawToken(address _token, uint256 _amount) public {
        require(_token != ETHER, "Use the withdrawEther function to withdraw Ether");
        require(tokens[_token][msg.sender] >= _amount, "Insufficient balance");
        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
        require(Token(_token).transfer(msg.sender, _amount), "Transfer failed");
    }
    function balanceOf(address _token, address _user) public view returns (uint256) {
        return tokens[_token][_user];
    }
    function makeOrder(address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) public {
        orderCount = orderCount.add(1);
        orders[orderCount] = _Order(orderCount, msg.sender, _tokenGet, _tokenGive, _amountGive, _amountGet, block.timestamp);
        emit Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, block.timestamp);
    }
    function cancelOrder(uint256 _id) public {
        // Must be my order 
        // Must be a valid order 
        _Order storage order = orders[_id];
        require(order.id > 0, "Order does not exist");
        require(order.user == msg.sender, "You are not the owner of this order");
        require(!orderCancelled[_id], "Order already cancelled");
        orderCancelled[_id] = true;
        emit Cancel(_id, msg.sender, orders[_id].tokenGet, orders[_id].amountGet, orders[_id].tokenGive, orders[_id].amountGive, block.timestamp);
    }
    function fillOrder(uint256 _id) public {
        require(_id > 0 && _id <= orderCount, "Order does not exist");
        //fetch the order
        require(!orderFilled[_id], "Order already filled");
        require(!orderCancelled[_id], "Order already cancelled");
        _Order storage order = orders[_id];
        _trade(order.id, order.user, order.tokenGet, order.amountGet, order.tokenGive, order.amountGive);
        orderFilled[_id] = true;
    }
    function _trade(uint256 _id, address _user, address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) internal {
         // Fee paid by the user that fills the order, a.k.a.msg.sender 
         // Fee deducted from what the filler is giving (_amountGive)
         uint256 feeAmount = _amountGive.mul(feePercent).div(100);
         uint256 amount = _amountGive.sub(feeAmount);
         
         // Execute the trade
         tokens[_tokenGet][msg.sender] = tokens[_tokenGet][msg.sender].sub(_amountGet);
         tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender].add(amount);
         tokens[_tokenGet][_user] = tokens[_tokenGet][_user].add(_amountGet);
         tokens[_tokenGive][_user] = tokens[_tokenGive][_user].sub(_amountGive);
         
         // Charge fees
         tokens[_tokenGive][feeAccount] = tokens[_tokenGive][feeAccount].add(feeAmount);
        
        emit Trade(_id, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, block.timestamp);
    }
}