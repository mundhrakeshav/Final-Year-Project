//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

// import "hardhat/console.sol";
import "./EIP712Base.sol";

contract StateChannel is EIP712Base("EIP712Base", "1") {
    uint private challengeDuration = 12 hours;
    uint private txAddedAt;

    address payable[2] public users;
    mapping (address => bool) public isUser;

    bytes32 private constant TRANSACTION_TYPEHASH = keccak256(bytes("Transaction(address from,address to,bytes data,uint256 value,uint256 nonce)"));

    struct Transaction {
        address from;
        address to;
        bytes data;
        uint256 value;
        uint256 nonce;
    }

    struct Signature{
        bytes32 r;
        bytes32 s;
        uint8 v;
    }

    Transaction public transactionToBeExecuted;

    modifier checkCaller() {
        require(msg.sender == users[0] || msg.sender == users[1], "INVALID: Users Only");
        _;
    }

    constructor(address payable[2] memory _users
    )  {
        users = _users;
        isUser[_users[0]] = true;
        isUser[_users[1]] = true;
    }

    function addTransaction(Transaction memory transactionToBeAdded) public checkCaller {
        transactionToBeExecuted = transactionToBeAdded;
        txAddedAt = block.timestamp;
    }

    function executeTransaction() public checkCaller {
        require(block.timestamp >= txAddedAt + challengeDuration, "INVALID: Cannot be executed before challenge period");
        transactionToBeExecuted.to.call{value: transactionToBeExecuted.value}(transactionToBeExecuted.data);
    }

    function challenge(Transaction memory recentTransaction, Signature memory signature) public {
        require(recentTransaction.nonce > transactionToBeExecuted.nonce, "Invalid Nonce");
        verify(recentTransaction, signature);
        delete transactionToBeExecuted;
        transactionToBeExecuted = recentTransaction;
    }

    function hashTransaction(Transaction memory transaction) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            TRANSACTION_TYPEHASH,
            transaction.from,
            transaction.to,
            keccak256(transaction.data),
            transaction.value,
            transaction.nonce
        ));
    }

    function verify(Transaction memory transaction, Signature memory signature) public view { 
        address signer = ecrecover(toTypedMessageHash(hashTransaction(transaction)), signature.v, signature.r, signature.s);
        require(signer != address(0), "Invalid signature");
        require(signer == transaction.from, "UnVerified");
    }

    fallback() external payable {
        // console.log("INVALID: Invalid Transaction");
    }

} 