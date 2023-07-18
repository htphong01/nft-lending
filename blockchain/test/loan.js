const { ethers } = require("hardhat");
const { getRandomInt, getEncodeOffer, getEncodedSignature, getMessage } = require("./utils");

let directLoanFixedOffer;
let chonkSociety;
let wXCR;
let deployer;
let lender;
let borrower;
let accounts;

const TOKEN_1 = ethers.utils.parseUnits("1", 18);
let ONE_DAY = 24 * 60 * 60;

describe.only("Loan", () => {
    beforeEach(async () => {
        [deployer, lender, borrower, treasury, ...accounts] = await ethers.getSigners();

        const PermittedNFTs = await ethers.getContractFactory("PermittedNFTs");
        const LoanChecksAndCalculations = await hre.ethers.getContractFactory("LoanChecksAndCalculations");
        const NFTfiSigningUtils = await hre.ethers.getContractFactory("NFTfiSigningUtils");
        const LiquidateNFTPool = await ethers.getContractFactory("LiquidateNFTPool");
        const LendingPool = await ethers.getContractFactory("LendingPoolV3");
        const WXCR = await ethers.getContractFactory("WXCR");

        liquidateNFTPool = await LiquidateNFTPool.deploy(deployer.address);
        await liquidateNFTPool.deployed();

        let loanChecksAndCalculations = await LoanChecksAndCalculations.deploy();
        await loanChecksAndCalculations.deployed();

        let nftfiSigningUtils = await NFTfiSigningUtils.deploy();
        await nftfiSigningUtils.deployed();

        const DirectLoanFixedOffer = await ethers.getContractFactory("DirectLoanFixedOffer", {
            libraries: {
                LoanChecksAndCalculations: loanChecksAndCalculations.address,
                NFTfiSigningUtils: nftfiSigningUtils.address,
            },
        });

        const permittedNFTs = await PermittedNFTs.deploy(deployer.address);
        await permittedNFTs.deployed();

        wXCR = await WXCR.deploy();
        await wXCR.deployed();

        const lendingPool = await LendingPool.deploy(wXCR.address, treasury.address, "10000000000000000000", 0);
        await lendingPool.deployed();

        directLoanFixedOffer = await DirectLoanFixedOffer.deploy(deployer.address, lendingPool.address, liquidateNFTPool.address, permittedNFTs.address, [wXCR.address]);
        await directLoanFixedOffer.deployed();

        const ChonkSociety = await ethers.getContractFactory("ChonkSociety");
        chonkSociety = await ChonkSociety.deploy("https://chonksociety.s3.us-east-2.amazonaws.com/metadata/");
        await chonkSociety.deployed();

        // early transaction
        await directLoanFixedOffer.connect(deployer).setERC20Permit(wXCR.address, true);
        await permittedNFTs.connect(deployer).setNFTPermit(chonkSociety.address, true);
        await chonkSociety.connect(borrower).mint(borrower.address, 10);
        await wXCR.connect(lender).mint(lender.address, TOKEN_1.mul(100));
        await wXCR.connect(borrower).mint(borrower.address, TOKEN_1.mul(100));

        await wXCR.connect(borrower).mint(lendingPool.address, TOKEN_1.mul(100));
        await lendingPool.approve(directLoanFixedOffer.address, ethers.constants.MaxUint256);
    });

    it("test", async () => {
        await chonkSociety.connect(borrower).approve(directLoanFixedOffer.address, 1);
        await wXCR.connect(lender).approve(directLoanFixedOffer.address, TOKEN_1.mul(100));

        const offer = {
            principalAmount: TOKEN_1.mul(15),
            maximumRepaymentAmount: TOKEN_1.mul(18),
            nftCollateralId: 1,
            nftCollateralContract: chonkSociety.address,
            duration: ONE_DAY * 30,
            adminFeeInBasisPoints: 25,
            erc20Denomination: wXCR.address,
        };

        const encodeOffer = getEncodeOffer(offer);

        const signature = {
            nonce: getRandomInt(),
            expiry: 1689267600,
            signer: lender.address,
        };

        const encodeSignature = getEncodedSignature(signature);

        const message = getMessage(encodeOffer, encodeSignature, directLoanFixedOffer.address, 31337);
        const provider = ethers.provider;
        const signer = provider.getSigner(lender.address);
        // console.log("test message", ethers.utils.hashMessage(message));
        signature.signature = await signer.signMessage(message);

        // const signerAddress = ethers.utils.verifyMessage(ethers.utils.hashMessage(message), signature.signature);
        const loanId = "0xebe4fe30af161bb8b26d55867c264d98c256cbfe364c00ea2cb779d1233d67c9";
        await directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature);

        await wXCR.connect(borrower).approve(directLoanFixedOffer.address, TOKEN_1.mul(100));
        await wXCR.connect(borrower).mint(borrower.address, TOKEN_1.mul(3));
        await directLoanFixedOffer.connect(borrower).payBackLoan(loanId);
        console.log(await chonkSociety.ownerOf(1), borrower.address);
    });

    it.only("test pay back", async () => {
        await chonkSociety.connect(borrower).approve(directLoanFixedOffer.address, 1);
        await wXCR.connect(lender).approve(directLoanFixedOffer.address, TOKEN_1.mul(100));

        const offer = {
            principalAmount: TOKEN_1.mul(15),
            maximumRepaymentAmount: TOKEN_1.mul(18),
            nftCollateralId: 1,
            nftCollateralContract: chonkSociety.address,
            duration: ONE_DAY * 30,
            adminFeeInBasisPoints: 25,
            erc20Denomination: wXCR.address,
        };

        const encodeOffer = getEncodeOffer(offer);

        const signature = {
            nonce: getRandomInt(),
            expiry: 1689699600,
            signer: lender.address,
        };

        const encodeSignature = getEncodedSignature(signature);

        const message = getMessage(encodeOffer, encodeSignature, directLoanFixedOffer.address, 31337);
        const provider = ethers.provider;
        const signer = provider.getSigner(lender.address);
        // console.log("test message", ethers.utils.hashMessage(message));
        signature.signature = await signer.signMessage(message);

        // const signerAddress = ethers.utils.verifyMessage(ethers.utils.hashMessage(message), signature.signature);
        const loanId = "0xebe4fe30af161bb8b26d55867c264d98c256cbfe364c00ea2cb779d1233d67c9";
        await directLoanFixedOffer.connect(borrower).acceptOfferLendingPool(loanId, offer, [signature, signature, signature]);

        await wXCR.connect(borrower).approve(directLoanFixedOffer.address, TOKEN_1.mul(100));
        await wXCR.connect(borrower).mint(borrower.address, TOKEN_1.mul(3));

        await directLoanFixedOffer.connect(borrower).payBackLoan(loanId);
        console.log(await chonkSociety.ownerOf(1), borrower.address);
    });
});
