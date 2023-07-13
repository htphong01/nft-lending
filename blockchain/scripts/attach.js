const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    //* Get network */
    const accounts = await ethers.getSigners();

    //* Loading contract factory */
    // const PermittedNFTs = await ethers.getContractFactory("PermittedNFTs");
    // const permittedNFT = PermittedNFTs.attach('0x6b556f1A587ebEa1b3A42Ba9F6275966CA17BCd5');
    // const tx = await permittedNFT.connect(accounts[0]).setNFTPermit('0xf31a2e258bec65a46fb54cd808294ce215070150', true)
    // console.log(tx);

    const DirectLoanFixedOffer = await ethers.getContractFactory("DirectLoanFixedOffer", {
        libraries: {
            LoanChecksAndCalculations: "0x33C3e66cdf0CeDd329EE0cC12cF225D0cA97067c",
            NFTfiSigningUtils: "0xE92ACe166a6D50400300A6015F7a772B1Ea97De7",
        },
    });
    const loan = DirectLoanFixedOffer.attach("0x996Be38468205284E75bE39896928dB3Df293C43");
    const tx = await loan.connect(accounts[0]).setERC20Permit("0x747ae7Dcf3Ea10D242bd17bA5dfA034ca6102108", true);
    console.log(tx);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
