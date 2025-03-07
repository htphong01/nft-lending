import { ethers } from "hardhat";
require("dotenv").config();

async function main() {
  //* Get network */
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  //* Deploy contracts */
  const wXENE = "0x1429859428C0aBc9C2C47C8Ee9FBaf82cFA0F20f";
  const REWARD_PER_BLOCK = ethers.parseEther("1");
  const START_BLOCK = 0;

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

  await lendingPool.setLoan(directLoanFixedOffer);
  await lendingPool.setLendingStake(lendingStake);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
