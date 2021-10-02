
const { ethers, } = require("hardhat");
require('dotenv').config();
const fallBackInstanceAddress = "0xA15aECA54b64Bb957bb9DD1F4080e1c3Af74536E";
async function getOwner() {
    const accounts = await ethers.getSigners();
    const owner = accounts[0];
    console.log(await owner.getAddress());
    console.log(await owner.provider.getBalance(fallBackInstanceAddress));
    const fallback = await ethers.getContractAt("Fallback", fallBackInstanceAddress);
    console.log("Owner: " + await fallback.owner());
    console.log("Contri: " + await fallback.contributions(await fallback.owner()));
    // await fallback.contribute({value: ethers.utils.parseEther("0.0001")});
    // await owner.sendTransaction({ to: fallBackInstanceAddress, value: ethers.utils.parseEther("0.001") });
    // console.log("Owner: " + await fallback.owner());
    // console.log(await owner.provider.getBalance(fallBackInstanceAddress));
    await fallback.withdraw();
}

getOwner()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
// npx hardhat run scripts/Fallback/fallback.ts --network rinkeby