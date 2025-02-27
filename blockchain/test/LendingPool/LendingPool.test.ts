import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

const FEE_PERCENTAGE = 1000n;
const ONE = ethers.parseEther("1");
const REWARD_PER_BLOCK = ethers.parseEther("10");
const START_BLOCK = 0;

describe("LendingPool", function () {
  async function deployFixture() {
    const [deployer, loan, user1, user2] = await ethers.getSigners();

    const nft = await ethers.deployContract("ChonkSociety", ["test uri"]);
    const wXENE = await ethers.deployContract("WXENE");
    const lendingPool = await ethers.deployContract("LendingPool", [deployer]);
    const lendingStake = await ethers.deployContract("LendingStake", [
      wXENE,
      lendingPool,
      REWARD_PER_BLOCK,
      START_BLOCK,
    ]);
    const marketplace = await ethers.deployContract("Marketplace", [deployer, deployer, FEE_PERCENTAGE]);
    await marketplace.setPaymentToken(wXENE, true);

    // Setup lending pool
    await lendingPool.setLoan(loan);
    await lendingPool.setLendingStake(lendingStake);
    await lendingPool.setMarketplace(marketplace);

    // mint token
    await wXENE.mintTo(lendingStake, { value: ONE * 100n });

    // mint NFT
    await nft.mint(lendingPool, 1);

    return { deployer, loan, user1, user2, wXENE, lendingPool, lendingStake, marketplace, nft };
  }

  describe("Deployment", function () {
    it("should initialized successfully", async function () {
      const { deployer, lendingPool, lendingStake, marketplace, loan } = await loadFixture(deployFixture);

      expect(await lendingPool.owner()).to.equal(deployer.address);
      expect(await lendingPool.isAdmin(deployer.address)).to.be.true;
      expect(await lendingPool.loan()).to.equal(loan);
      expect(await lendingPool.lendingStake()).to.equal(lendingStake);
      expect(await lendingPool.marketplace()).to.equal(marketplace);
    });
  });

  describe("setLoan", function () {
    it("should throw error when not owner", async function () {
      const { lendingPool, user1 } = await loadFixture(deployFixture);
      await expect(lendingPool.connect(user1).setLoan(user1.address)).to.revertedWithCustomError(
        lendingPool,
        "OwnableUnauthorizedAccount"
      );
    });

    it("should throw error when address is invalid", async function () {
      const { lendingPool } = await loadFixture(deployFixture);
      await expect(lendingPool.setLoan(ethers.ZeroAddress)).to.revertedWithCustomError(lendingPool, "InvalidAddress");
    });

    it("should successfully", async function () {
      const { lendingPool, loan } = await loadFixture(deployFixture);
      await lendingPool.setLoan(loan.address);
      expect(await lendingPool.loan()).to.equal(loan.address);
    });
  });

  describe("setLendingStake", function () {
    it("should throw error when not owner", async function () {
      const { lendingPool, user1 } = await loadFixture(deployFixture);
      await expect(lendingPool.connect(user1).setLendingStake(user1.address)).to.revertedWithCustomError(
        lendingPool,
        "OwnableUnauthorizedAccount"
      );
    });

    it("should throw error when address is invalid", async function () {
      const { lendingPool } = await loadFixture(deployFixture);
      await expect(lendingPool.setLendingStake(ethers.ZeroAddress)).to.revertedWithCustomError(
        lendingPool,
        "InvalidAddress"
      );
    });

    it("should successfully", async function () {
      const { lendingPool, lendingStake } = await loadFixture(deployFixture);
      await lendingPool.setLendingStake(lendingStake);
      expect(await lendingPool.lendingStake()).to.equal(lendingStake);
    });
  });

  describe("setMarketplace", function () {
    it("should throw error when not owner", async function () {
      const { lendingPool, user1 } = await loadFixture(deployFixture);
      await expect(lendingPool.connect(user1).setMarketplace(user1.address)).to.revertedWithCustomError(
        lendingPool,
        "OwnableUnauthorizedAccount"
      );
    });

    it("should throw error when address is invalid", async function () {
      const { lendingPool } = await loadFixture(deployFixture);
      await expect(lendingPool.setMarketplace(ethers.ZeroAddress)).to.revertedWithCustomError(
        lendingPool,
        "InvalidAddress"
      );
    });

    it("should successfully", async function () {
      const { lendingPool, marketplace } = await loadFixture(deployFixture);
      await lendingPool.setMarketplace(marketplace);
      expect(await lendingPool.marketplace()).to.equal(marketplace);
    });
  });

  describe("pause", function () {
    it("Should throw error when caller is not owner", async function () {
      const { lendingPool, user1 } = await loadFixture(deployFixture);
      await expect(lendingPool.connect(user1).pause()).to.revertedWithCustomError(
        lendingPool,
        "OwnableUnauthorizedAccount"
      );
    });

    it("Should throw error when already paused", async function () {
      const { lendingPool } = await loadFixture(deployFixture);
      await lendingPool.pause();
      await expect(lendingPool.pause()).to.revertedWithCustomError(lendingPool, "EnforcedPause");
    });

    it("Should pause successfully", async function () {
      const { lendingPool } = await loadFixture(deployFixture);
      expect(await lendingPool.paused()).to.be.false;

      await lendingPool.pause();
      expect(await lendingPool.paused()).to.be.true;
    });
  });

  describe("unpause", function () {
    it("Should throw error when caller is not owner", async function () {
      const { lendingPool, user1 } = await loadFixture(deployFixture);
      await lendingPool.pause();
      await expect(lendingPool.connect(user1).unpause()).to.revertedWithCustomError(
        lendingPool,
        "OwnableUnauthorizedAccount"
      );
    });

    it("Should throw error when paused", async function () {
      const { lendingPool } = await loadFixture(deployFixture);
      await expect(lendingPool.unpause()).to.revertedWithCustomError(lendingPool, "ExpectedPause");
    });

    it("Should unpause successfully", async function () {
      const { lendingPool } = await loadFixture(deployFixture);
      await lendingPool.pause();
      expect(await lendingPool.paused()).to.be.true;

      await lendingPool.unpause();
      expect(await lendingPool.paused()).to.be.false;
    });
  });

  describe("informDisburse", function () {
    it("Should throw error when caller is not loan", async function () {
      const { lendingPool, wXENE, user1 } = await loadFixture(deployFixture);
      await expect(lendingPool.connect(user1).informDisburse(wXENE, user1, ONE))
        .to.revertedWithCustomError(lendingPool, "PermissionUnauthorizedAccount")
        .withArgs(user1.address);
    });

    it("Should throw error when paused", async function () {
      const { lendingPool, wXENE, loan, user1 } = await loadFixture(deployFixture);
      await lendingPool.pause();
      await expect(lendingPool.connect(loan).informDisburse(wXENE, user1, ONE)).to.revertedWithCustomError(
        lendingPool,
        "EnforcedPause"
      );
    });

    it("should successfully", async function () {
      const { lendingPool, lendingStake, wXENE, loan, user1 } = await loadFixture(deployFixture);
      await expect(lendingPool.connect(loan).informDisburse(wXENE, user1.address, ONE)).to.changeTokenBalances(
        wXENE,
        [lendingPool, loan, lendingStake, user1],
        [0, 0, ONE * -1n, ONE]
      );
    });
  });

  describe("informPayBack", function () {
    it("Should throw error when caller is not loan", async function () {
      const { lendingPool, wXENE, user1 } = await loadFixture(deployFixture);
      await expect(lendingPool.connect(user1).informPayBack(wXENE, ONE))
        .to.revertedWithCustomError(lendingPool, "PermissionUnauthorizedAccount")
        .withArgs(user1.address);
    });

    it("Should throw error when paused", async function () {
      const { lendingPool, wXENE, loan } = await loadFixture(deployFixture);
      await lendingPool.pause();
      await expect(lendingPool.connect(loan).informPayBack(wXENE, ONE)).to.revertedWithCustomError(
        lendingPool,
        "EnforcedPause"
      );
    });

    it("should successfully", async function () {
      const { lendingPool, lendingStake, wXENE, loan } = await loadFixture(deployFixture);
      await wXENE.mintTo(lendingPool, { value: ONE });
      await expect(lendingPool.connect(loan).informPayBack(wXENE, ONE)).to.changeTokenBalances(
        wXENE,
        [lendingPool, loan, lendingStake],
        [ONE * -1n, 0, ONE]
      );
    });
  });

  describe("listNftToMarket", function () {
    it("Should throw error when caller is not admin", async function () {
      const { lendingPool, nft, user1 } = await loadFixture(deployFixture);
      await expect(lendingPool.connect(user1).listNftToMarket(nft, 1, ONE))
        .to.revertedWithCustomError(lendingPool, "AdminUnauthorizedAccount")
        .withArgs(user1.address);
    });

    it("Should throw error when paused", async function () {
      const { lendingPool, nft } = await loadFixture(deployFixture);
      await lendingPool.pause();
      await expect(lendingPool.listNftToMarket(nft, 1, ONE)).to.revertedWithCustomError(lendingPool, "EnforcedPause");
    });

    it("should successfully", async function () {
      const { lendingPool, nft, marketplace } = await loadFixture(deployFixture);
      await expect(lendingPool.listNftToMarket(nft, 1, ONE)).to.changeTokenBalances(
        nft,
        [lendingPool, marketplace],
        [-1, 1]
      );

      const marketItem = await marketplace.items(1);
      expect(marketItem.itemId).to.equal(1);
      expect(marketItem.nft).to.equal(nft);
      expect(marketItem.tokenId).to.equal(1);
      expect(marketItem.price).to.equal(ONE);
      expect(marketItem.seller).to.equal(lendingPool);
      expect(marketItem.status).to.equal(0); // OPENING
    });
  });

  describe("withdrawNftFromMarket", function () {
    it("Should throw error when caller is not admin", async function () {
      const { lendingPool, user1 } = await loadFixture(deployFixture);
      await expect(lendingPool.connect(user1).withdrawNftFromMarket(1))
        .to.revertedWithCustomError(lendingPool, "AdminUnauthorizedAccount")
        .withArgs(user1.address);
    });

    it("Should throw error when paused", async function () {
      const { lendingPool } = await loadFixture(deployFixture);
      await lendingPool.pause();
      await expect(lendingPool.withdrawNftFromMarket(1)).to.revertedWithCustomError(lendingPool, "EnforcedPause");
    });

    it("should successfully", async function () {
      const { lendingPool, nft, marketplace } = await loadFixture(deployFixture);
      await lendingPool.listNftToMarket(nft, 1, ONE);
      await expect(lendingPool.withdrawNftFromMarket(1)).to.changeTokenBalances(
        nft,
        [lendingPool, marketplace],
        [1, -1]
      );

      const marketItem = await marketplace.items(1);
      expect(marketItem.status).to.equal(2); // CLOSED
    });
  });

  describe("approveToPayRewards", function () {
    it("Should throw error when caller is not lendingStake", async function () {
      const { lendingPool, wXENE, user1 } = await loadFixture(deployFixture);
      await expect(lendingPool.connect(user1).approveToPayRewards(wXENE, ONE))
        .to.revertedWithCustomError(lendingPool, "PermissionUnauthorizedAccount")
        .withArgs(user1.address);
    });

    it("Should throw error when paused", async function () {
      const { lendingPool, wXENE } = await loadFixture(deployFixture);
      await lendingPool.pause();
      await expect(lendingPool.approveToPayRewards(wXENE, ONE)).to.revertedWithCustomError(
        lendingPool,
        "EnforcedPause"
      );
    });

    it("should successfully", async function () {
      const { lendingPool, wXENE, user1 } = await loadFixture(deployFixture);
      await lendingPool.setLendingStake(user1);
      await lendingPool.connect(user1).approveToPayRewards(wXENE, ONE);
      expect(await wXENE.allowance(lendingPool, user1)).to.equal(ONE);
    });
  });

  describe("rescueToken", function () {
    it("should revert when caller is not owner", async function () {
      const { lendingPool, wXENE, user1 } = await loadFixture(deployFixture);

      await expect(lendingPool.connect(user1).rescueToken(wXENE.target, user1, 1))
        .to.be.revertedWithCustomError(lendingPool, "OwnableUnauthorizedAccount")
        .withArgs(user1.address);
    });

    it("should revert when token address is zero address", async function () {
      const { lendingPool, user1 } = await loadFixture(deployFixture);

      await expect(lendingPool.rescueToken(ethers.ZeroAddress, user1, 1)).to.be.revertedWithCustomError(
        lendingPool,
        "SafeERC20FailedOperation"
      );
    });

    it("should revert when receiver address is invalid", async function () {
      const { lendingPool, wXENE } = await loadFixture(deployFixture);

      await expect(lendingPool.rescueToken(wXENE.target, ethers.ZeroAddress, 1)).to.be.revertedWithCustomError(
        lendingPool,
        "InvalidAddress"
      );
    });

    it("should rescue successfully", async function () {
      const { lendingPool, wXENE, deployer } = await loadFixture(deployFixture);
      const amount = ethers.parseEther("100");

      // Send tokens to contract
      await wXENE.mintTo(lendingPool, { value: amount });

      // Rescue tokens
      await expect(lendingPool.rescueToken(wXENE, deployer, amount)).to.changeTokenBalances(
        wXENE,
        [lendingPool, deployer],
        [-amount, amount]
      );
    });
  });

  describe("rescueNft", function () {
    it("should revert when caller is not owner", async function () {
      const { lendingPool, nft, user1 } = await loadFixture(deployFixture);

      await expect(lendingPool.connect(user1).rescueNft(nft, 1, user1))
        .to.be.revertedWithCustomError(lendingPool, "OwnableUnauthorizedAccount")
        .withArgs(user1.address);
    });

    it("should revert when nft address is zero address", async function () {
      const { lendingPool, user1 } = await loadFixture(deployFixture);

      await expect(lendingPool.rescueNft(ethers.ZeroAddress, 1, user1)).to.be.revertedWithoutReason();
    });

    it("should revert when token ID is not existed", async function () {
      const { lendingPool, nft, user1 } = await loadFixture(deployFixture);

      await expect(lendingPool.rescueNft(nft, 0, user1))
        .to.be.revertedWithCustomError(nft, "ERC721NonexistentToken")
        .withArgs(0);
    });

    it("should revert when receiver address is invalid", async function () {
      const { lendingPool, nft } = await loadFixture(deployFixture);

      await expect(lendingPool.rescueNft(nft, 1, ethers.ZeroAddress)).to.be.revertedWithCustomError(
        lendingPool,
        "InvalidAddress"
      );
    });

    it("should rescue successfully", async function () {
      const { lendingPool, nft, deployer } = await loadFixture(deployFixture);

      // Rescue tokens
      expect(await nft.ownerOf(1)).to.equal(lendingPool);
      await expect(lendingPool.rescueNft(nft, 1, deployer)).to.changeTokenBalances(
        nft,
        [lendingPool, deployer],
        [-1, 1]
      );
      expect(await nft.ownerOf(1)).to.equal(deployer.address);
    });
  });
});
