import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "solidity-coverage";
import "@tenderly/hardhat-tenderly";
import "hardhat-gas-reporter";
import dotenv from 'dotenv';
dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);

  }
});

const config: HardhatUserConfig = {
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
    hardhat: {
      forking: {
        url: "https://mainnet.infura.io/v3/5297f2437c744cf384665ce6a3722c29",
      }
    }
  },
  tenderly: {
		username: "<Username>",
		project: "<project>"
	}
};

export default config;
