
// const { ethers }  = require("hardhat");
// require('dotenv').config();
// const coinFlipInstanceAddress = "0xea50237f8b533B13eb30340c1E09cCc9bc4db99B";
// const coinFlipAttackInstanceAddress = "0xbb4b10cC555F156e28B1d72A377F1D08F9251c67";
// //It fails with script for some reason but works with remix 
// async function main() {
//     const coinFlip = await ethers.getContractAt("CoinFlip", coinFlipInstanceAddress);
//     const coinFlipAttack = await ethers.getContractAt("CoinFlipAttack", coinFlipInstanceAddress);
//     // const CoinFlipAttack = await ethers.getContractFactory("CoinFlipAttack");
//     // const coinFlipAttack = await CoinFlipAttack.deploy();
//     // await coinFlipAttack.deployed();
//   await coinFlipAttack.attackFlip({gasLimit: "10000000"});
//   console.log(await coinFlip.consecutiveWins());
  

// }

// main()
//   .then(() => process.exit(0))
//   .catch(error => {
//     console.error(error);
//     process.exit(1);
//   });
// // npx hardhat run scripts/Fallback/fallback.ts --network rinkeby