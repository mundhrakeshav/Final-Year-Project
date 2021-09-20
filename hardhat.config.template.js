import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "solidity-coverage";
import "@tenderly/hardhat-tenderly";
import "hardhat-gas-reporter";
import dotenv from 'dotenv';
dotenv.config();
//This is a template hardhat config file just to support tenderly


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);

  }
});

module.exports = {
 solidity: {
    version: "0.7.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1
      }
    }
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 21
  },
  networks: {

  },
  tenderly: {
		username: "<username>",
		project: "<project>",
	}
}