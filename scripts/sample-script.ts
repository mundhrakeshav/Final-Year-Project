
const hre = require("hardhat");
require('dotenv').config();

async function main() {
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");
  await greeter.deployed();
  console.log("Greeter deployed to:", greeter.address);
  
  // run "tenderly login" to login 
  // push contract to tenderly
  //   await hre.tenderly.persistArtifacts({
  //   name: "Greeter",
  //   address: greeter.address
  // });
  
  // await hre.tenderly.verify({
  //   name: "Greeter",
  //   address: greeter.address,
  // })
  //tenderly export <tx hash> to export a tx
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
