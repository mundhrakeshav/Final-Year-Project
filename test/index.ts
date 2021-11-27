import { expect, util } from 'chai';
import { ethers, network } from 'hardhat';
import { getSignatureParameters } from "./helper/getSignatureParameters"

describe('StateChannel', function () {

  
    beforeEach(async function () {
        const [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
        this.owner = owner;
        this.addr1 = addr1;
        this.addr2 = addr2;
        this.addr3 = addr3;
        this.addr4 = addr4;
        this.addr5 = addr5;
        this.ownerPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
        this.addr1PrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";

        const Statechannel = await ethers.getContractFactory("StateChannel");
        this.statechannel = await Statechannel.deploy([this.owner.address, this.addr1.address]);
        await this.statechannel.deployed();
        this.domain = {
          name: 'EIP712Base',
          version: '1',
          salt: ethers.utils.hexZeroPad((ethers.BigNumber.from(31337)).toHexString(), 32),
          verifyingContract: this.statechannel.address,
        };
        console.log(this.domain);
      
      this.types = {
          Transaction: [
              { name: 'from', type: 'address'},
              { name: 'to', type: 'address' },
              { name: 'data', type: 'bytes' },
              { name: 'value', type: 'uint256' },
              { name: 'nonce', type: 'uint256' },
          ],
      };

  
    })

    it("should verify.", async function () {
      const transaction = {
        from: this.owner.address,
        to: this.statechannel.address,
        data: "0x00",
        value: ethers.utils.parseEther("0"),
        nonce: 0,
      }  

      let signature = await this.owner._signTypedData(this.domain, this.types, transaction);
      console.log(signature);
      signature = getSignatureParameters(signature);
      const data = await this.statechannel.verify(transaction, signature);
      console.log(data);
    })
})