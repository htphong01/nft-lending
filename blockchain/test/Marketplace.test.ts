import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

const FEE_PERCENTAGE = 1000n;
enum ItemStatus {
  OPENING,
  SOLD,
  CLOSED,
}

describe("Marketplace", function () {
  async function deployFixture() {
    const [deployer, feeReceiver, user1, user2, beneficiary] = await ethers.getSigners();

    const nft = await ethers.deployContract("ChonkSociety", ["test uri"]);
    const wXENE = await ethers.deployContract("WXENE");
    const marketplace = await ethers.deployContract("Marketplace", [deployer, feeReceiver, FEE_PERCENTAGE]);

    // mint token to users
    await wXENE.connect(user2).mint({ value: ethers.parseEther("100") });

    // mint NFTs to users
    await nft.connect(user1).mint(user1.address, 2);
    await nft.connect(user1).setApprovalForAll(marketplace, true);

    return { nft, wXENE, marketplace, deployer, feeReceiver, user1, user2, beneficiary };
  }

  describe("Deployment", function () {
    it("should initialized successfully", async function () {
      const { marketplace, deployer, feeReceiver } = await loadFixture(deployFixture);

      expect(await marketplace.owner()).to.equal(deployer.address);
      expect(await marketplace.isAdmin(deployer.address)).to.be.true;
      expect(await marketplace.feeReceiver()).to.equal(feeReceiver.address);
      expect(await marketplace.feePercent()).to.equal(FEE_PERCENTAGE);
    });
  });

  describe("setPaymentToken", function () {
    it("should throw error when not admin", async function () {
      const { marketplace, user1, wXENE } = await loadFixture(deployFixture);
      await expect(marketplace.connect(user1).setPaymentToken(wXENE, true))
        .to.revertedWithCustomError(marketplace, "AdminUnauthorizedAccount")
        .withArgs(user1.address);
    });

    it("should successfully", async function () {
      const { marketplace, wXENE } = await loadFixture(deployFixture);

      await marketplace.setPaymentToken(wXENE, true);
      expect(await marketplace.paymentToken(wXENE)).to.be.true;

      await marketplace.setPaymentToken(wXENE, false);
      expect(await marketplace.paymentToken(wXENE)).to.be.false;
    });
  });

  describe("setFeeReceiver", function () {
    it("should throw error when not admin", async function () {
      const { marketplace, user1 } = await loadFixture(deployFixture);
      await expect(marketplace.connect(user1).setFeeReceiver(user1.address))
        .to.revertedWithCustomError(marketplace, "AdminUnauthorizedAccount")
        .withArgs(user1.address);
    });

    it("should throw error when address is invalid", async function () {
      const { marketplace } = await loadFixture(deployFixture);
      await expect(marketplace.setFeeReceiver(ethers.ZeroAddress)).to.revertedWithCustomError(
        marketplace,
        "InvalidFeeReceiver"
      );
    });

    it("should successfully", async function () {
      const { marketplace, user1 } = await loadFixture(deployFixture);
      await marketplace.setFeeReceiver(user1.address);
      expect(await marketplace.feeReceiver()).to.equal(user1.address);
    });
  });

  describe("setFeePercent", function () {
    it("should throw error when not admin", async function () {
      const { marketplace, user1 } = await loadFixture(deployFixture);
      await expect(marketplace.connect(user1).setFeePercent(20))
        .to.revertedWithCustomError(marketplace, "AdminUnauthorizedAccount")
        .withArgs(user1.address);
    });

    it("should throw error when fee percent is greater than 10000", async function () {
      const { marketplace } = await loadFixture(deployFixture);
      await expect(marketplace.setFeePercent(10001)).to.revertedWithCustomError(marketplace, "InvalidFeePercent");
    });

    it("should successfully", async function () {
      const { marketplace } = await loadFixture(deployFixture);
      await marketplace.setFeePercent(10000);
      expect(await marketplace.feePercent()).to.equal(10000);
    });
  });

  describe("makeItem", function () {
    it("should throw error when token is invalid", async function () {
      const { marketplace, nft, wXENE, user1, beneficiary } = await loadFixture(deployFixture);
      await expect(marketplace.connect(user1).makeItem(nft, 1, wXENE, 1, beneficiary)).to.revertedWithCustomError(
        marketplace,
        "NotPermittedToken"
      );
    });

    it("should throw error when price is zero", async function () {
      const { marketplace, nft, wXENE, user1, beneficiary } = await loadFixture(deployFixture);
      await marketplace.setPaymentToken(wXENE, true);
      await expect(marketplace.connect(user1).makeItem(nft, 1, wXENE, 0, beneficiary)).to.revertedWithCustomError(
        marketplace,
        "InvalidPrice"
      );
    });

    it("should throw error when nft address is invalid", async function () {
      const { marketplace, wXENE, user1, beneficiary } = await loadFixture(deployFixture);
      await marketplace.setPaymentToken(wXENE, true);
      await expect(
        marketplace.connect(user1).makeItem(ethers.ZeroAddress, 1, wXENE, 1, beneficiary)
      ).to.revertedWithCustomError(marketplace, "InvalidNft");
    });

    it("should throw error nft balance is zero", async function () {
      const { marketplace, wXENE, nft, user2, beneficiary } = await loadFixture(deployFixture);
      await marketplace.setPaymentToken(wXENE, true);
      await expect(marketplace.connect(user2).makeItem(nft, 1, wXENE, 1, beneficiary)).to.revertedWithCustomError(
        nft,
        "ERC721IncorrectOwner"
      );
    });

    it("should successfully", async function () {
      const { marketplace, wXENE, nft, user1, beneficiary } = await loadFixture(deployFixture);
      await marketplace.setPaymentToken(wXENE, true);
      await expect(marketplace.connect(user1).makeItem(nft, 1, wXENE, 1, beneficiary)).to.changeTokenBalances(
        nft,
        [user1, marketplace],
        [-1, 1]
      );

      const marketItem = await marketplace.items(1);
      expect(marketItem.itemId).to.equal(1);
      expect(marketItem.nft).to.equal(nft);
      expect(marketItem.tokenId).to.equal(1);
      expect(marketItem.price).to.equal(1);
      expect(marketItem.seller).to.equal(user1.address);
      expect(marketItem.status).to.equal(ItemStatus.OPENING);
    });
  });

  describe("purchaseItem", async function () {
    it("should throw error when item is not exist", async function () {
      const { marketplace, user1 } = await loadFixture(deployFixture);
      await expect(marketplace.connect(user1).purchaseItem(1)).to.revertedWithCustomError(
        marketplace,
        "NotExistedItem"
      );
    });

    it("should throw error when item is not opening", async function () {
      const { marketplace, wXENE, nft, user1, beneficiary } = await loadFixture(deployFixture);
      await marketplace.setPaymentToken(wXENE, true);
      await marketplace.connect(user1).makeItem(nft, 1, wXENE, 1, beneficiary);
      await marketplace.connect(user1).closeItem(1);

      await expect(marketplace.connect(user1).purchaseItem(1)).to.revertedWithCustomError(
        marketplace,
        "NotOpeningItem"
      );
    });

    it("should throw error when not enough ETH", async function () {
      const { marketplace, nft, user1, beneficiary } = await loadFixture(deployFixture);
      await marketplace.setPaymentToken(ethers.ZeroAddress, true);
      await marketplace.connect(user1).makeItem(nft, 1, ethers.ZeroAddress, 1, beneficiary);

      await expect(marketplace.connect(user1).purchaseItem(1)).to.revertedWithCustomError(marketplace, "NotEnougnETH");
    });

    it("should successfully with native", async function () {
      const { marketplace, nft, user1, user2, beneficiary, feeReceiver } = await loadFixture(deployFixture);
      const price = ethers.parseEther("10");
      await marketplace.setPaymentToken(ethers.ZeroAddress, true);

      // With market fee
      await marketplace.connect(user1).makeItem(nft, 1, ethers.ZeroAddress, price, beneficiary);
      const marketFee = (price * FEE_PERCENTAGE) / 10000n;
      let tx = marketplace.connect(user2).purchaseItem(1, { value: price });
      await expect(tx).to.changeEtherBalances(
        [user1, user2, beneficiary, feeReceiver, marketplace],
        [0, price * -1n, price - marketFee, marketFee, 0]
      );
      await expect(tx).to.changeTokenBalances(
        nft,
        [user1, user2, beneficiary, feeReceiver, marketplace],
        [0, 1, 0, 0, -1]
      );
      expect(await nft.ownerOf(1)).to.equal(user2.address);
      expect((await marketplace.items(1)).status).to.equal(ItemStatus.SOLD);

      // Without market fee
      await marketplace.setFeePercent(0);
      await marketplace.connect(user1).makeItem(nft, 2, ethers.ZeroAddress, price, beneficiary);
      tx = marketplace.connect(user2).purchaseItem(2, { value: price });
      await expect(tx).to.changeEtherBalances(
        [user1, user2, beneficiary, feeReceiver, marketplace],
        [0, price * -1n, price, 0, 0]
      );
      await expect(tx).to.changeTokenBalances(
        nft,
        [user1, user2, beneficiary, feeReceiver, marketplace],
        [0, 1, 0, 0, -1]
      );
      expect(await nft.ownerOf(2)).to.equal(user2.address);
      expect((await marketplace.items(2)).status).to.equal(ItemStatus.SOLD);
    });

    it("should successfully with ERC20 token", async function () {
      const { marketplace, nft, wXENE, user1, user2, beneficiary, feeReceiver } = await loadFixture(deployFixture);
      const price = ethers.parseEther("10");
      await wXENE.connect(user2).approve(marketplace, ethers.MaxUint256);
      await marketplace.setPaymentToken(wXENE, true);

      // With market fee
      await marketplace.connect(user1).makeItem(nft, 1, wXENE, price, beneficiary);
      const marketFee = (price * FEE_PERCENTAGE) / 10000n;
      let tx = marketplace.connect(user2).purchaseItem(1);
      await expect(tx).to.changeTokenBalances(
        wXENE,
        [user1, user2, beneficiary, feeReceiver, marketplace],
        [0, price * -1n, price - marketFee, marketFee, 0]
      );
      await expect(tx).changeTokenBalances(
        nft,
        [user1, user2, beneficiary, feeReceiver, marketplace],
        [0, 1, 0, 0, -1]
      );
      expect(await nft.ownerOf(1)).to.equal(user2.address);
      expect((await marketplace.items(1)).status).to.equal(ItemStatus.SOLD);

      // Without market fee
      await marketplace.setFeePercent(0);
      await marketplace.connect(user1).makeItem(nft, 2, wXENE, price, beneficiary);
      tx = marketplace.connect(user2).purchaseItem(2);
      await expect(tx).to.changeTokenBalances(
        wXENE,
        [user1, user2, beneficiary, feeReceiver, marketplace],
        [0, price * -1n, price, 0, 0]
      );
      await expect(tx).changeTokenBalances(
        nft,
        [user1, user2, beneficiary, feeReceiver, marketplace],
        [0, 1, 0, 0, -1]
      );
      expect(await nft.ownerOf(2)).to.equal(user2.address);
      expect((await marketplace.items(2)).status).to.equal(ItemStatus.SOLD);
    });
  });

  describe("closeItem", function () {
    it("should throw error when item is not exist", async function () {
      const { marketplace, user1 } = await loadFixture(deployFixture);
      await expect(marketplace.connect(user1).closeItem(1)).to.revertedWithCustomError(marketplace, "NotExistedItem");
    });

    it("should throw error when not seller", async function () {
      const { marketplace, wXENE, nft, user1, user2, beneficiary } = await loadFixture(deployFixture);
      await marketplace.setPaymentToken(wXENE, true);
      await marketplace.connect(user1).makeItem(nft, 1, wXENE, 1, beneficiary);

      await expect(marketplace.connect(user2).closeItem(1)).to.revertedWithCustomError(marketplace, "OnlyItemOwner");
    });

    it("should throw error when item is not opening", async function () {
      const { marketplace, wXENE, nft, user1, beneficiary } = await loadFixture(deployFixture);
      await marketplace.setPaymentToken(wXENE, true);
      await marketplace.connect(user1).makeItem(nft, 1, wXENE, 1, beneficiary);
      await marketplace.connect(user1).closeItem(1);

      await expect(marketplace.connect(user1).closeItem(1)).to.revertedWithCustomError(marketplace, "NotOpeningItem");
    });

    it("should successfully", async function () {
      const { marketplace, wXENE, nft, user1, beneficiary } = await loadFixture(deployFixture);
      await marketplace.setPaymentToken(wXENE, true);
      await marketplace.connect(user1).makeItem(nft, 1, wXENE, 1, beneficiary);

      await expect(marketplace.connect(user1).closeItem(1)).to.changeTokenBalances(nft, [user1, marketplace], [1, -1]);
      expect((await marketplace.items(1)).status).to.equal(ItemStatus.CLOSED);
    });
  });
});
