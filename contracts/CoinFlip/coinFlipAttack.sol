pragma solidity ^0.6.0;

contract coinFlipAttack {
    address public coinFlip = 0x5677e8DA79a7169985EfF54d0Dc1258C12B44a13;


//   function flip(bool _guess) public returns (bool) {
//     uint256 blockValue = uint256(blockhash(block.number.sub(1)));

//     if (lastHash == blockValue) {
//       revert();
//     }

//     lastHash = blockValue;
//     uint256 coinFlip = blockValue.div(FACTOR);
//     bool side = coinFlip == 1 ? true : false;

//     if (side == _guess) {
//       consecutiveWins++;
//       return true;
//     } else {
//       consecutiveWins = 0;
//       return false;
//     }
//   }

}