const { ethers } = require("hardhat");
const { deployProxyAndLogger, contractFactoriesLoader } = require("../utils/deploy.utils");
const { blockTimestamp } = require("../utils/test.utils");
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
    const LoanChecksAndCalculations = await hre.ethers.getContractFactory("LoanChecksAndCalculations");
    const NFTfiSigningUtils = await hre.ethers.getContractFactory("NFTfiSigningUtils");

    //* Deploy contracts */
    console.log("==========================================================================");
    console.log("DEPLOYING CONTRACTS");
    console.log("==========================================================================");

    let loanChecksAndCalculations = await LoanChecksAndCalculations.deploy();
    await loanChecksAndCalculations.deployed();
    console.log("Library LoanChecksAndCalculations deployed to:", loanChecksAndCalculations.address);

    let nftfiSigningUtils = await NFTfiSigningUtils.deploy();
    await nftfiSigningUtils.deployed();
    console.log("Library NFTfiSigningUtils deployed to:", nftfiSigningUtils.address);

    const DirectLoanFixedOffer = await ethers.getContractFactory("DirectLoanFixedOffer", {
        libraries: {
            LoanChecksAndCalculations: loanChecksAndCalculations.address,
            NFTfiSigningUtils: nftfiSigningUtils.address,
        },
    });

    const permittedNFTs = await PermittedNFTs.deploy(accounts[0].address);
    await permittedNFTs.deployed();
    console.log("PermittedNFTs                        deployed to:>>", permittedNFTs.address);

    const directLoanFixedOffer = await DirectLoanFixedOffer.deploy(accounts[0].address, permittedNFTs.address, ["0x747ae7Dcf3Ea10D242bd17bA5dfA034ca6102108"]);
    await directLoanFixedOffer.deployed();
    console.log("DirectLoanFixedOffer                        deployed to:>>", directLoanFixedOffer.address);

    await permittedNFTs.connect(accounts[0]).setNFTPermit("0xf31a2e258bec65a46fb54cd808294ce215070150", true);
    await loan.connect(accounts[0]).setERC20Permit("0x747ae7Dcf3Ea10D242bd17bA5dfA034ca6102108", true);
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
