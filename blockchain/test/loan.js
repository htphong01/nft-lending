const { ethers } = require("hardhat");
const { getRandomInt, getEncodeOffer, getEncodedSignature, getMessage, getTimestamp, skipTime, ZERO_ADDRESS, MAX_UINT256 } = require("./utils");
const { expect } = require("chai");

let directLoanFixedOffer;
let chonkSociety;
let permittedNFTs;
let wXCR;
let deployer;
let lender;
let borrower;
let accounts;

let offer;
let signature;
let loanId;

const TOKEN_1 = ethers.utils.parseUnits("1", 18);
let ONE_DAY = 24 * 60 * 60;

const LoanStatus = {
    ACTIVE: 0,
    REPAID: 1,
    LIQUIDATED: 2,
};

describe.only("Loan", () => {
    beforeEach(async () => {
        [deployer, lender, borrower, ...accounts] = await ethers.getSigners();

        const PermittedNFTs = await ethers.getContractFactory("PermittedNFTs");
        const LoanChecksAndCalculations = await hre.ethers.getContractFactory("LoanChecksAndCalculations");
        const NFTfiSigningUtils = await hre.ethers.getContractFactory("NFTfiSigningUtils");
        const ChonkSociety = await ethers.getContractFactory("ChonkSociety");
        const WXCR = await ethers.getContractFactory("WXCR");

        chonkSociety = await ChonkSociety.deploy("https://chonksociety.s3.us-east-2.amazonaws.com/metadata/");
        await chonkSociety.deployed();

        wXCR = await WXCR.deploy();
        await wXCR.deployed();

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

        permittedNFTs = await PermittedNFTs.deploy(deployer.address);
        await permittedNFTs.deployed();

        directLoanFixedOffer = await DirectLoanFixedOffer.deploy(deployer.address, permittedNFTs.address, [wXCR.address]);
        await directLoanFixedOffer.deployed();

        // early transaction
        await permittedNFTs.connect(deployer).setNFTPermit(chonkSociety.address, true);
        await chonkSociety.connect(borrower).mint(borrower.address, 10);
        await wXCR.connect(lender).mint(lender.address, TOKEN_1.mul(100));

        offer = {
            principalAmount: TOKEN_1.mul(15),
            maximumRepaymentAmount: TOKEN_1.mul(18),
            nftCollateralId: 1,
            nftCollateralContract: chonkSociety.address,
            duration: 10,
            adminFeeInBasisPoints: 25,
            erc20Denomination: wXCR.address,
        };

        const encodeOffer = getEncodeOffer(offer);

        signature = {
            nonce: getRandomInt(),
            expiry: 1692032400,
            signer: lender.address,
        };

        const encodeSignature = getEncodedSignature(signature);

        const message = getMessage(encodeOffer, encodeSignature, directLoanFixedOffer.address, 31337);
        const provider = ethers.provider;
        const signer = provider.getSigner(lender.address);
        // console.log("test message", ethers.utils.hashMessage(message));
        signature.signature = await signer.signMessage(message);

        // const signerAddress = ethers.utils.verifyMessage(ethers.utils.hashMessage(message), signature.signature);
        loanId = "0xebe4fe30af161bb8b26d55867c264d98c256cbfe364c00ea2cb779d1233d67c9";
    });

    describe("acceptOffer", () => {
        it("should revert with currency denomination is not permitted", async () => {
            offer.erc20Denomination = ZERO_ADDRESS;
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("Currency denomination is not permitted");

            const WXCR = await ethers.getContractFactory("WXCR");
            const newWXCR = await WXCR.deploy();
            await newWXCR.deployed();
            offer.erc20Denomination = newWXCR.address;
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("Currency denomination is not permitted");
        });

        it("should revert with NFT collateral contract is not permitted", async () => {
            offer.nftCollateralContract = ZERO_ADDRESS;
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("NFT collateral contract is not permitted");

            const ChonkSociety = await ethers.getContractFactory("ChonkSociety");
            const chonkSociety = await ChonkSociety.deploy("https://chonksociety.s3.us-east-2.amazonaws.com/metadata/");
            await chonkSociety.deployed();
            offer.nftCollateralContract = chonkSociety.address;
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("NFT collateral contract is not permitted");
        });

        it("should revert with loan duration exceeds maximum loan duration", async () => {
            offer.duration = ONE_DAY * 7 * 53 + 1;
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("Loan duration exceeds maximum loan duration");
        });

        it("should revert with loan duration cannot be zero", async () => {
            offer.duration = 0;
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("Loan duration cannot be zero");
        });

        it("should revert with the admin fee has changed since this order was signed.", async () => {
            offer.adminFeeInBasisPoints = 24;
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("The admin fee has changed since this order was signed.");

            offer.adminFeeInBasisPoints = 26;
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("The admin fee has changed since this order was signed.");
        });

        it("should revert with negative interest rate loans are not allowed.", async () => {
            offer.maximumRepaymentAmount = offer.principalAmount.sub(1);
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("Negative interest rate loans are not allowed.");

            offer.principalAmount = offer.maximumRepaymentAmount.add(1);
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("Negative interest rate loans are not allowed.");
        });

        it("should revert with lender nonce invalid", async () => {
            const signature = {
                nonce: 123123,
                expiry: 1689786000,
                signer: lender.address,
            };

            const encodeSignature = getEncodedSignature(signature);

            const encodeOffer = getEncodeOffer(offer);

            const message = getMessage(encodeOffer, encodeSignature, directLoanFixedOffer.address, 31337);
            const provider = ethers.provider;
            const signer = provider.getSigner(lender.address);
            signature.signature = await signer.signMessage(message);

            await chonkSociety.connect(borrower).approve(directLoanFixedOffer.address, 1);
            await wXCR.connect(lender).approve(directLoanFixedOffer.address, TOKEN_1.mul(100));

            const loanId = "0xebe4fe30af161bb8b26d55867c264d98c256cbfe364c00ea2cb779d1233d67f1";
            await directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature);
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("Lender nonce invalid");
        });

        it("should revert with lender signature is invalid", async () => {
            offer.principalAmount = TOKEN_1.mul(15).sub(1);
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("Lender signature is invalid");

            offer.maximumRepaymentAmount = offer.maximumRepaymentAmount.sub(1);
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("Lender signature is invalid");

            offer.nftCollateralId = 2;
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("Lender signature is invalid");

            const ChonkSociety = await ethers.getContractFactory("ChonkSociety");
            const chonkSociety = await ChonkSociety.deploy("https://chonksociety.s3.us-east-2.amazonaws.com/metadata/");
            await chonkSociety.deployed();
            await permittedNFTs.connect(deployer).setNFTPermit(chonkSociety.address, true);

            offer.nftCollateralContract = chonkSociety.address;
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("Lender signature is invalid");

            offer.duration = 11;
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("Lender signature is invalid");

            const WXCR = await ethers.getContractFactory("WXCR");
            const newWXCR = await WXCR.deploy();
            await newWXCR.deployed();
            offer.erc20Denomination = newWXCR.address;
            await directLoanFixedOffer.connect(deployer).setERC20Permit(newWXCR.address, true);
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("Lender signature is invalid");

            signature.nonce = getRandomInt();
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("Lender signature is invalid");

            signature.expiry = 1689786001;
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("Lender signature is invalid");

            signature.signer = accounts[0].address;
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("Lender signature is invalid");
        });

        it("should revert with invalid token id", async () => {
            offer.nftCollateralId = 123;
            const encodeSignature = getEncodedSignature(signature);
            const encodeOffer = getEncodeOffer(offer);

            const message = getMessage(encodeOffer, encodeSignature, directLoanFixedOffer.address, 31337);
            const provider = ethers.provider;
            const signer = provider.getSigner(lender.address);
            signature.signature = await signer.signMessage(message);
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("ERC721: invalid token ID");
        });

        it("should revert with caller is not token owner or approved", async () => {
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("ERC721: caller is not token owner or approved");

            await chonkSociety.connect(borrower).transferFrom(borrower.address, accounts[0].address, 1);
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("ERC721: caller is not token owner or approved");
        });

        it("should revert with insufficient allowance", async () => {
            await chonkSociety.connect(borrower).approve(directLoanFixedOffer.address, 1);
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("ERC20: insufficient allowance");

            await wXCR.connect(lender).approve(directLoanFixedOffer.address, TOKEN_1.mul(15).sub(1));
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("ERC20: insufficient allowance");
        });

        it("should revert with transfer amount exceeds balance", async () => {
            await chonkSociety.connect(borrower).approve(directLoanFixedOffer.address, 1);
            await wXCR.connect(lender).transfer(accounts[0].address, TOKEN_1.mul(85).add(1));
            await wXCR.connect(lender).approve(directLoanFixedOffer.address, TOKEN_1.mul(15));
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith("ERC20: transfer amount exceeds balance");
        });

        it("should accept offer successfully", async () => {
            await chonkSociety.connect(borrower).approve(directLoanFixedOffer.address, 1);
            await wXCR.connect(lender).approve(directLoanFixedOffer.address, MAX_UINT256);
            await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature))
                .to.emit(directLoanFixedOffer, "LoanStarted")
                .to.changeTokenBalances(wXCR, [lender.address, borrower.address], [TOKEN_1.mul(-15), TOKEN_1.mul(15)])
                .to.changeTokenBalances(chonkSociety, [directLoanFixedOffer.address, borrower.address], [1, -1]);
            expect(await chonkSociety.ownerOf(1)).to.equal(directLoanFixedOffer.address);

            const loan = await directLoanFixedOffer.loanIdToLoan(loanId);
            expect(loan.principalAmount).to.equal(TOKEN_1.mul(15));
            expect(loan.maximumRepaymentAmount).to.equal(TOKEN_1.mul(18));
            expect(loan.nftCollateralId).to.equal(1);
            expect(loan.erc20Denomination).to.equal(wXCR.address);
            expect(loan.duration).to.equal(10);
            expect(loan.adminFeeInBasisPoints).to.equal(25);
            expect(loan.loanStartTime).to.closeTo(await getTimestamp(), 10);
            expect(loan.nftCollateralContract).to.equal(chonkSociety.address);
            expect(loan.borrower).to.equal(borrower.address);
            expect(loan.lender).to.equal(lender.address);
            expect(loan.status).to.equal(LoanStatus.ACTIVE);
        });
    });

    describe("payBackLoan", () => {
        beforeEach(async () => {
            await chonkSociety.connect(borrower).approve(directLoanFixedOffer.address, 1);
            await wXCR.connect(lender).approve(directLoanFixedOffer.address, MAX_UINT256);
            await directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature);
        });

        it("should revert with insufficient allowance", async () => {
            await wXCR.connect(borrower).mint(borrower.address, TOKEN_1.mul(18));

            await expect(directLoanFixedOffer.connect(borrower).payBackLoan(loanId)).to.revertedWith("ERC20: insufficient allowance");
        });

        it("should revert with loan already repaid", async () => {
            await wXCR.connect(borrower).approve(directLoanFixedOffer.address, MAX_UINT256);
            await wXCR.connect(borrower).mint(borrower.address, TOKEN_1.mul(18));
            await directLoanFixedOffer.connect(borrower).payBackLoan(loanId);

            await expect(directLoanFixedOffer.connect(borrower).payBackLoan(loanId)).to.revertedWith("Loan already repaid/liquidated");
        });

        it("should revert with loan already liquidated", async () => {
            await skipTime(ONE_DAY * 10 + 1);
            await directLoanFixedOffer.connect(lender).liquidateOverdueLoan(loanId);

            await expect(directLoanFixedOffer.connect(borrower).payBackLoan(loanId)).to.revertedWith("Loan already repaid/liquidated");
        });

        it("should revert with loan is expired", async () => {
            await wXCR.connect(borrower).approve(directLoanFixedOffer.address, MAX_UINT256);
            await wXCR.connect(borrower).mint(borrower.address, TOKEN_1.mul(18));

            await skipTime(ONE_DAY);
            await expect(directLoanFixedOffer.connect(borrower).payBackLoan(loanId)).to.revertedWith("Loan is expired");
        });

        it("should revert with insufficient allowance", async () => {
            // await wXCR.connect(borrower).approve(directLoanFixedOffer.address, MAX_UINT256);
            await wXCR.connect(borrower).mint(borrower.address, TOKEN_1.mul(18));

            await expect(directLoanFixedOffer.connect(borrower).payBackLoan(loanId)).to.revertedWith("ERC20: insufficient allowance");

            await wXCR.connect(borrower).approve(directLoanFixedOffer.address, TOKEN_1.mul(18).sub(1));
            await expect(directLoanFixedOffer.connect(borrower).payBackLoan(loanId)).to.revertedWith("ERC20: insufficient allowance");
        });

        it("should revert with transfer amount exceeds balance", async () => {
            await wXCR.connect(borrower).approve(directLoanFixedOffer.address, MAX_UINT256);
            await expect(directLoanFixedOffer.connect(borrower).payBackLoan(loanId)).to.revertedWith("ERC20: transfer amount exceeds balance");

            await wXCR.connect(borrower).mint(borrower.address, TOKEN_1.mul(3).sub(1));
            await expect(directLoanFixedOffer.connect(borrower).payBackLoan(loanId)).to.revertedWith("ERC20: transfer amount exceeds balance");
        });

        it("should payBackLoan successfully", async () => {
            await wXCR.connect(borrower).approve(directLoanFixedOffer.address, MAX_UINT256);
            await wXCR.connect(borrower).mint(borrower.address, TOKEN_1.mul(3));

            const royaltyFee = TOKEN_1.mul(18).mul(25).div(10000);
            const lenderFee = TOKEN_1.mul(18).sub(royaltyFee);

            await expect(directLoanFixedOffer.connect(borrower).payBackLoan(loanId))
                .to.emit(directLoanFixedOffer, "LoanRepaid")
                .to.changeTokenBalances(wXCR, [deployer.address, lender.address, borrower.address], [royaltyFee, lenderFee, TOKEN_1.mul(18)])
                .to.changeTokenBalances(chonkSociety, [directLoanFixedOffer.address, borrower.address], [-1, 1]);
        });
    });

    describe("liquidateOverdueLoan", () => {
        beforeEach(async () => {
            await chonkSociety.connect(borrower).approve(directLoanFixedOffer.address, 1);
            await wXCR.connect(lender).approve(directLoanFixedOffer.address, MAX_UINT256);
            await directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature);
        });

        it("should revert with invalid loan id", async () => {
            await expect(directLoanFixedOffer.connect(lender).liquidateOverdueLoan(loanId + 1)).to.be.reverted;
            await expect(directLoanFixedOffer.connect(lender).liquidateOverdueLoan(1)).to.be.reverted;

            await wXCR.connect(borrower).approve(directLoanFixedOffer.address, MAX_UINT256);
            await wXCR.connect(borrower).mint(borrower.address, TOKEN_1.mul(3));
            await directLoanFixedOffer.connect(borrower).payBackLoan(loanId);

            await expect(directLoanFixedOffer.connect(lender).liquidateOverdueLoan(1)).to.be.reverted;
        });

        it("should revert with loan is not overdue yet", async () => {
            await expect(directLoanFixedOffer.connect(lender).liquidateOverdueLoan(loanId)).to.revertedWith("Loan is not overdue yet");
        });

        it("should revert with only lender can liquidate", async () => {
            await skipTime(ONE_DAY);
            await expect(directLoanFixedOffer.connect(deployer).liquidateOverdueLoan(loanId)).to.revertedWith("Only lender can liquidate");
            await expect(directLoanFixedOffer.connect(borrower).liquidateOverdueLoan(loanId)).to.revertedWith("Only lender can liquidate");
        });

        it("should liquidateOverdueLoan successfully", async () => {
            await skipTime(ONE_DAY);
            await expect(directLoanFixedOffer.connect(lender).liquidateOverdueLoan(loanId))
                .to.emit(directLoanFixedOffer, "LoanLiquidated")
                .to.changeTokenBalances(chonkSociety, [directLoanFixedOffer.address, lender.address], [-1, 1]);
        });
    });
});
