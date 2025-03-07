import { ethers } from "hardhat";
import fs from "fs";
require("dotenv").config();

async function main() {
  //* Get network */
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  //* Deploy contracts */
  const MARKETPLACE_FEE_PERCENTAGE = 1000n;
  const REWARD_PER_BLOCK = ethers.parseEther("0.000001");
  const START_BLOCK = 931902n;

  console.log("Deploying [ ChonkSociety ] 🚀");
  const nft = await ethers.deployContract("ChonkSociety", ["test uri"]);
  await nft.waitForDeployment();
  console.log(`Deployed Addresses: ${await nft.getAddress()}\n`);

  console.log("Deploying [ WXENE ] 🚀");
  const wXENE = await ethers.deployContract("WXENE");
  await wXENE.waitForDeployment();
  console.log(`Deployed Addresses: ${await wXENE.getAddress()}\n`);

  console.log("Deploying [ Marketplace ] 🚀");
  const marketplace = await ethers.deployContract("Marketplace", [deployer, deployer, MARKETPLACE_FEE_PERCENTAGE]);
  await marketplace.waitForDeployment();
  console.log(`Deployed Addresses: ${await marketplace.getAddress()}\n`);

  console.log("Deploying [ LoanChecksAndCalculations ] 🚀");
  const loanChecksAndCalculations = await ethers.deployContract("LoanChecksAndCalculations");
  await loanChecksAndCalculations.waitForDeployment();
  console.log(`Deployed Addresses: ${await loanChecksAndCalculations.getAddress()}\n`);

  console.log("Deploying [ NFTfiSigningUtils ] 🚀");
  const nftfiSigningUtils = await ethers.deployContract("NFTfiSigningUtils");
  await nftfiSigningUtils.waitForDeployment();
  console.log(`Deployed Addresses: ${await nftfiSigningUtils.getAddress()}\n`);

  console.log("Deploying [ DirectLoanFixedOffer ] 🚀");
  const directLoanFixedOffer = await ethers.deployContract("DirectLoanFixedOffer", [deployer, [wXENE]], {
    libraries: {
      LoanChecksAndCalculations: loanChecksAndCalculations,
      NFTfiSigningUtils: nftfiSigningUtils,
    },
  });
  await directLoanFixedOffer.waitForDeployment();
  console.log(`Deployed Addresses: ${await directLoanFixedOffer.getAddress()}\n`);

  console.log("Deploying [ LendingPool ] 🚀");
  const lendingPool = await ethers.deployContract("LendingPool", [deployer]);
  await lendingPool.waitForDeployment();
  console.log(`Deployed Addresses: ${await lendingPool.getAddress()}\n`);

  console.log("Deploying [ LendingStake ] 🚀");
  const lendingStake = await ethers.deployContract("LendingStake", [wXENE, lendingPool, REWARD_PER_BLOCK, START_BLOCK]);
  await lendingStake.waitForDeployment();
  console.log(`Deployed Addresses: ${await lendingStake.getAddress()}\n`);

  await marketplace.setPaymentToken(wXENE, true);

  await lendingPool.setLoan(directLoanFixedOffer);
  await lendingPool.setLendingStake(lendingStake);
  await lendingPool.setMarketplace(marketplace);

  await directLoanFixedOffer.setNFTPermit(nft, true);

  // Export deployed addresses to JSON
  const contractAddresses_verify = {
    LoanChecksAndCalculations: await loanChecksAndCalculations.getAddress(),
    NFTfiSigningUtils: await nftfiSigningUtils.getAddress(),
    DirectLoanFixedOffer: await directLoanFixedOffer.getAddress(),
    LendingPool: await lendingPool.getAddress(),
    LendingStake: await lendingStake.getAddress(),
    ChonkSocietyNFT: await nft.getAddress(),
    WXENE: await nft.getAddress(),
    Marketplace: await marketplace.getAddress(),
  };
  const networkChainID = (await ethers.provider.getNetwork()).chainId;
  fs.writeFileSync(`deployments/chain-${networkChainID}.json`, JSON.stringify(contractAddresses_verify));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
