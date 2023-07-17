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
            LoanChecksAndCalculations: "0x80d747809c5bD1cE45a5Bdbac31a155C5118c16d",
            NFTfiSigningUtils: "0x9afDA91Ea113EF984E5dd015427f9Db2AB94a038",
        },
    });
    const loan = DirectLoanFixedOffer.attach("0xFec95a1Fc4b667695693ea58F415BD3dA4F70CEE");
    console.log(await loan.loanIdToLoan("0x2cefb38b08949ddac90560fd2efabb259ac6960aeba8875a5d16cc1a948ce7af"));
    // const tx = await loan.connect(accounts[0]).setERC20Permit("0x747ae7Dcf3Ea10D242bd17bA5dfA034ca6102108", true);
    // console.log(tx);

    // const WXCR = await ethers.getContractFactory("WXCR");
    // const wXCR = WXCR.attach('0x747ae7Dcf3Ea10D242bd17bA5dfA034ca6102108');
    // await wXCR.connect(accounts[0]).mint('0xc8429C05315Ae47FFc0789A201E5F53E93D591D4', ethers.utils.parseUnits('200', 18));

    // const Chonk = await ethers.getContractFactory('ChonkSociety');
    // const chonk = Chonk.attach('0xf31a2e258bec65a46fb54cd808294ce215070150');
    // console.log(await chonk.ownerOf(1));
    // await chonk.connect(accounts[0]).mint('0xc8429C05315Ae47FFc0789A201E5F53E93D591D4', 1);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
