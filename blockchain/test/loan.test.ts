import { expect } from "chai";
import { ethers } from "hardhat";
import { Addressable, AddressLike, BaseContract, Contract, Signer } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { getRandomInt, getTimestamp, skipTime, ZERO_ADDRESS, MAX_UINT256, getOfferSignature } from "./utils";
import { LoanData } from "../typechain-types/contracts/loans/direct/loanTypes/DirectLoanFixedOffer";

const TOKEN_1 = ethers.parseUnits("1", 18);
const ONE_DAY = 24 * 60 * 60;

enum LoanStatus {
  ACTIVE,
  REPAID,
  LIQUIDATED,
}

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
    const permittedNFTs = await ethers.deployContract("PermittedNFTs", [deployer]);
    const wXENE = await ethers.deployContract("WXENE");
    const directLoanFixedOffer = await ethers.deployContract(
      "DirectLoanFixedOffer",
      [deployer, permittedNFTs, [wXENE]],
      {
        libraries: {
          LoanChecksAndCalculations: loanChecksAndCalculations,
          NFTfiSigningUtils: nftfiSigningUtils,
        },
      }
    );
    const lendingPool = await ethers.deployContract("LendingPool", [deployer]);
    await lendingPool.setAdmin(lendingPoolAdmin, true);
    await lendingPool.setLoan(directLoanFixedOffer);

    const lendingStake = await ethers.deployContract("LendingStake", [wXENE, lendingPool, TOKEN_1, 0]);
    await lendingPool.setLendingStake(lendingStake);
    const nft = await ethers.deployContract("ChonkSociety", ["test baseURI"]);
    await permittedNFTs.setNFTPermit(nft, true);
    await nft.connect(borrower).mint(borrower, 10);
    await wXENE.mintTo(lender, { value: TOKEN_1 * 100n });
    await wXENE.mintTo(borrower, { value: TOKEN_1 * 100n });

    return {
      deployer,
      lender,
      borrower,
      lendingPoolAdmin,
      accounts,
      permittedNFTs,
      wXENE,
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
      permittedNFTs,
      wXENE,
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
      permittedNFTs,
      wXENE,
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

  describe("acceptOffer", () => {
    it("should revert with currency denomination is not permitted", async () => {
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

    it("should revert with NFT collateral contract is not permitted", async () => {
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

    it("should revert with loan duration exceeds maximum loan duration", async () => {
      const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
      const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);
      offer.duration = ONE_DAY * 7 * 53 + 1;
      signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);

      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
        "Loan duration exceeds maximum loan duration"
      );
    });

    it("should revert with loan duration cannot be zero", async () => {
      const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
      const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

      offer.duration = 0;
      signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);

      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature)).to.revertedWith(
        "Loan duration cannot be zero"
      );
    });

    it("should revert with the admin fee has changed since this order was signed.", async () => {
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

    it("should revert with negative interest rate loans are not allowed.", async () => {
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

    it("should revert with lender nonce invalid", async () => {
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

    describe("should revert with lender signature is invalid", () => {
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
        const { lender, borrower, directLoanFixedOffer, wXENE, nft, permittedNFTs } = await loadFixture(deployFixture);
        const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

        signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);

        const newNft = await ethers.deployContract("ChonkSociety", ["base uri"]);
        await permittedNFTs.setNFTPermit(newNft, true);
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

    it("should revert with invalid token id", async () => {
      const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
      const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

      offer.nftCollateralId = 123;
      signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);
      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature))
        .to.revertedWithCustomError(nft, "ERC721NonexistentToken")
        .withArgs(123);
    });

    it("should revert with caller is not token owner or approved", async () => {
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

    it("should revert with token insufficient allowance", async () => {
      const { lender, borrower, directLoanFixedOffer, wXENE, nft } = await loadFixture(deployFixture);
      const { offer, signature, loanId } = await createTestData(lender, wXENE, nft);

      offer.principalAmount = TOKEN_1 * 2n;
      await nft.connect(borrower).approve(directLoanFixedOffer, 1);
      signature.signature = await getOfferSignature(offer, signature, lender, directLoanFixedOffer.target);

      await expect(directLoanFixedOffer.connect(borrower).acceptOffer(loanId, offer, signature))
        .to.revertedWithCustomError(wXENE, "ERC20InsufficientAllowance")
        .withArgs(directLoanFixedOffer, 0, offer.principalAmount);
    });

    it("should revert with transfer amount exceeds balance", async () => {
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
          LoanStatus.ACTIVE,
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
      expect(loan.status).to.equal(LoanStatus.ACTIVE);
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

    it("should revert with Lender signature is invalid", async () => {
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

    it("should revert with transfer amount exceeds lending stake balance", async () => {
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
          LoanStatus.ACTIVE,
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
      expect(loan.status).to.equal(LoanStatus.ACTIVE);
    });
  });

  describe("payBackLoan", () => {
    it("should revert with insufficient allowance", async () => {
      const { borrower, directLoanFixedOffer, wXENE, loanId, loanTerms } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      const { payoffAmount } = payoffAndFee(loanTerms);
      await expect(directLoanFixedOffer.connect(borrower).payBackLoan(loanId))
        .to.revertedWithCustomError(wXENE, "ERC20InsufficientAllowance")
        .withArgs(directLoanFixedOffer, 0, payoffAmount);
    });

    it("should revert with loan already repaid", async () => {
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

    it("should revert with loan already liquidated", async () => {
      const { lender, borrower, directLoanFixedOffer, loanId } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      await skipTime(ONE_DAY + 1);
      await directLoanFixedOffer.connect(lender).liquidateOverdueLoan(loanId);

      await expect(directLoanFixedOffer.connect(borrower).payBackLoan(loanId)).to.revertedWith(
        "Loan already repaid/liquidated"
      );
    });

    it("should revert with loan is expired", async () => {
      const { borrower, directLoanFixedOffer, wXENE, loanId } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });
      await wXENE.connect(borrower).approve(directLoanFixedOffer, ethers.MaxUint256);

      await skipTime(ONE_DAY + 1);
      await expect(directLoanFixedOffer.connect(borrower).payBackLoan(loanId)).to.revertedWith("Loan is expired");
    });

    it("should revert with transfer amount exceeds balance", async () => {
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

  describe.only("liquidateOverdueLoan", () => {
    it("should revert with loan already repaid", async () => {
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

    it("should revert with loan already liquidated", async () => {
      const { lender, borrower, directLoanFixedOffer, loanId } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      await skipTime(ONE_DAY + 1);
      await directLoanFixedOffer.connect(lender).liquidateOverdueLoan(loanId);

      await expect(directLoanFixedOffer.connect(borrower).liquidateOverdueLoan(loanId)).to.revertedWith(
        "Loan already repaid/liquidated"
      );
    });

    it("should revert with invalid loan id", async () => {
      const { lender, borrower, directLoanFixedOffer, loanId } = await loadFixtureAndAcceptOffer({
        withLendingPool: false,
      });

      await expect(directLoanFixedOffer.connect(lender).liquidateOverdueLoan(loanId + 1)).to.be.reverted;
      // await expect(directLoanFixedOffer.connect(lender).liquidateOverdueLoan(1)).to.be.reverted;

      // await wXENE.connect(borrower).approve(directLoanFixedOffer.address, MAX_UINT256);
      // await wXENE.connect(borrower).mint(borrower.address, TOKEN_1.mul(3));
      // await directLoanFixedOffer.connect(borrower).payBackLoan(loanId);

      // await expect(directLoanFixedOffer.connect(lender).liquidateOverdueLoan(1)).to.be.reverted;
    });

    it("should revert with loan is not overdue yet", async () => {
      await expect(directLoanFixedOffer.connect(lender).liquidateOverdueLoan(loanId)).to.revertedWith(
        "Loan is not overdue yet"
      );
    });

    it("should revert with only lender can liquidate", async () => {
      await skipTime(ONE_DAY);
      await expect(directLoanFixedOffer.liquidateOverdueLoan(loanId)).to.revertedWith("Only lender can liquidate");
      await expect(directLoanFixedOffer.connect(borrower).liquidateOverdueLoan(loanId)).to.revertedWith(
        "Only lender can liquidate"
      );
    });

    it("should liquidateOverdueLoan successfully", async () => {
      await skipTime(ONE_DAY);
      await expect(directLoanFixedOffer.connect(lender).liquidateOverdueLoan(loanId))
        .to.emit(directLoanFixedOffer, "LoanLiquidated")
        .to.changeTokenBalances(chonkSociety, [directLoanFixedOffer.address, lender.address], [-1, 1]);
    });
  });

  //     it("", async () => {
  //         const loanId = "0xe2156a8c0df2c909cdb8363fe05203381d9b0c9e24dbfc15ee53f741268b0078";
  //         const offer = {
  //             principalAmount: {
  //                 type: "BigNumber",
  //                 hex: "0x8ac7230489e80000",
  //             },
  //             maximumRepaymentAmount: {
  //                 type: "BigNumber",
  //                 hex: "0x8ef0f36da2860000",
  //             },
  //             nftCollateralId: 4,
  //             nftCollateralContract: "0xf31a2e258bec65a46fb54cd808294ce215070150",
  //             duration: 2592000,
  //             adminFeeInBasisPoints: 25,
  //             erc20Denomination: "0x3b3f35c81488c49b370079fd05cfa917c83a38a9",
  //         };
  //         const signature = [
  //             {
  //                 signer: "0xbf4e57ea10b8d19ad436293818469758145ee915",
  //                 nonce: 8235433715756225,
  //                 expiry: 53944393777,
  //                 signature: "0x8fe2e9e2b051e2d01b2596d09c316f4c63caafc5408e9752a4fa58eac9338b25133e81b6265f200196d2c07466c15619a6edad4c12f0aa8deb42e0732a5876941b",
  //             },
  //             {
  //                 signer: "0x601d06fd394b4e74037f51e13b0b6fc9e6a2c7df",
  //                 nonce: 3098022932000833,
  //                 expiry: 53944393792,
  //                 signature: "0xe4c168f37fd389f4ceff3879f699c0a13707488d0a784cbbbe44826ee57a0f567b25b06732963ba094a8353a2d9bf7da2c6d253ff52df235a092dee2fad92e181c",
  //             },
  //             {
  //                 signer: "0x475dadd02b62698b8a3ce58dfbf5b05168a7a1db",
  //                 nonce: 119440082829873,
  //                 expiry: 53944393785,
  //                 signature: "0x5464184b4378c65ea1758cd422af03191072f6c438fa321b1246e6aa3714106f4021214825dd6a6a80fae9863d0df4618eb4a83d93ec17047167a8e68e98f9911c",
  //             },
  //         ];
  //     });

  //     it("test pay back", async () => {
  //         await chonkSociety.connect(borrower).approve(directLoanFixedOffer.address, 1);
  //         await wXENE.connect(lender).approve(directLoanFixedOffer.address, TOKEN_1.mul(100));

  //         const offer = {
  //             principalAmount: TOKEN_1.mul(15),
  //             maximumRepaymentAmount: TOKEN_1.mul(18),
  //             nftCollateralId: 1,
  //             nftCollateralContract: chonkSociety.address,
  //             duration: ONE_DAY * 30,
  //             adminFeeInBasisPoints: 25,
  //             erc20Denomination: wXENE.address,
  //         };

  //         const encodeOffer = getEncodeOffer(offer);

  //         const signature = {
  //             nonce: getRandomInt(),
  //             expiry: 1689699600,
  //             signer: lender.address,
  //         };

  //         const encodeSignature = getEncodedSignature(signature);

  //         const message = getMessage(encodeOffer, encodeSignature, directLoanFixedOffer.address, 31337);
  //         const provider = ethers.provider;
  //         const signer = provider.getSigner(lender.address);
  //         // console.log("test message", ethers.utils.hashMessage(message));
  //         signature.signature = await signer.signMessage(message);

  //         // const signerAddress = ethers.utils.verifyMessage(ethers.utils.hashMessage(message), signature.signature);
  //         const loanId = "0xebe4fe30af161bb8b26d55867c264d98c256cbfe364c00ea2cb779d1233d67c9";
  //         await directLoanFixedOffer.connect(borrower).acceptOfferLendingPool(loanId, offer, [signature, signature, signature]);

  //         await wXENE.connect(borrower).approve(directLoanFixedOffer.address, TOKEN_1.mul(100));
  //         await wXENE.connect(borrower).mint(borrower.address, TOKEN_1.mul(3));

  //         await directLoanFixedOffer.connect(borrower).payBackLoan(loanId);
  //         console.log(await chonkSociety.ownerOf(1), borrower.address);
  //     });

  //     // it("test liquidateNFT", async () => {
  //     //     await chonkSociety.connect(borrower).approve(directLoanFixedOffer.address, 1);
  //     //     await wXENE.connect(lender).approve(directLoanFixedOffer.address, TOKEN_1.mul(100));

  //     //     const offer = {
  //     //         principalAmount: TOKEN_1.mul(15),
  //     //         maximumRepaymentAmount: TOKEN_1.mul(18),
  //     //         nftCollateralId: 1,
  //     //         nftCollateralContract: chonkSociety.address,
  //     //         duration: 60,
  //     //         adminFeeInBasisPoints: 25,
  //     //         erc20Denomination: wXENE.address,
  //     //     };

  //     //     const encodeOffer = getEncodeOffer(offer);

  //     //     const signature = {
  //     //         nonce: getRandomInt(),
  //     //         expiry: Number(await getCurrentTimestamp()) + 60,
  //     //         signer: lender.address,
  //     //     };

  //     //     const encodeSignature = getEncodedSignature(signature);

  //     //     const message = getMessage(encodeOffer, encodeSignature, directLoanFixedOffer.address, 31337);
  //     //     const provider = ethers.provider;
  //     //     const signer = provider.getSigner(lender.address);
  //     //     // console.log("test message", ethers.utils.hashMessage(message));
  //     //     signature.signature = await signer.signMessage(message);

  //     //     // const signerAddress = ethers.utils.verifyMessage(ethers.utils.hashMessage(message), signature.signature);
  //     //     const loanId = "0xebe4fe30af161bb8b26d55867c264d98c256cbfe364c00ea2cb779d1233d67c9";
  //     //     await directLoanFixedOffer.connect(borrower).acceptOfferLendingPool(loanId, offer, [signature, signature, signature]);

  //     //     await wXENE.connect(borrower).approve(directLoanFixedOffer.address, TOKEN_1.mul(100));
  //     //     await wXENE.connect(borrower).mint(borrower.address, TOKEN_1.mul(3));

  //     //     await skipTime(60);

  //     //     await directLoanFixedOffer.connect(borrower).liquidateOverdueLoan(loanId);
  //     //     console.log(await chonkSociety.ownerOf(1), liquidateNFTPool.address);
  //     // });
  // });
});
