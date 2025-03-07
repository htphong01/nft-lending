import { expect } from "chai";
import { ethers } from "hardhat";
import { BaseContract, Signer } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { getRandomInt, getTimestamp, skipTime, getOfferSignature, getRenegotiationSignature } from "./utils";
import { LoanData } from "../typechain-types/contracts/loans/direct/DirectLoanFixedOffer";

const TOKEN_1 = ethers.parseUnits("1", 18);
const ONE_DAY = 24 * 60 * 60;

const createOffer = async (
  token: BaseContract,
  nft: BaseContract,
  lendingPool?: BaseContract
): Promise<LoanData.OfferStruct> => {
  return {
    adminFeeInBasisPoints: 25n,
    duration: ONE_DAY,
    erc20Denomination: token.target,
    maximumRepaymentAmount: TOKEN_1 * 18n,
    nftCollateralContract: nft.target,
    nftCollateralId: 1n,
    principalAmount: TOKEN_1 * 15n,
    lendingPool: lendingPool?.target || ethers.ZeroAddress,
  };
};

const createSignature = async (signer: Signer): Promise<LoanData.SignatureStruct> => {
  return {
    nonce: Math.floor(Math.random() * 100000),
    expiry: (await getTimestamp()) + ONE_DAY,
    signer: await signer.getAddress(),
    signature: "",
  };
};

async function createTestData(signer: Signer, token: BaseContract, nft: BaseContract, lendingPool?: BaseContract) {
  const offer = await createOffer(token, nft, lendingPool);
  const signature = await createSignature(signer);
  const loanId = ethers.encodeBytes32String("1");

  return { offer, signature, loanId };
}

const HUNDRED_PERCENT = 10000n;
function payoffAndFee(loanTerms: LoanData.LoanTermsStructOutput) {
  const interestDue = loanTerms.maximumRepaymentAmount - loanTerms.principalAmount;
  const adminFee = (interestDue * loanTerms.adminFeeInBasisPoints) / HUNDRED_PERCENT;
  const payoffAmount = loanTerms.maximumRepaymentAmount - adminFee;

  return { adminFee, payoffAmount };
}

describe("Loan", () => {
  async function deployFixture() {
    const [deployer, lender, borrower, lendingPoolAdmin, ...accounts] = await ethers.getSigners();

    const loanChecksAndCalculations = await ethers.deployContract("LoanChecksAndCalculations");
    const nftfiSigningUtils = await ethers.deployContract("NFTfiSigningUtils");
    const nftfiSigningUtilsContract = await ethers.deployContract("NFTfiSigningUtilsContract", [], {
      libraries: {
        NFTfiSigningUtils: nftfiSigningUtils,
      },
    });
    const wXENE = await ethers.deployContract("WXENE");
    const directLoanFixedOffer = await ethers.deployContract("DirectLoanFixedOffer", [deployer, [wXENE]], {
      libraries: {
        LoanChecksAndCalculations: loanChecksAndCalculations,
        NFTfiSigningUtils: nftfiSigningUtils,
      },
    });
    const lendingPool = await ethers.deployContract("LendingPool", [deployer]);
    await lendingPool.setAdmin(lendingPoolAdmin, true);
    await lendingPool.setLoan(directLoanFixedOffer);

    const lendingStake = await ethers.deployContract("LendingStake", [wXENE, lendingPool, TOKEN_1, 0]);
    await lendingPool.setLendingStake(lendingStake);
    const nft = await ethers.deployContract("ChonkSociety", ["test baseURI"]);
    await directLoanFixedOffer.setNFTPermit(nft, true);
    await nft.connect(borrower).mint(borrower, 10);
    await wXENE.mintTo(lender, { value: TOKEN_1 * 100n });
    await wXENE.mintTo(borrower, { value: TOKEN_1 * 100n });

    return {
      deployer,
      lender,
      borrower,
      lendingPoolAdmin,
      accounts,
      wXENE,
      nftfiSigningUtilsContract,
      directLoanFixedOffer,
      lendingPool,
      lendingStake,
      nft,
    };
  }

  async function loadFixtureAndAcceptOffer({ withLendingPool }: { withLendingPool: boolean }) {
    const {
      deployer,
      lender,
      borrower,
      lendingPoolAdmin,
      accounts,
      wXENE,
      nftfiSigningUtilsContract,
      directLoanFixedOffer,
      lendingPool,
      lendingStake,
      nft,
    } = await loadFixture(deployFixture);
    const offerLender = withLendingPool ? lendingPoolAdmin : lender;
    const { offer, signature, loanId } = await createTestData(
      offerLender,
      wXENE,
      nft,
      withLendingPool ? lendingPool : undefined
    );
    await nft.connect(borrower).approve(directLoanFixedOffer, 1);

    if (withLendingPool) {
      await wXENE.mintTo(lendingStake, { value: offer.principalAmount });
    } else {
      await wXENE.connect(lender).approve(directLoanFixedOffer, ethers.MaxUint256);
    }

    signature.signature = await getOfferSignature(offer, signature, offerLender, directLoanFixedOffer.target);
    await directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature);
    const loanTerms = await directLoanFixedOffer.loanIdToLoan(loanId);

    return {
      deployer,
      lender,
      borrower,
      lendingPoolAdmin,
      accounts,
      wXENE,
      nftfiSigningUtilsContract,
      directLoanFixedOffer,
      lendingPool,
      lendingStake,
      nft,
      offer,
      signature,
      loanId,
      loanTerms,
    };
  }
  describe("updateMaximumLoanDuration", function () {
    it("should revert when not onwer", async function () {
      const { directLoanFixedOffer, borrower } = await loadFixture(deployFixture);
      await expect(directLoanFixedOffer.connect(borrower).updateMaximumLoanDuration(1))
        .to.revertedWithCustomError(directLoanFixedOffer, "OwnableUnauthorizedAccount")
        .withArgs(borrower.address);
    });

    it("should revert when newMaximumLoanDuration greater than MaxUint32", async function () {
      const { directLoanFixedOffer } = await loadFixture(deployFixture);
      await expect(directLoanFixedOffer.updateMaximumLoanDuration(4294967296)).to.revertedWith(
        "Loan duration overflow"
      );
    });

    it("should successfully", async function () {
      const { directLoanFixedOffer } = await loadFixture(deployFixture);
      await directLoanFixedOffer.updateMaximumLoanDuration(4294967295);
      expect(await directLoanFixedOffer.maximumLoanDuration()).to.equal(4294967295);
    });
  });

  describe("updateAdminFee", function () {
    it("should revert when not onwer", async function () {
      const { directLoanFixedOffer, borrower } = await loadFixture(deployFixture);
      await expect(directLoanFixedOffer.connect(borrower).updateAdminFee(1))
        .to.revertedWithCustomError(directLoanFixedOffer, "OwnableUnauthorizedAccount")
        .withArgs(borrower.address);
    });

    it("should revert when new fee greater than 100%", async function () {
      const { directLoanFixedOffer } = await loadFixture(deployFixture);
      await expect(
        directLoanFixedOffer.updateAdminFee((await directLoanFixedOffer.HUNDRED_PERCENT()) + 1n)
      ).to.revertedWith("basis points > 10000");
    });

    it("should successfully", async function () {
      const { directLoanFixedOffer } = await loadFixture(deployFixture);
      await directLoanFixedOffer.updateAdminFee(0);
      expect(await directLoanFixedOffer.adminFeeInBasisPoints()).to.equal(0);

      await directLoanFixedOffer.updateAdminFee(await directLoanFixedOffer.HUNDRED_PERCENT());
      expect(await directLoanFixedOffer.adminFeeInBasisPoints()).to.equal(await directLoanFixedOffer.HUNDRED_PERCENT());
    });
  });

  describe("setERC20Permit", function () {
    it("should revert when not onwer", async function () {
      const { directLoanFixedOffer, wXENE, borrower } = await loadFixture(deployFixture);
      await expect(directLoanFixedOffer.connect(borrower).setERC20Permit(wXENE, true))
        .to.revertedWithCustomError(directLoanFixedOffer, "OwnableUnauthorizedAccount")
        .withArgs(borrower.address);
    });

    it("should revert when token is zero address", async function () {
      const { directLoanFixedOffer } = await loadFixture(deployFixture);
      await expect(directLoanFixedOffer.setERC20Permit(ethers.ZeroAddress, true)).to.revertedWith(
        "erc20 is zero address"
      );
    });

    it("should successfully", async function () {
      const { directLoanFixedOffer } = await loadFixture(deployFixture);

      const newToken = await ethers.deployContract("WXENE");
      await directLoanFixedOffer.setERC20Permit(newToken, true);
      expect(await directLoanFixedOffer.getERC20Permit(newToken)).to.be.true;

      await directLoanFixedOffer.setERC20Permit(newToken, false);
      expect(await directLoanFixedOffer.getERC20Permit(newToken)).to.be.false;
    });
  });

  describe("setNFTPermit", function () {
    it("should revert when not onwer", async function () {
      const { directLoanFixedOffer, nft, borrower } = await loadFixture(deployFixture);
      await expect(directLoanFixedOffer.connect(borrower).setNFTPermit(nft, true))
        .to.revertedWithCustomError(directLoanFixedOffer, "OwnableUnauthorizedAccount")
        .withArgs(borrower.address);
    });

    it("should revert when token is zero address", async function () {
      const { directLoanFixedOffer } = await loadFixture(deployFixture);
      await expect(directLoanFixedOffer.setNFTPermit(ethers.ZeroAddress, true)).to.revertedWith("Invalid nft address");
    });

    it("should successfully", async function () {
      const { directLoanFixedOffer } = await loadFixture(deployFixture);

      const newNft = await ethers.deployContract("ChonkSociety", ["test baseURI"]);
      await directLoanFixedOffer.setNFTPermit(newNft, true);
      expect(await directLoanFixedOffer.getNftPermit(newNft)).to.be.true;

      await directLoanFixedOffer.setNFTPermit(newNft, false);
      expect(await directLoanFixedOffer.getNftPermit(newNft)).to.be.false;
    });
  });

  describe("drainERC20Airdrop", function () {
    it("should revert when not onwer", async function () {
      const { directLoanFixedOffer, wXENE, borrower } = await loadFixture(deployFixture);
      await expect(directLoanFixedOffer.connect(borrower).drainERC20Airdrop(wXENE, borrower))
        .to.revertedWithCustomError(directLoanFixedOffer, "OwnableUnauthorizedAccount")
        .withArgs(borrower.address);
    });

    it("should revert when token is zero address", async function () {
      const { directLoanFixedOffer, borrower } = await loadFixture(deployFixture);
      await expect(directLoanFixedOffer.drainERC20Airdrop(ethers.ZeroAddress, borrower)).to.reverted;
    });

    it("should successfully", async function () {
      const { directLoanFixedOffer, wXENE, borrower } = await loadFixture(deployFixture);

      await wXENE.mintTo(directLoanFixedOffer, { value: TOKEN_1 });
      await expect(directLoanFixedOffer.drainERC20Airdrop(wXENE, borrower)).to.changeTokenBalances(
        wXENE,
        [directLoanFixedOffer, borrower],
        [-TOKEN_1, TOKEN_1]
      );

      // when balance is empty
      await expect(directLoanFixedOffer.drainERC20Airdrop(wXENE, borrower)).to.changeTokenBalances(
        wXENE,
        [directLoanFixedOffer, borrower],
        [0, 0]
      );
    });
  });

  describe("drainERC721Airdrop", function () {
    it("should revert when not onwer", async function () {
      const { directLoanFixedOffer, nft, borrower } = await loadFixture(deployFixture);
      await expect(directLoanFixedOffer.connect(borrower).drainERC721Airdrop(nft, 1, borrower))
        .to.revertedWithCustomError(directLoanFixedOffer, "OwnableUnauthorizedAccount")
        .withArgs(borrower.address);
    });

    it("should revert when nft address is zero address", async function () {
      const { directLoanFixedOffer, borrower } = await loadFixture(deployFixture);
      await expect(directLoanFixedOffer.drainERC721Airdrop(ethers.ZeroAddress, 1, borrower)).to.reverted;
    });

    it("should revert when loan is not owner of token ID", async function () {
      const { directLoanFixedOffer, nft, borrower } = await loadFixture(deployFixture);
      await expect(directLoanFixedOffer.drainERC721Airdrop(nft, 1, borrower))
        .to.revertedWithCustomError(nft, "ERC721InsufficientApproval")
        .withArgs(directLoanFixedOffer, 1);
    });

    it("should revert when token is collateral", async function () {
      const { borrower, nft, directLoanFixedOffer } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });
      await expect(directLoanFixedOffer.drainERC721Airdrop(nft, 1, borrower)).to.revertedWith("token is collateral");
    });

    it("should successfully", async function () {
      const { directLoanFixedOffer, nft, borrower } = await loadFixture(deployFixture);

      await nft.connect(borrower).transferFrom(borrower, directLoanFixedOffer, 1);
      expect(await nft.ownerOf(1)).to.equal(directLoanFixedOffer);
      await expect(directLoanFixedOffer.drainERC721Airdrop(nft, 1, borrower)).to.changeTokenBalances(
        nft,
        [directLoanFixedOffer, borrower],
        [-1, 1]
      );
    });
  });

  describe("acceptOffer", () => {
    it("should revert when currency denomination is not permitted", async () => {
      const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
      const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

      offer.erc20Denomination = ethers.ZeroAddress;
      signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);
      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
        "Currency denomination is not permitted"
      );

      const newWXENE = await ethers.deployContract("WXENE");
      offer.erc20Denomination = newWXENE.target;
      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
        "Currency denomination is not permitted"
      );
    });

    it("should revert when NFT collateral contract is not permitted", async () => {
      const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
      const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

      offer.nftCollateralContract = ethers.ZeroAddress;
      signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);
      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
        "NFT collateral contract is not permitted"
      );

      const newNft = await ethers.deployContract("ChonkSociety", ["base uri"]);
      offer.nftCollateralContract = newNft.target;
      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
        "NFT collateral contract is not permitted"
      );
    });

    it("should revert when loan duration exceeds maximum loan duration", async () => {
      const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
      const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);
      offer.duration = ONE_DAY * 7 * 53 + 1;
      signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);

      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
        "Loan duration exceeds maximum loan duration"
      );
    });

    it("should revert when loan duration cannot be zero", async () => {
      const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
      const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

      offer.duration = 0;
      signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);

      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
        "Loan duration cannot be zero"
      );
    });

    it("should revert when the admin fee has changed since this order was signed.", async () => {
      const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
      const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

      offer.adminFeeInBasisPoints = 24;
      signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);

      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
        "The admin fee has changed since this order was signed."
      );

      offer.adminFeeInBasisPoints = 26;
      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
        "The admin fee has changed since this order was signed."
      );
    });

    it("should revert when negative interest rate loans are not allowed.", async () => {
      const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
      const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

      offer.maximumRepaymentAmount = BigInt(offer.principalAmount) - 1n;
      signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);

      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
        "Negative interest rate loans are not allowed."
      );

      offer.principalAmount = BigInt(offer.maximumRepaymentAmount) + 1n;
      signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);

      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
        "Negative interest rate loans are not allowed."
      );
    });

    it("should revert when lender nonce invalid", async () => {
      const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
      const { offer, signature } = await createTestData(lender, wXENE, nft);

      signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);

      await nft.connect(borrower).approve(directLoanFixedOffer, 1);
      await wXENE.connect(lender).approve(directLoanFixedOffer, TOKEN_1 * 100n);

      const loanId = "0xebe4fe30af161bb8b26d55867c264d98c256cbfe364c00ea2cb779d1233d67f1";
      await directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature);
      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
        "Lender nonce invalid"
      );
    });

    describe("should revert when lender signature is invalid", () => {
      it("Should revert if signature is expired", async () => {
        const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
        const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

        signature.expiry = (await getTimestamp()) - 1;

        signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);
        await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
          "Lender Signature has expired"
        );
      });

      it("Should revert if loan contract is zero address", async () => {
        const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
        const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

        signature.signature = await getOfferSignature(offer, signature, lender, ethers.ZeroAddress);

        await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
          "Lender signature is invalid"
        );
      });

      it("Should revert if signer is zero address", async () => {
        const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
        const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

        signature.signer = ethers.ZeroAddress;
        signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);

        await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
          "Lender signature is invalid"
        );
      });

      it("Should revert if offer principalAmount is wrong after sign", async () => {
        const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
        const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

        signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);
        offer.principalAmount = TOKEN_1 * 2n;
        await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
          "Lender signature is invalid"
        );
      });

      it("Should revert if offer maximumRepaymentAmount is wrong after sign", async () => {
        const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
        const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

        signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);
        offer.maximumRepaymentAmount = BigInt(offer.maximumRepaymentAmount) - 1n;
        await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
          "Lender signature is invalid"
        );
      });

      it("Should revert if offer nftCollateralId is wrong after sign", async () => {
        const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
        const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

        signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);
        offer.nftCollateralId = BigInt(offer.nftCollateralId) + 1n;
        await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
          "Lender signature is invalid"
        );
      });

      it("Should revert if offer nftCollateralContract is wrong after sign", async () => {
        const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
        const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

        signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);

        const newNft = await ethers.deployContract("ChonkSociety", ["base uri"]);
        await directLoanFixedOffer.setNFTPermit(newNft, true);
        offer.nftCollateralContract = newNft.target;
        await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
          "Lender signature is invalid"
        );
      });

      it("Should revert if offer duration is wrong after sign", async () => {
        const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
        const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

        signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);
        offer.duration = 11;
        await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
          "Lender signature is invalid"
        );
      });

      it("Should revert if offer erc20Denomination is wrong after sign", async () => {
        const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
        const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

        signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);

        const newWXENE = await ethers.deployContract("WXENE");
        offer.erc20Denomination = newWXENE.target;
        await directLoanFixedOffer.setERC20Permit(newWXENE, true);
        await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
          "Lender signature is invalid"
        );
      });

      it("Should revert if offer nonce is wrong after sign", async () => {
        const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
        const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

        signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);

        signature.nonce = getRandomInt();
        await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
          "Lender signature is invalid"
        );
      });

      it("Should revert if offer expiry is wrong after sign", async () => {
        const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
        const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

        signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);

        signature.expiry = ethers.MaxUint256;
        await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
          "Lender signature is invalid"
        );
      });
    });

    it("should revert when invalid token id", async () => {
      const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
      const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

      offer.nftCollateralId = 123;
      signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);
      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature))
        .to.revertedWithCustomError(nft, "ERC721NonexistentToken")
        .withArgs(123);
    });

    it("should revert when caller is not token owner or approved", async () => {
      const { lender, borrower, accounts, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
      const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

      signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);
      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature))
        .to.revertedWithCustomError(nft, "ERC721InsufficientApproval")
        .withArgs(directLoanFixedOffer, 1);

      await nft.connect(borrower).transferFrom(borrower.address, accounts[0], 1);
      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature))
        .to.revertedWithCustomError(nft, "ERC721InsufficientApproval")
        .withArgs(directLoanFixedOffer, 1);
    });

    it("should revert when token insufficient allowance", async () => {
      const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
      const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

      offer.principalAmount = TOKEN_1 * 2n;
      await nft.connect(borrower).approve(directLoanFixedOffer, 1);
      signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);

      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature))
        .to.revertedWithCustomError(wXENE, "ERC20InsufficientAllowance")
        .withArgs(directLoanFixedOffer, 0, offer.principalAmount);
    });

    it("should revert when transfer amount exceeds balance", async () => {
      const { borrower, accounts, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
      const { offer, signature, loanId } = await createTestData(accounts[0], wXENE, nft);

      await nft.connect(borrower).approve(directLoanFixedOffer, 1);
      await wXENE.connect(accounts[0]).approve(directLoanFixedOffer, TOKEN_1 * 15n);
      signature.signature = await getOfferSignature(offer, signature, accounts[0], directLoanFixedOffer.target);

      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature))
        .to.revertedWithCustomError(wXENE, "ERC20InsufficientBalance")
        .withArgs(accounts[0], 0, TOKEN_1 * 15n);
    });

    it("should accept offer successfully", async () => {
      const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
      const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

      await nft.connect(borrower).approve(directLoanFixedOffer, 1);
      await wXENE.connect(lender).approve(directLoanFixedOffer, ethers.MaxUint256);
      signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);

      const tx = await directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature);
      await expect(tx)
        .to.emit(directLoanFixedOffer, "LoanStarted")
        .withArgs(loanId, borrower, lender, [
          TOKEN_1 * 15n,
          TOKEN_1 * 18n,
          1,
          wXENE,
          ONE_DAY,
          25,
          await getTimestamp(),
          nft,
          borrower.address,
          lender.address,
          false,
        ]);
      await expect(tx).to.changeTokenBalances(
        wXENE,
        [lender.address, borrower.address],
        [-TOKEN_1 * 15n, TOKEN_1 * 15n]
      );
      await expect(tx).to.changeTokenBalances(nft, [directLoanFixedOffer, borrower.address], [1, -1]);
      expect(await nft.ownerOf(1)).to.equal(directLoanFixedOffer);

      const loan = await directLoanFixedOffer.loanIdToLoan(loanId);
      expect(loan.principalAmount).to.equal(TOKEN_1 * 15n);
      expect(loan.maximumRepaymentAmount).to.equal(TOKEN_1 * 18n);
      expect(loan.nftCollateralId).to.equal(1);
      expect(loan.erc20Denomination).to.equal(wXENE);
      expect(loan.duration).to.equal(ONE_DAY);
      expect(loan.adminFeeInBasisPoints).to.equal(25);
      expect(loan.loanStartTime).to.closeTo(await getTimestamp(), 10);
      expect(loan.nftCollateralContract).to.equal(nft);
      expect(loan.borrower).to.equal(borrower.address);
      expect(loan.lender).to.equal(lender.address);
      expect(loan.useLendingPool).to.be.false;
    });
  });

  describe("acceptOffer with Lending Pool", () => {
    it("Should revert if lender is lending pool but signer is not admin", async () => {
      const { lender, borrower, directLoanFixedOffer, wXENE, nft, lendingPool } = await loadFixture(deployFixture);
      const { offer, signature, loanId } = await createTestData(lender, wXENE, nft, lendingPool);

      signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);
      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
        "Signature signer is not admin"
      );
    });

    it("should revert when Lender signature is invalid", async () => {
      const { lendingPoolAdmin, borrower, directLoanFixedOffer, wXENE, nft, lendingPool } = await loadFixture(
        deployFixture
      );
      const { offer, signature, loanId } = await createTestData(lendingPoolAdmin, wXENE, nft, lendingPool);

      signature.signature = await getOfferSignature(offer, signature, lendingPoolAdmin, directLoanFixedOffer.target);
      signature.nonce = 0;
      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
        "Lender signature is invalid"
      );
    });

    it("should revert when Lender Signature has expired", async () => {
      const { lendingPoolAdmin, borrower, directLoanFixedOffer, wXENE, nft, lendingPool } = await loadFixture(
        deployFixture
      );
      const { offer, signature, loanId } = await createTestData(lendingPoolAdmin, wXENE, nft, lendingPool);

      signature.signature = await getOfferSignature(offer, signature, lendingPoolAdmin, directLoanFixedOffer.target);
      signature.expiry = (await getTimestamp()) - 1000;
      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
        "Lender Signature has expired"
      );
    });

    it("should revert when transfer amount exceeds lending stake balance", async () => {
      const { lendingPoolAdmin, borrower, directLoanFixedOffer, wXENE, nft, lendingPool, lendingStake } =
        await loadFixture(deployFixture);
      const { offer, signature, loanId } = await createTestData(lendingPoolAdmin, wXENE, nft, lendingPool);
      signature.signature = await getOfferSignature(offer, signature, lendingPoolAdmin, directLoanFixedOffer.target);
      await nft.connect(borrower).approve(directLoanFixedOffer, 1);

      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature))
        .to.revertedWithCustomError(wXENE, "ERC20InsufficientBalance")
        .withArgs(lendingStake, 0, offer.principalAmount);
    });

    it("should accept offer successfully", async () => {
      const { lendingPoolAdmin, borrower, directLoanFixedOffer, wXENE, nft, lendingPool, lendingStake } =
        await loadFixture(deployFixture);
      const { offer, signature, loanId } = await createTestData(lendingPoolAdmin, wXENE, nft, lendingPool);
      signature.signature = await getOfferSignature(offer, signature, lendingPoolAdmin, directLoanFixedOffer.target);

      await nft.connect(borrower).approve(directLoanFixedOffer, 1);
      await wXENE.mintTo(lendingStake, { value: offer.principalAmount });

      const tx = await directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature);

      await expect(tx)
        .to.emit(directLoanFixedOffer, "LoanStarted")
        .withArgs(loanId, borrower, lendingPool, [
          TOKEN_1 * 15n,
          TOKEN_1 * 18n,
          1,
          wXENE,
          ONE_DAY,
          25,
          await getTimestamp(),
          nft,
          borrower.address,
          lendingPool,
          true,
        ]);
      await expect(tx).to.changeTokenBalances(wXENE, [lendingStake, borrower.address], [-TOKEN_1 * 15n, TOKEN_1 * 15n]);
      expect(await nft.ownerOf(1)).to.equal(directLoanFixedOffer);

      const loan = await directLoanFixedOffer.loanIdToLoan(loanId);
      expect(loan.principalAmount).to.equal(TOKEN_1 * 15n);
      expect(loan.maximumRepaymentAmount).to.equal(TOKEN_1 * 18n);
      expect(loan.nftCollateralId).to.equal(1);
      expect(loan.erc20Denomination).to.equal(wXENE);
      expect(loan.duration).to.equal(ONE_DAY);
      expect(loan.adminFeeInBasisPoints).to.equal(25);
      expect(loan.loanStartTime).to.closeTo(await getTimestamp(), 10);
      expect(loan.nftCollateralContract).to.equal(nft);
      expect(loan.borrower).to.equal(borrower.address);
      expect(loan.lender).to.equal(lendingPool);
      expect(loan.useLendingPool).to.be.true;
    });
  });

  describe("payBackLoan", () => {
    it("should revert when invalid loan id", async () => {
      const { borrower, directLoanFixedOffer } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      await expect(directLoanFixedOffer.connect(borrower).payBackLoan(ethers.encodeBytes32String("2"))).to.revertedWith(
        "None existed loan ID"
      );
    });

    it("should revert when pause", async () => {
      const { borrower, directLoanFixedOffer, loanId } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      await directLoanFixedOffer.pause();
      await expect(directLoanFixedOffer.connect(borrower).payBackLoan(loanId)).to.revertedWithCustomError(
        directLoanFixedOffer,
        "EnforcedPause"
      );
    });

    it("should revert when insufficient allowance", async () => {
      const { borrower, directLoanFixedOffer, wXENE, loanId, loanTerms } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      const { payoffAmount } = payoffAndFee(loanTerms);
      await expect(directLoanFixedOffer.connect(borrower).payBackLoan(loanId))
        .to.revertedWithCustomError(wXENE, "ERC20InsufficientAllowance")
        .withArgs(directLoanFixedOffer, 0, payoffAmount);
    });

    it("should revert when loan already repaid", async () => {
      const { borrower, directLoanFixedOffer, wXENE, loanId } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      // Payback loan
      await wXENE.connect(borrower).approve(directLoanFixedOffer, ethers.MaxUint256);
      await directLoanFixedOffer.connect(borrower).payBackLoan(loanId);

      await expect(directLoanFixedOffer.connect(borrower).payBackLoan(loanId)).to.revertedWith(
        "Loan already repaid/liquidated"
      );
    });

    it("should revert when loan already liquidated", async () => {
      const { lender, borrower, directLoanFixedOffer, loanId } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      await skipTime(ONE_DAY + 1);
      await directLoanFixedOffer.connect(lender).liquidateOverdueLoan(loanId);

      await expect(directLoanFixedOffer.connect(borrower).payBackLoan(loanId)).to.revertedWith(
        "Loan already repaid/liquidated"
      );
    });

    it("should revert when loan is expired", async () => {
      const { borrower, directLoanFixedOffer, wXENE, loanId } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });
      await wXENE.connect(borrower).approve(directLoanFixedOffer, ethers.MaxUint256);

      await skipTime(ONE_DAY + 1);
      await expect(directLoanFixedOffer.connect(borrower).payBackLoan(loanId)).to.revertedWith("Loan is expired");
    });

    it("should revert when transfer amount exceeds balance", async () => {
      const { borrower, lender, directLoanFixedOffer, wXENE, loanId, loanTerms } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      await wXENE.connect(borrower).approve(directLoanFixedOffer, ethers.MaxUint256);
      await wXENE.connect(borrower).transfer(lender, await wXENE.balanceOf(borrower));

      const { payoffAmount } = payoffAndFee(loanTerms);
      await expect(directLoanFixedOffer.connect(borrower).payBackLoan(loanId))
        .to.revertedWithCustomError(wXENE, "ERC20InsufficientBalance")
        .withArgs(borrower, 0, payoffAmount);
    });

    describe("should pay back loan successfully", () => {
      it("with single user", async () => {
        const { deployer, borrower, lender, directLoanFixedOffer, wXENE, nft, loanId, loanTerms, offer } =
          await loadFixtureAndAcceptOffer({
            withLendingPool: false,
          });
        await wXENE.connect(borrower).approve(directLoanFixedOffer, ethers.MaxUint256);

        const { payoffAmount, adminFee } = payoffAndFee(loanTerms);

        const tx = await directLoanFixedOffer.connect(borrower).payBackLoan(loanId);
        await expect(tx)
          .to.emit(directLoanFixedOffer, "LoanRepaid")
          .withArgs(
            loanId,
            borrower,
            lender,
            offer.principalAmount,
            offer.nftCollateralId,
            payoffAmount,
            adminFee,
            payoffAmount - BigInt(offer.principalAmount),
            offer.nftCollateralContract,
            offer.erc20Denomination
          );
        await expect(tx).to.changeTokenBalances(
          wXENE,
          [deployer, lender, borrower, directLoanFixedOffer],
          [adminFee, payoffAmount, -(payoffAmount + adminFee), 0]
        );
        await expect(tx).to.changeTokenBalances(nft, [directLoanFixedOffer, borrower, lender], [-1, 1, 0]);
      });

      it("with Lending Pool", async () => {
        const {
          deployer,
          borrower,
          directLoanFixedOffer,
          lendingPool,
          lendingStake,
          lendingPoolAdmin,
          wXENE,
          nft,
          loanId,
          loanTerms,
          offer,
        } = await loadFixtureAndAcceptOffer({
          withLendingPool: true,
        });
        await wXENE.connect(borrower).approve(directLoanFixedOffer, ethers.MaxUint256);

        const { payoffAmount, adminFee } = payoffAndFee(loanTerms);

        const tx = await directLoanFixedOffer.connect(borrower).payBackLoan(loanId);
        await expect(tx)
          .to.emit(directLoanFixedOffer, "LoanRepaid")
          .withArgs(
            loanId,
            borrower,
            lendingPool,
            offer.principalAmount,
            offer.nftCollateralId,
            payoffAmount,
            adminFee,
            payoffAmount - BigInt(offer.principalAmount),
            offer.nftCollateralContract,
            offer.erc20Denomination
          );
        await expect(tx).to.changeTokenBalances(
          wXENE,
          [deployer, lendingPool, lendingStake, borrower, directLoanFixedOffer, lendingPoolAdmin],
          [
            adminFee,
            payoffAmount - loanTerms.principalAmount,
            loanTerms.principalAmount,
            -(payoffAmount + adminFee),
            0,
            0,
          ]
        );
        await expect(tx).to.changeTokenBalances(
          nft,
          [directLoanFixedOffer, borrower, lendingPool, lendingStake, lendingPoolAdmin],
          [-1, 1, 0, 0, 0]
        );
      });
    });
  });

  describe("liquidateOverdueLoan", () => {
    it("should revert when pause", async () => {
      const { borrower, directLoanFixedOffer, loanId } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      await directLoanFixedOffer.pause();
      await expect(directLoanFixedOffer.connect(borrower).liquidateOverdueLoan(loanId)).to.revertedWithCustomError(
        directLoanFixedOffer,
        "EnforcedPause"
      );
    });

    it("should revert when loan already repaid", async () => {
      const { borrower, directLoanFixedOffer, wXENE, loanId } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      // Payback loan
      await wXENE.connect(borrower).approve(directLoanFixedOffer, ethers.MaxUint256);
      await directLoanFixedOffer.connect(borrower).payBackLoan(loanId);

      await expect(directLoanFixedOffer.connect(borrower).liquidateOverdueLoan(loanId)).to.revertedWith(
        "Loan already repaid/liquidated"
      );
    });

    it("should revert when loan already liquidated", async () => {
      const { lender, borrower, directLoanFixedOffer, loanId } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      await skipTime(ONE_DAY + 1);
      await directLoanFixedOffer.connect(lender).liquidateOverdueLoan(loanId);

      await expect(directLoanFixedOffer.connect(borrower).liquidateOverdueLoan(loanId)).to.revertedWith(
        "Loan already repaid/liquidated"
      );
    });

    it("should revert when loan is not overdue yet", async () => {
      const { lender, directLoanFixedOffer, loanId } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      await expect(directLoanFixedOffer.connect(lender).liquidateOverdueLoan(loanId)).to.revertedWith(
        "Loan is not overdue yet"
      );
    });

    it("should revert when only lender can liquidate", async () => {
      const { borrower, directLoanFixedOffer, loanId } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      await skipTime(ONE_DAY);
      await expect(directLoanFixedOffer.liquidateOverdueLoan(loanId)).to.revertedWith("Only lender can liquidate");
      await expect(directLoanFixedOffer.connect(borrower).liquidateOverdueLoan(loanId)).to.revertedWith(
        "Only lender can liquidate"
      );
    });

    it("should revert when only admin lending pool can liquidate", async () => {
      const { borrower, directLoanFixedOffer, loanId } = await loadFixtureAndAcceptOffer({
        withLendingPool: true,
      });

      await skipTime(ONE_DAY);
      await expect(directLoanFixedOffer.connect(borrower).liquidateOverdueLoan(loanId)).to.revertedWith(
        "Only Lending pool admin can liquidate"
      );
    });

    it("should liquidateOverdueLoan successfully (single user)", async () => {
      const { lender, nft, directLoanFixedOffer, loanId } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      await skipTime(ONE_DAY);
      const tx = await directLoanFixedOffer.connect(lender).liquidateOverdueLoan(loanId);
      await expect(tx).to.emit(directLoanFixedOffer, "LoanLiquidated");
      await expect(tx).to.changeTokenBalances(nft, [directLoanFixedOffer, lender.address], [-1, 1]);
      expect(await directLoanFixedOffer.loanRepaidOrLiquidated(loanId)).to.be.true;
    });

    it("should liquidateOverdueLoan successfully (lending pool)", async () => {
      const { lendingPoolAdmin, lendingPool, nft, directLoanFixedOffer, loanId } = await loadFixtureAndAcceptOffer({
        withLendingPool: true,
      });

      await skipTime(ONE_DAY);
      const tx = await directLoanFixedOffer.connect(lendingPoolAdmin).liquidateOverdueLoan(loanId);
      await expect(tx).to.emit(directLoanFixedOffer, "LoanLiquidated");
      await expect(tx).to.changeTokenBalances(nft, [directLoanFixedOffer, lendingPool, lendingPoolAdmin], [-1, 1, 0]);
      expect(await directLoanFixedOffer.loanRepaidOrLiquidated(loanId)).to.be.true;
    });
  });

  describe("renegotiateLoan", () => {
    it("should revert when pause", async () => {
      const { borrower, directLoanFixedOffer, loanId, loanTerms, signature } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      await directLoanFixedOffer.pause();
      await expect(
        directLoanFixedOffer
          .connect(borrower)
          .renegotiateLoan(
            loanId,
            loanTerms.duration + BigInt(ONE_DAY),
            loanTerms.maximumRepaymentAmount + 1n,
            10n,
            signature
          )
      ).to.revertedWithCustomError(directLoanFixedOffer, "EnforcedPause");
    });

    it("should revert when loan already repaid", async () => {
      const { borrower, directLoanFixedOffer, wXENE, loanId, loanTerms, signature } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      // Payback loan
      await wXENE.connect(borrower).approve(directLoanFixedOffer, ethers.MaxUint256);
      await directLoanFixedOffer.connect(borrower).payBackLoan(loanId);

      await expect(
        directLoanFixedOffer
          .connect(borrower)
          .renegotiateLoan(
            loanId,
            loanTerms.duration + BigInt(ONE_DAY),
            loanTerms.maximumRepaymentAmount + 1n,
            10n,
            signature
          )
      ).to.revertedWith("Loan already repaid/liquidated");
    });

    it("should revert when loan already liquidated", async () => {
      const { lender, borrower, directLoanFixedOffer, loanId, loanTerms, signature } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      await skipTime(ONE_DAY + 1);
      await directLoanFixedOffer.connect(lender).liquidateOverdueLoan(loanId);

      await expect(
        directLoanFixedOffer
          .connect(borrower)
          .renegotiateLoan(
            loanId,
            loanTerms.duration + BigInt(ONE_DAY),
            loanTerms.maximumRepaymentAmount + 1n,
            10n,
            signature
          )
      ).to.revertedWith("Loan already repaid/liquidated");
    });

    it("should revert when caller is not borrower", async () => {
      const { lender, directLoanFixedOffer, loanId, loanTerms, signature } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      await expect(
        directLoanFixedOffer
          .connect(lender)
          .renegotiateLoan(
            loanId,
            loanTerms.duration + BigInt(ONE_DAY),
            loanTerms.maximumRepaymentAmount + 1n,
            10n,
            signature
          )
      ).to.revertedWith("Only borrower can initiate");
    });

    it("should revert when new duration already expired", async () => {
      const { borrower, directLoanFixedOffer, loanId, loanTerms, signature } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      await skipTime(Number(loanTerms.duration));
      await expect(
        directLoanFixedOffer
          .connect(borrower)
          .renegotiateLoan(loanId, loanTerms.duration - 1n, loanTerms.maximumRepaymentAmount + 1n, 10n, signature)
      ).to.revertedWith("New duration already expired");
    });

    it("should revert when new duration exceeds maximum loan duration", async () => {
      const { borrower, directLoanFixedOffer, loanId, loanTerms, signature } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      const maximumLoanDuration = await directLoanFixedOffer.maximumLoanDuration();
      await expect(
        directLoanFixedOffer
          .connect(borrower)
          .renegotiateLoan(loanId, maximumLoanDuration + 1n, loanTerms.maximumRepaymentAmount + 1n, 10n, signature)
      ).to.revertedWith("New duration exceeds maximum loan duration");
    });

    it("should revert when newMaximumRepaymentAmount less than loan pricipal amount", async () => {
      const { borrower, directLoanFixedOffer, loanId, loanTerms, signature } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      await expect(
        directLoanFixedOffer
          .connect(borrower)
          .renegotiateLoan(loanId, loanTerms.duration + BigInt(ONE_DAY), loanTerms.principalAmount - 1n, 10n, signature)
      ).to.revertedWith("Negative interest rate loans are not allowed");
    });

    it("should revert when lender nonce invalid", async () => {
      const { borrower, directLoanFixedOffer, loanId, loanTerms, signature } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      await expect(
        directLoanFixedOffer
          .connect(borrower)
          .renegotiateLoan(
            loanId,
            loanTerms.duration + BigInt(ONE_DAY),
            loanTerms.maximumRepaymentAmount + 1n,
            10n,
            signature
          )
      ).to.revertedWith("Lender nonce invalid");
    });

    it("should revert when renegotiation signature has expired", async () => {
      const { borrower, lender, directLoanFixedOffer, loanId, loanTerms } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      const renegotiationData = {
        loanId: loanId,
        newLoanDuration: loanTerms.duration + BigInt(ONE_DAY),
        newMaximumRepaymentAmount: loanTerms.maximumRepaymentAmount + 1n,
        renegotiationFee: 10n,
      };

      const renegotiationSignature = {
        nonce: Math.floor(Math.random() * 100000),
        expiry: (await getTimestamp()) - 100,
        signer: lender.address,
        signature: "",
      };
      renegotiationSignature.signature = await getRenegotiationSignature(
        renegotiationData,
        renegotiationSignature,
        lender,
        directLoanFixedOffer.target
      );

      await expect(
        directLoanFixedOffer
          .connect(borrower)
          .renegotiateLoan(
            renegotiationData.loanId,
            renegotiationData.newLoanDuration,
            renegotiationData.newMaximumRepaymentAmount,
            renegotiationData.renegotiationFee,
            renegotiationSignature
          )
      ).to.revertedWith("Renegotiation Signature has expired");

      renegotiationSignature.expiry = await getTimestamp();
      await expect(
        directLoanFixedOffer
          .connect(borrower)
          .renegotiateLoan(
            renegotiationData.loanId,
            renegotiationData.newLoanDuration,
            renegotiationData.newMaximumRepaymentAmount,
            renegotiationData.renegotiationFee,
            renegotiationSignature
          )
      ).to.revertedWith("Renegotiation Signature has expired");
    });

    it("should revert when signature signer is not lender", async () => {
      const { borrower, lender, directLoanFixedOffer, loanId, loanTerms } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      const renegotiationData = {
        loanId: loanId,
        newLoanDuration: loanTerms.duration + BigInt(ONE_DAY),
        newMaximumRepaymentAmount: loanTerms.maximumRepaymentAmount + 1n,
        renegotiationFee: 10n,
      };

      // Signature signer is ZERO Address
      const renegotiationSignature = {
        nonce: Math.floor(Math.random() * 100000),
        expiry: (await getTimestamp()) + ONE_DAY,
        signer: ethers.ZeroAddress,
        signature: "",
      };
      renegotiationSignature.signature = await getRenegotiationSignature(
        renegotiationData,
        renegotiationSignature,
        lender,
        directLoanFixedOffer.target
      );

      await expect(
        directLoanFixedOffer
          .connect(borrower)
          .renegotiateLoan(
            renegotiationData.loanId,
            renegotiationData.newLoanDuration,
            renegotiationData.newMaximumRepaymentAmount,
            renegotiationData.renegotiationFee,
            renegotiationSignature
          )
      ).to.revertedWith("Renegotiation signature is invalid");

      // Signature signer is not lender
      renegotiationSignature.signer = borrower.address;
      renegotiationSignature.signature = await getRenegotiationSignature(
        renegotiationData,
        renegotiationSignature,
        lender,
        directLoanFixedOffer.target
      );
      await expect(
        directLoanFixedOffer
          .connect(borrower)
          .renegotiateLoan(
            renegotiationData.loanId,
            renegotiationData.newLoanDuration,
            renegotiationData.newMaximumRepaymentAmount,
            renegotiationData.renegotiationFee,
            renegotiationSignature
          )
      ).to.revertedWith("Renegotiation signature is invalid");
    });

    it("should revert when signature signer is not lending pool admin", async () => {
      const { borrower, lender, directLoanFixedOffer, loanId, loanTerms } = await loadFixtureAndAcceptOffer({
        withLendingPool: true,
      });

      const renegotiationData = {
        loanId: loanId,
        newLoanDuration: loanTerms.duration + BigInt(ONE_DAY),
        newMaximumRepaymentAmount: loanTerms.maximumRepaymentAmount + 1n,
        renegotiationFee: 10n,
      };

      // Signature signer is ZERO Address
      const renegotiationSignature = {
        nonce: Math.floor(Math.random() * 100000),
        expiry: (await getTimestamp()) + ONE_DAY,
        signer: ethers.ZeroAddress,
        signature: "",
      };
      renegotiationSignature.signature = await getRenegotiationSignature(
        renegotiationData,
        renegotiationSignature,
        lender,
        directLoanFixedOffer.target
      );

      await expect(
        directLoanFixedOffer
          .connect(borrower)
          .renegotiateLoan(
            renegotiationData.loanId,
            renegotiationData.newLoanDuration,
            renegotiationData.newMaximumRepaymentAmount,
            renegotiationData.renegotiationFee,
            renegotiationSignature
          )
      ).to.revertedWith("Renegotiation signature is invalid");

      // Signature signer is not lender
      renegotiationSignature.signer = borrower.address;
      renegotiationSignature.signature = await getRenegotiationSignature(
        renegotiationData,
        renegotiationSignature,
        lender,
        directLoanFixedOffer.target
      );
      await expect(
        directLoanFixedOffer
          .connect(borrower)
          .renegotiateLoan(
            renegotiationData.loanId,
            renegotiationData.newLoanDuration,
            renegotiationData.newMaximumRepaymentAmount,
            renegotiationData.renegotiationFee,
            renegotiationSignature
          )
      ).to.revertedWith("Renegotiation signature is invalid");
    });

    it("should revert when renegotiation data is invalid", async () => {
      const { borrower, lender, directLoanFixedOffer, loanId, loanTerms } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      const renegotiationData = {
        loanId: loanId,
        newLoanDuration: loanTerms.duration + BigInt(ONE_DAY),
        newMaximumRepaymentAmount: loanTerms.principalAmount + 1n,
        renegotiationFee: 10n,
      };

      const renegotiationSignature = {
        nonce: Math.floor(Math.random() * 100000),
        expiry: (await getTimestamp()) + ONE_DAY,
        signer: lender.address,
        signature: "",
      };
      renegotiationSignature.signature = await getRenegotiationSignature(
        renegotiationData,
        renegotiationSignature,
        lender,
        directLoanFixedOffer.target
      );

      await expect(
        directLoanFixedOffer.connect(borrower).renegotiateLoan(
          renegotiationData.loanId,
          renegotiationData.newLoanDuration + 1n, // change here
          renegotiationData.newMaximumRepaymentAmount,
          renegotiationData.renegotiationFee,
          renegotiationSignature
        )
      ).to.revertedWith("Renegotiation signature is invalid");

      await expect(
        directLoanFixedOffer.connect(borrower).renegotiateLoan(
          renegotiationData.loanId,
          renegotiationData.newLoanDuration,
          renegotiationData.newMaximumRepaymentAmount + 1n, // change here
          renegotiationData.renegotiationFee,
          renegotiationSignature
        )
      ).to.revertedWith("Renegotiation signature is invalid");

      await expect(
        directLoanFixedOffer.connect(borrower).renegotiateLoan(
          renegotiationData.loanId,
          renegotiationData.newLoanDuration,
          renegotiationData.newMaximumRepaymentAmount,
          renegotiationData.renegotiationFee + 1n, // change here
          renegotiationSignature
        )
      ).to.revertedWith("Renegotiation signature is invalid");
    });

    describe("should renegotiation loan successfully (single user)", () => {
      it("without renegotiation fee", async () => {
        const { borrower, lender, directLoanFixedOffer, wXENE, nft, loanId, loanTerms } =
          await loadFixtureAndAcceptOffer({
            withLendingPool: false,
          });

        const renegotiationData = {
          loanId: loanId,
          newLoanDuration: loanTerms.duration + BigInt(ONE_DAY),
          newMaximumRepaymentAmount: loanTerms.principalAmount + 1n,
          renegotiationFee: 0n,
        };

        const renegotiationSignature = {
          nonce: Math.floor(Math.random() * 100000),
          expiry: (await getTimestamp()) + ONE_DAY,
          signer: lender.address,
          signature: "",
        };
        renegotiationSignature.signature = await getRenegotiationSignature(
          renegotiationData,
          renegotiationSignature,
          lender,
          directLoanFixedOffer.target
        );

        const tx = await directLoanFixedOffer
          .connect(borrower)
          .renegotiateLoan(
            renegotiationData.loanId,
            renegotiationData.newLoanDuration,
            renegotiationData.newMaximumRepaymentAmount,
            renegotiationData.renegotiationFee,
            renegotiationSignature
          );

        await expect(tx).to.changeTokenBalances(
          wXENE,
          [lender.address, borrower.address, directLoanFixedOffer],
          [0, 0, 0]
        );
        await expect(tx).to.changeTokenBalances(nft, [directLoanFixedOffer, borrower.address], [0, 0]);
        expect(await nft.ownerOf(1)).to.equal(directLoanFixedOffer);

        const loan = await directLoanFixedOffer.loanIdToLoan(loanId);
        expect(loan.principalAmount).to.equal(TOKEN_1 * 15n);
        expect(loan.maximumRepaymentAmount).to.equal(renegotiationData.newMaximumRepaymentAmount);
        expect(loan.nftCollateralId).to.equal(1);
        expect(loan.erc20Denomination).to.equal(wXENE);
        expect(loan.duration).to.equal(renegotiationData.newLoanDuration);
        expect(loan.adminFeeInBasisPoints).to.equal(25);
        expect(loan.loanStartTime).to.closeTo(await getTimestamp(), 10);
        expect(loan.nftCollateralContract).to.equal(nft);
        expect(loan.borrower).to.equal(borrower.address);
        expect(loan.lender).to.equal(lender.address);
        expect(loan.useLendingPool).to.be.false;
      });

      it("with renegotiation fee", async () => {
        const { deployer, borrower, lender, directLoanFixedOffer, wXENE, nft, loanId, loanTerms } =
          await loadFixtureAndAcceptOffer({
            withLendingPool: false,
          });

        const renegotiationData = {
          loanId: loanId,
          newLoanDuration: loanTerms.duration + BigInt(ONE_DAY),
          newMaximumRepaymentAmount: loanTerms.principalAmount + 1n,
          renegotiationFee: TOKEN_1 * 100n,
        };

        const renegotiationSignature = {
          nonce: Math.floor(Math.random() * 100000),
          expiry: (await getTimestamp()) + ONE_DAY,
          signer: lender.address,
          signature: "",
        };
        renegotiationSignature.signature = await getRenegotiationSignature(
          renegotiationData,
          renegotiationSignature,
          lender,
          directLoanFixedOffer.target
        );

        await wXENE.connect(borrower).approve(directLoanFixedOffer, renegotiationData.renegotiationFee);
        const tx = await directLoanFixedOffer
          .connect(borrower)
          .renegotiateLoan(
            renegotiationData.loanId,
            renegotiationData.newLoanDuration,
            renegotiationData.newMaximumRepaymentAmount,
            renegotiationData.renegotiationFee,
            renegotiationSignature
          );

        const adminFee = (renegotiationData.renegotiationFee * loanTerms.adminFeeInBasisPoints) / HUNDRED_PERCENT;
        await expect(tx).to.changeTokenBalances(
          wXENE,
          [lender, borrower, deployer, directLoanFixedOffer],
          [renegotiationData.renegotiationFee - adminFee, -renegotiationData.renegotiationFee, adminFee, 0]
        );
        await expect(tx).to.changeTokenBalances(nft, [directLoanFixedOffer, borrower.address], [0, 0]);
        expect(await nft.ownerOf(1)).to.equal(directLoanFixedOffer);

        const loan = await directLoanFixedOffer.loanIdToLoan(loanId);
        expect(loan.principalAmount).to.equal(TOKEN_1 * 15n);
        expect(loan.maximumRepaymentAmount).to.equal(renegotiationData.newMaximumRepaymentAmount);
        expect(loan.nftCollateralId).to.equal(1);
        expect(loan.erc20Denomination).to.equal(wXENE);
        expect(loan.duration).to.equal(renegotiationData.newLoanDuration);
        expect(loan.adminFeeInBasisPoints).to.equal(25);
        expect(loan.loanStartTime).to.closeTo(await getTimestamp(), 10);
        expect(loan.nftCollateralContract).to.equal(nft);
        expect(loan.borrower).to.equal(borrower.address);
        expect(loan.lender).to.equal(lender.address);
        expect(loan.useLendingPool).to.be.false;
      });
    });

    describe("should renegotiation loan successfully (lending pool)", () => {
      it("without renegotiation fee", async () => {
        const { borrower, lendingPoolAdmin, lendingPool, directLoanFixedOffer, wXENE, nft, loanId, loanTerms } =
          await loadFixtureAndAcceptOffer({
            withLendingPool: true,
          });

        const renegotiationData = {
          loanId: loanId,
          newLoanDuration: loanTerms.duration + BigInt(ONE_DAY),
          newMaximumRepaymentAmount: loanTerms.principalAmount + 1n,
          renegotiationFee: 0n,
        };

        const renegotiationSignature = {
          nonce: Math.floor(Math.random() * 100000),
          expiry: (await getTimestamp()) + ONE_DAY,
          signer: lendingPoolAdmin.address,
          signature: "",
        };
        renegotiationSignature.signature = await getRenegotiationSignature(
          renegotiationData,
          renegotiationSignature,
          lendingPoolAdmin,
          directLoanFixedOffer.target
        );

        const tx = await directLoanFixedOffer
          .connect(borrower)
          .renegotiateLoan(
            renegotiationData.loanId,
            renegotiationData.newLoanDuration,
            renegotiationData.newMaximumRepaymentAmount,
            renegotiationData.renegotiationFee,
            renegotiationSignature
          );

        await expect(tx).to.changeTokenBalances(
          wXENE,
          [lendingPoolAdmin.address, borrower.address, directLoanFixedOffer],
          [0, 0, 0]
        );
        await expect(tx).to.changeTokenBalances(nft, [directLoanFixedOffer, borrower.address], [0, 0]);
        expect(await nft.ownerOf(1)).to.equal(directLoanFixedOffer);

        const loan = await directLoanFixedOffer.loanIdToLoan(loanId);
        expect(loan.principalAmount).to.equal(TOKEN_1 * 15n);
        expect(loan.maximumRepaymentAmount).to.equal(renegotiationData.newMaximumRepaymentAmount);
        expect(loan.nftCollateralId).to.equal(1);
        expect(loan.erc20Denomination).to.equal(wXENE);
        expect(loan.duration).to.equal(renegotiationData.newLoanDuration);
        expect(loan.adminFeeInBasisPoints).to.equal(25);
        expect(loan.loanStartTime).to.closeTo(await getTimestamp(), 10);
        expect(loan.nftCollateralContract).to.equal(nft);
        expect(loan.borrower).to.equal(borrower.address);
        expect(loan.lender).to.equal(lendingPool.target);
        expect(loan.useLendingPool).to.be.true;
      });

      it("with renegotiation fee", async () => {
        const {
          deployer,
          borrower,
          lendingPoolAdmin,
          lendingPool,
          directLoanFixedOffer,
          wXENE,
          nft,
          loanId,
          loanTerms,
        } = await loadFixtureAndAcceptOffer({
          withLendingPool: true,
        });

        const renegotiationData = {
          loanId: loanId,
          newLoanDuration: loanTerms.duration + BigInt(ONE_DAY),
          newMaximumRepaymentAmount: loanTerms.principalAmount + 1n,
          renegotiationFee: TOKEN_1 * 100n,
        };

        const renegotiationSignature = {
          nonce: Math.floor(Math.random() * 100000),
          expiry: (await getTimestamp()) + ONE_DAY,
          signer: lendingPoolAdmin.address,
          signature: "",
        };
        renegotiationSignature.signature = await getRenegotiationSignature(
          renegotiationData,
          renegotiationSignature,
          lendingPoolAdmin,
          directLoanFixedOffer.target
        );

        await wXENE.connect(borrower).approve(directLoanFixedOffer, renegotiationData.renegotiationFee);
        const tx = await directLoanFixedOffer
          .connect(borrower)
          .renegotiateLoan(
            renegotiationData.loanId,
            renegotiationData.newLoanDuration,
            renegotiationData.newMaximumRepaymentAmount,
            renegotiationData.renegotiationFee,
            renegotiationSignature
          );

        const adminFee = (renegotiationData.renegotiationFee * loanTerms.adminFeeInBasisPoints) / HUNDRED_PERCENT;
        await expect(tx).to.changeTokenBalances(
          wXENE,
          [lendingPoolAdmin, lendingPool, borrower, deployer, directLoanFixedOffer],
          [0, renegotiationData.renegotiationFee - adminFee, -renegotiationData.renegotiationFee, adminFee, 0]
        );
        await expect(tx).to.changeTokenBalances(nft, [directLoanFixedOffer, borrower.address], [0, 0]);
        expect(await nft.ownerOf(1)).to.equal(directLoanFixedOffer);

        const loan = await directLoanFixedOffer.loanIdToLoan(loanId);
        expect(loan.principalAmount).to.equal(TOKEN_1 * 15n);
        expect(loan.maximumRepaymentAmount).to.equal(renegotiationData.newMaximumRepaymentAmount);
        expect(loan.nftCollateralId).to.equal(1);
        expect(loan.erc20Denomination).to.equal(wXENE);
        expect(loan.duration).to.equal(renegotiationData.newLoanDuration);
        expect(loan.adminFeeInBasisPoints).to.equal(25);
        expect(loan.loanStartTime).to.closeTo(await getTimestamp(), 10);
        expect(loan.nftCollateralContract).to.equal(nft);
        expect(loan.borrower).to.equal(borrower.address);
        expect(loan.lender).to.equal(lendingPool);
        expect(loan.useLendingPool).to.be.true;
      });
    });
  });

  describe("cancelLoanCommitmentBeforeLoanHasBegun", () => {
    it("should revert when pause", async () => {
      const { lender, directLoanFixedOffer, signature } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      await directLoanFixedOffer.pause();
      await expect(
        directLoanFixedOffer.connect(lender).cancelLoanCommitmentBeforeLoanHasBegun(signature.nonce)
      ).to.revertedWithCustomError(directLoanFixedOffer, "EnforcedPause");
    });

    it("should revert when nonce has been used", async () => {
      const { lender, directLoanFixedOffer, signature } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      await expect(
        directLoanFixedOffer.connect(lender).cancelLoanCommitmentBeforeLoanHasBegun(signature.nonce)
      ).to.revertedWith("Invalid nonce");
    });

    it("should cancel successfully", async () => {
      const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
      const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

      await nft.connect(borrower).approve(directLoanFixedOffer, 1);
      await wXENE.connect(lender).approve(directLoanFixedOffer, ethers.MaxUint256);
      signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);

      await directLoanFixedOffer.connect(lender).cancelLoanCommitmentBeforeLoanHasBegun(signature.nonce);

      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.rejectedWith(
        "Lender nonce invalid"
      );
    });
  });

  describe("isValidLenderSignature", () => {
    it("should revert when loan contract is zero address", async () => {
      const { lendingPoolAdmin, nftfiSigningUtilsContract, directLoanFixedOffer, wXENE, nft, lendingPool } =
        await loadFixture(deployFixture);
      const { offer, signature } = await createTestData(lendingPoolAdmin, wXENE, nft, lendingPool);
      signature.signature = await getOfferSignature(offer, signature, lendingPoolAdmin, directLoanFixedOffer.target);

      await expect(
        nftfiSigningUtilsContract.isValidLenderSignature(offer, signature, ethers.ZeroAddress)
      ).to.revertedWith("Loan is zero address");
    });
  });

  describe("isValidLenderRenegotiationSignature", () => {
    it("should revert when loan contract is zero address", async () => {
      const { lender, nftfiSigningUtilsContract, directLoanFixedOffer, loanId, loanTerms } =
        await loadFixtureAndAcceptOffer({
          withLendingPool: false,
        });

      const renegotiationData = {
        loanId: loanId,
        newLoanDuration: loanTerms.duration + BigInt(ONE_DAY),
        newMaximumRepaymentAmount: loanTerms.principalAmount + 1n,
        renegotiationFee: 10n,
      };

      const renegotiationSignature = {
        nonce: Math.floor(Math.random() * 100000),
        expiry: (await getTimestamp()) + ONE_DAY,
        signer: lender.address,
        signature: "",
      };
      renegotiationSignature.signature = await getRenegotiationSignature(
        renegotiationData,
        renegotiationSignature,
        lender,
        directLoanFixedOffer.target
      );

      const loan = {
        principalAmount: loanTerms.principalAmount,
        maximumRepaymentAmount: loanTerms.maximumRepaymentAmount,
        nftCollateralId: loanTerms.nftCollateralId,
        erc20Denomination: loanTerms.erc20Denomination,
        duration: loanTerms.duration,
        adminFeeInBasisPoints: loanTerms.adminFeeInBasisPoints,
        loanStartTime: loanTerms.loanStartTime,
        nftCollateralContract: loanTerms.nftCollateralContract,
        borrower: loanTerms.borrower,
        lender: loanTerms.lender,
        useLendingPool: loanTerms.useLendingPool,
      } as LoanData.LoanTermsStruct;
      await expect(
        nftfiSigningUtilsContract.isValidLenderRenegotiationSignature(
          renegotiationData.loanId,
          renegotiationData.newLoanDuration,
          renegotiationData.newMaximumRepaymentAmount,
          renegotiationData.renegotiationFee,
          loan,
          renegotiationSignature,
          ethers.ZeroAddress
        )
      ).to.revertedWith("Loan is zero address");
    });
  });

  describe("pause/unpause", () => {
    it("should revert when is not owner", async () => {
      const { borrower, directLoanFixedOffer } = await loadFixture(deployFixture);
      await expect(directLoanFixedOffer.connect(borrower).pause()).to.revertedWithCustomError(
        directLoanFixedOffer,
        "OwnableUnauthorizedAccount"
      );
      await expect(directLoanFixedOffer.connect(borrower).unpause()).to.revertedWithCustomError(
        directLoanFixedOffer,
        "OwnableUnauthorizedAccount"
      );
    });

    it("should pause/unpause successfully", async () => {
      const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
      const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

      await nft.connect(borrower).approve(directLoanFixedOffer, 1);
      await wXENE.connect(lender).approve(directLoanFixedOffer, ethers.MaxUint256);
      signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);

      await directLoanFixedOffer.pause();
      expect(await directLoanFixedOffer.paused()).to.be.true;
      await expect(
        directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)
      ).to.revertedWithCustomError(directLoanFixedOffer, "EnforcedPause");

      await directLoanFixedOffer.unpause();
      expect(await directLoanFixedOffer.paused()).to.be.false;
      await directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature);
    });
  });
});
