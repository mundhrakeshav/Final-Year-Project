//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "./EIP712Base.sol";

contract StateChannel is EIP712Base("EIP712Base", "1") {
    uint private challengeDuration = 12 hours;
    uint public expiresAt;
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
    // , uint _expiresAt
    )  {
        users = _users;
        isUser[_users[0]] = true;
        isUser[_users[1]] = true;
        // expiresAt = _expiresAt;
        console.log(address(this));
    }

    function addTransaction(Transaction memory transactionToBeAdded) public checkCaller {
        transactionToBeExecuted = transactionToBeAdded;
    }

    function executeTransaction() public checkCaller {
        transactionToBeExecuted.to.call{value: transactionToBeExecuted.value}(transactionToBeExecuted.data);
    }

    function challenge(Transaction[2] memory recentTransactions,Signature[2] memory signatures) public {
        for (uint256 index = 0; index < recentTransactions.length; index++) {
            verify(recentTransactions[index], signatures[index]);
        }
        require(recentTransactions[0].nonce > transactionToBeExecuted.nonce, "Invalid Nonce");
        delete transactionToBeExecuted;
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
        console.log(signature.v);
        console.logBytes32(signature.r);
        console.logBytes32(signature.s);
        
        address signer = ecrecover(toTypedMessageHash(hashTransaction(transaction)), signature.v, signature.r, signature.s);
        require(signer != address(0), "Invalid signature");
        require(signer == transaction.from, "UnVerified");
    }

} 