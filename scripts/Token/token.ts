
const hre = require("hardhat");
require('dotenv').config();

async function main() {
    const accounts = await hre.ethers.getSigners();
    const owner = accounts[0];
    // console.log(await owner.getAddress());
    const token = await hre.ethers.getContractAt("Token", "0x78199F2BA24fB7E46EB0581bD85E3C75C84f1Dac");
  // console.log((await token.balanceOf(await owner.getAddress())).toString());

  // const TokenAttack = await hre.ethers.getContractFactory("TokenAttack");
  // const tokenAttack = await TokenAttack.deploy();
  // await tokenAttack.deployed();
  // console.log("TokenAttack: "+ tokenAttack.address);
  
  // await tokenAttack.transfer(await owner.getAddress(), "10000000000")
  console.log((await token.balanceOf(await owner.getAddress())).toString());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
