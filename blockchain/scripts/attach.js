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
            LoanChecksAndCalculations: "0xF46E912d82e49104d332D69c2A9E1Aa0B7440892",
            NFTfiSigningUtils: "0x4A0c460a775404B87674E2fBff48CA6607b7fBB3",
        },
    });

    const loanId = "0x00277cd755dfc5c1ea413df8e2e6f91857aed441a9aa7f5394aca54fedce1332";
    const loan = DirectLoanFixedOffer.attach("0xd5adFc323047792d60D36aF9fF3D7867442127D2");
    console.log(await loan.loanIdToLoan(loanId));
    // const tx = await loan.payBackLoan(loanId);
    // console.log(tx)
    // const tx = await loan.connect(accounts[0]).setERC20Permit("0x747ae7Dcf3Ea10D242bd17bA5dfA034ca6102108", true);
    // console.log(tx);

    // const WXCR = await ethers.getContractFactory("WXCR");
    // const wXCR = WXCR.attach("0x747ae7Dcf3Ea10D242bd17bA5dfA034ca6102108");
    // console.log(await wXCR.allowance(accounts[0].address, loan.address))
    // await wXCR.connect(accounts[0]).mint("0x4F9EF07A6DDF73494D2fF51A8f7B78e9c5815eb2", ethers.utils.parseUnits("10", 18));
    // await wXCR.connect(accounts[0]).approve("0x9EAef20D024f7C2Ad9461CB6543B845C286B5Cb7", ethers.constants.MaxUint256);

    // const Chonk = await ethers.getContractFactory('ChonkSociety');
    // const chonk = Chonk.attach('0xf31a2e258bec65a46fb54cd808294ce215070150');
    // console.log(await chonk.ownerOf(1));
    // await chonk.connect(accounts[0]).mint('0xc8429C05315Ae47FFc0789A201E5F53E93D591D4', 1);

    // const WXCR = await ethers.getContractFactory("WXCRMultipleInternal");
    // const wXCR = await WXCR.attach("0x1ffB5A1D759C67084ea583C99891b1be34d323d3");
    // const tx = await wXCR.mint(
    //     ["0xc8429C05315Ae47FFc0789A201E5F53E93D591D4", "0x4F9EF07A6DDF73494D2fF51A8f7B78e9c5815eb2", "0xbf4e57eA10b8D19Ad436293818469758145ee915"],
    //     ethers.utils.parseUnits("10")
    // );
    // console.log("tx", tx);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
