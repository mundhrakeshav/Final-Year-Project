
const { ethers, } = require("hardhat");
require('dotenv').config();
const fallOutInstanceAddress = "0x814462db4EE73e934776617c77c6b5fa8Ad0DBFE";
async function main() {
    const accounts = await ethers.getSigners();
    const owner = accounts[0];
    const fallout = await ethers.getContractAt("Fallout", fallOutInstanceAddress);
    console.log("Owner: " + await fallout.owner());
    console.log(await fallout.Fal1out());
    
    console.log("Owner: " + await fallout.owner());

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
// npx hardhat run scripts/Fallback/fallback.ts --network rinkeby