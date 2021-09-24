import axios, { AxiosRequestConfig } from "axios";
const { ethers } = require("hardhat");
require('dotenv').config();
import { Contract, providers, Wallet, utils, Signer } from 'ethers';

const WETHAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const oneInchSwapper = "0x11111112542d85b3ef69ae05771c2dccff4faa26";
let owner: Signer;
let USDC:Contract;
let DAI:Contract;

const instance = axios.create({
  baseURL: 'https://api.1inch.exchange/v3.0/1',
});

const healthCheck = async () => { 
    const config: AxiosRequestConfig = {
        data: {}
    }
    const res = await instance.get("/healthcheck", config)
    console.log(res.data);
}

const setup = async () => {
    const accounts = await ethers.getSigners();
    owner = accounts[0];

    USDC = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",USDCAddress);
    DAI = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", DAIAddress);
}

const swapTokensV2 = async () => {
    console.log("Swapping ETH to USDC using UNIv2");
    const accounts = await ethers.getSigners();
    const uniswapRouter = await ethers.getContractAt("@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol:IUniswapV2Router02", "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");
    await uniswapRouter.swapExactETHForTokens(
      0,
      [WETHAddress, USDCAddress],
      await accounts[0].getAddress(),
      "1000000000000000000000000", {value: ethers.utils.parseEther("100").toString()});
//     await uniswapRouter.swapExactETHForTokens(
//       0,
//       [WETHAddress, DAIAddress],
//       await accounts[0].getAddress(),
//       "1000000000000000000000000", {
//           value: ethers.utils.parseEther("100").toString()
//       }
//   );
}

const checkBalance = async (userAddress: string) => {
  console.log("Checking Balance for: " + userAddress);
  const USDCBalance = await USDC.balanceOf(userAddress);
  const DAIBalance = await DAI.balanceOf(userAddress);
  console.log({USDCBalance: USDCBalance.toString(), DAIBalance: DAIBalance.toString()});
  
}

const checkAllowance = async (spender: string, owner: string) => {
  console.log("Checking allowance for: " + spender, owner);
  const USDCBalance = await USDC.allowance(owner, spender);
  const DAIBalance = await DAI.allowance(owner, spender);
  console.log({USDCBalance: USDCBalance.toString(), DAIBalance: DAIBalance.toString()});
}

const getQuote = async () => { 
    console.log("Getting quote for USDC ==> DAI from 1inch");
    const amount = ethers.utils.parseUnits("1000", "6").toString();
    const res = await instance.get(`/quote?fromTokenAddress=${USDCAddress}&toTokenAddress=${DAIAddress}&amount=${amount}`, {})    
    console.log(res.data);
}

const approveOneInch = async () => {
    const callData = await instance.get(`/approve/calldata?tokenAddress=${USDCAddress}&amount=${ethers.utils.parseUnits("1000", "6").toString()}`, {})
    console.log(callData.data);
    await owner.sendTransaction({
        to: callData.data.to,
        data: callData.data.data
    });
}

const approveToken = async (spender: string, amount: string) => {
    console.log("Approving USDC for: " + spender, amount);
    await USDC.approve(spender, amount);
}


const getSwapCallData = async (fromTokenAddress: string, toTokenAddress: string, amount: string, fromAddress: string, destAddress: string, slippage: string) => {
    const swapData = await instance.get(`/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}&fromAddress=${fromAddress}&destAddress=${destAddress}&slippage=${slippage}&disableEstimate=true`, {})
    console.log(swapData.data);
    
    return swapData.data;
}

const sendTx = async (callData: string, destinationAddress: string) => { 
    await owner.sendTransaction({data: callData, to: destinationAddress});
}

const driver = async () => { 
    await setup();
    await approveOneInch();
    await checkAllowance(oneInchSwapper, await owner.getAddress());
    await checkBalance(await owner.getAddress());
    await healthCheck();
    await swapTokensV2();
    await getQuote();
    await checkBalance(await owner.getAddress());
    const swapData = await getSwapCallData(USDCAddress, DAIAddress, ethers.utils.parseUnits("1000", "6").toString(), await owner.getAddress(), await owner.getAddress(), "1");
    await sendTx(swapData.tx.data, oneInchSwapper);
    await checkBalance(await owner.getAddress());
    await checkAllowance(oneInchSwapper, await owner.getAddress());

    // await approveToken(oneInchSwapper, utils.parseUnits("10000", "6").toString());
    // await checkAllowance(oneInchSwapper, await owner.getAddress());

}

driver();