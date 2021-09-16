
const { ethers } = require("hardhat");
require('dotenv').config();
import { Contract, providers, Wallet, utils } from 'ethers';


const WETHAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
let owner:string;
let USDC:Contract;
let DAI:Contract;
let liquidityProvider: Contract;

const deployLiquidityProvider = async ():Promise<Contract> => {
  const LiquidityProvider = await ethers.getContractFactory("LiquidityProvider");
  const liquidityProvider = await LiquidityProvider.deploy("0xC36442b4a4522E871399CD717aBDD847Ab11FE88");
  await liquidityProvider.deployed();
  return liquidityProvider;
}

const swapTokensV2 = async () => {
    console.log("Swapping tokens using UNIv2");
    const accounts = await ethers.getSigners();
    const uniswapRouter = await ethers.getContractAt("@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol:IUniswapV2Router02", "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");
    await uniswapRouter.swapExactETHForTokens(
      0,
      [WETHAddress, USDCAddress],
      await accounts[0].getAddress(),
      "1000000000000000000000000", {value: ethers.utils.parseEther("100").toString()});
    await uniswapRouter.swapExactETHForTokens(
      0,
      [WETHAddress, DAIAddress],
      await accounts[0].getAddress(),
      "1000000000000000000000000", {
          value: ethers.utils.parseEther("100").toString()
      }
  );
}

const checkBalance = async (userAddress: string) => {
  console.log("Checking Balance for: " + userAddress);
  const USDCBalance = await USDC.balanceOf(userAddress);
  const DAIBalance = await DAI.balanceOf(userAddress);
  console.log({USDCBalance: USDCBalance.toString(), DAIBalance: DAIBalance.toString()});
  
}

const transferTokens = async (receiver: string) => {
  await USDC.transfer(receiver, ethers.utils.parseUnits("10000.0", 6));
  await DAI.transfer(receiver, ethers.utils.parseUnits("10000.0", 18));
}

const approveTokens = async (userAddress: string) => {
  await USDC.approve(userAddress, ethers.utils.parseUnits("10000.0", 6));
  await DAI.approve(userAddress, ethers.utils.parseUnits("10000.0", 18));
}

const checkAllowance = async (spender: string, owner: string) => {
  console.log("Checking allowance for: " + spender, owner);
  const USDCBalance = await USDC.allowance(owner, spender);
  const DAIBalance = await DAI.allowance(owner, spender);
  console.log({USDCBalance: USDCBalance.toString(), DAIBalance: DAIBalance.toString()});
}

const driver = async () => {
  USDC = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",USDCAddress);
  DAI = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", DAIAddress);
  const accounts = await ethers.getSigners();
  owner = await accounts[0].getAddress();
  await checkBalance(owner);
  await swapTokensV2();
  await checkBalance(owner);
  liquidityProvider = await deployLiquidityProvider();
  console.log("LiquidityProvider deployed to:", liquidityProvider.address);
  // await checkBalance(liquidityProvider.address);
  // await transferTokens(liquidityProvider.address);
  // await checkBalance(liquidityProvider.address);
  await approveTokens(liquidityProvider.address);
  await checkAllowance(liquidityProvider.address, owner);
  
  await liquidityProvider.mintNewPosition();

}
 
driver();