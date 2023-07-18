const { ethers } = require("hardhat");
const { deployProxyAndLogger, contractFactoriesLoader } = require("../utils/deploy.utils");
const { blockTimestamp } = require('../utils/test.utils');
const fs = require("fs");
require("dotenv").config();
const env = process.env;

async function main() {
    //* Get network */
    const accounts = await ethers.getSigners();

    console.log("==========================================================================");
    console.log("ACCOUNTS:");
    console.log("==========================================================================");
    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        console.log(` Account ${i}: ${account.address}`);
    }

    //* Loading contract factory */
    const PermittedNFTs = await ethers.getContractFactory("PermittedNFTs");
    const LoanChecksAndCalculations = await hre.ethers.getContractFactory('LoanChecksAndCalculations');
    const NFTfiSigningUtils = await hre.ethers.getContractFactory('NFTfiSigningUtils');
    const LendingPool = await ethers.getContractFactory("LendingPoolV3");
    const WXCR = await ethers.getContractFactory("WXCR");
    const LiquidateNFTPool = await ethers.getContractFactory("LiquidateNFTPool");

    //* Deploy contracts */
    console.log("==========================================================================");
    console.log("DEPLOYING CONTRACTS");
    console.log("==========================================================================");

    // let loanChecksAndCalculations = await LoanChecksAndCalculations.deploy();
    // await loanChecksAndCalculations.deployed()
    // console.log("Library LoanChecksAndCalculations deployed to:", loanChecksAndCalculations.address);

    // let nftfiSigningUtils = await NFTfiSigningUtils.deploy();
    // await nftfiSigningUtils.deployed()
    // console.log("Library NFTfiSigningUtils deployed to:", nftfiSigningUtils.address);

    // const permittedNFTs = await PermittedNFTs.deploy(accounts[0].address);
    // await permittedNFTs.deployed();
    // console.log("PermittedNFTs                        deployed to:>>", permittedNFTs.address);

    const liquidateNFTPool = await LiquidateNFTPool.deploy(accounts[0].address);
    await liquidateNFTPool.deployed();
    console.log("LiquidateNFTPool                        deployed to:>>", liquidateNFTPool.address);

    const loanChecksAndCalculations = await LoanChecksAndCalculations.attach("0x33C3e66cdf0CeDd329EE0cC12cF225D0cA97067c");
    const nftfiSigningUtils = await NFTfiSigningUtils.attach("0xE92ACe166a6D50400300A6015F7a772B1Ea97De7");
    const permittedNFTs = await PermittedNFTs.attach("0x6b556f1A587ebEa1b3A42Ba9F6275966CA17BCd5");
    const wXCR = await WXCR.attach("0x747ae7Dcf3Ea10D242bd17bA5dfA034ca6102108");

    const DirectLoanFixedOffer = await ethers.getContractFactory("DirectLoanFixedOffer", {
        libraries: {
            LoanChecksAndCalculations: loanChecksAndCalculations.address,
            NFTfiSigningUtils: nftfiSigningUtils.address
        },
    });

    const lendingPool = await LendingPool.deploy(wXCR.address, "0x4F9EF07A6DDF73494D2fF51A8f7B78e9c5815eb2", "10000000000000000000", 0);
    await lendingPool.deployed();
    console.log("LendingPool                     deployed to:>>", lendingPool.address);

    const directLoanFixedOffer = await DirectLoanFixedOffer.deploy(accounts[0].address, lendingPool.address, liquidateNFTPool.address, permittedNFTs.address, ["0x747ae7Dcf3Ea10D242bd17bA5dfA034ca6102108"]);
    await directLoanFixedOffer.deployed();
    console.log("DirectLoanFixedOffer                        deployed to:>>", directLoanFixedOffer.address);

    console.log("==========================================================================");
    console.log("VERIFY CONTRACTS");
    console.log("==========================================================================");

    // await hre
    //     .run("verify:verify", {
    //         address: wXCR.address
    //     })
    //     .catch(console.log);

    // await hre
    //     .run("verify:verify", {
    //         address: wXCRS.address
    //     })
    //     .catch(console.log);

    // await hre
    //     .run("verify:verify", {
    //         address: lendingPool.address,
    //         constructorArguments: [wXCR.address,
    //         wXCRS.address
    //         ]
    //     })
    //     .catch(console.log);

    console.log("==========================================================================");
    console.log("DONE");
    console.log("==========================================================================");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
