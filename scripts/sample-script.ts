
const hre = require("hardhat");
require('dotenv').config();

async function main() {
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");
  await greeter.deployed();
  console.log("Greeter deployed to:", greeter.address);

  await hre.tenderly.persistArtifacts({
    name: "UniswapV3Pool",
    address: "0xa63b490aa077f541c9d64bfc1cc0db2a752157b5"
  });
  
  await hre.tenderly.verify({
    name: "UniswapV3Pool",
    address: "0xa63b490aa077f541c9d64bfc1cc0db2a752157b5",
  })}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
