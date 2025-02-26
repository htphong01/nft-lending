import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

const FEE_PERCENTAGE = 1000n;
const ONE = ethers.parseEther("1");
const REWARD_PER_BLOCK = ethers.parseEther("1");
const START_BLOCK = 0;

describe("LendingStake", function () {
  async function deployFixture() {
    const [deployer, loan, user1, user2] = await ethers.getSigners();

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

    return { deployer, loan, user1, user2, wXENE, lendingPool, lendingStake, marketplace };
  }

  describe("Deployment", function () {
    it("should initialized successfully", async function () {
      const { lendingPool, lendingStake, wXENE, user1 } = await loadFixture(deployFixture);

      expect(await lendingStake.lendingPool()).to.equal(lendingPool);
      expect(await lendingStake.rewardPerBlock()).to.equal(REWARD_PER_BLOCK);
      expect(await lendingStake.startBlock()).to.equal(START_BLOCK);
      expect(await lendingStake.wXENE()).to.equal(wXENE);
      expect(await lendingStake.addressLength()).to.equal(0);
      expect((await lendingStake.getAllAddress()).length).to.equal(0);
      expect(await lendingStake.pendingReward(user1)).to.equal(0);
      expect(await lendingStake.rewardSupply()).to.equal(0);
    });
  });

  describe("deposit", function () {
    it("should revert when amount is zero", async function () {
      const { lendingStake } = await loadFixture(deployFixture);
      await expect(lendingStake.deposit(0)).to.be.revertedWith("amount zero");
    });

    it("should deposit successfully", async function () {
      const { lendingStake, wXENE, user1, user2 } = await loadFixture(deployFixture);
      const depositAmount = ONE * 10n;

      //=============================== User1 deposit
      // Mint and approve tokens
      await wXENE.mintTo(user1, { value: depositAmount });
      await wXENE.connect(user1).approve(lendingStake, depositAmount);

      // Perform deposit
      await expect(lendingStake.connect(user1).deposit(depositAmount)).to.changeTokenBalances(
        wXENE,
        [user1, lendingStake],
        [-depositAmount, depositAmount]
      );

      // Verify state changes
      let userInfo = await lendingStake.userInfo(user1);
      expect(userInfo.amount).to.equal(depositAmount);
      expect(userInfo.rewardDebt).to.equal(0);
      expect(userInfo.rewardPending).to.equal(0);

      let poolInfo = await lendingStake.poolInfo();
      expect(poolInfo.stakedSupply).to.equal(depositAmount);
      expect(poolInfo.totalPendingReward).to.equal(0);

      expect(await lendingStake.addressLength()).to.equal(1);
      expect(await lendingStake.getAllAddress()).to.deep.equal([user1.address]);
      expect(await lendingStake.pendingReward(user1)).to.equal(0);
      expect(await lendingStake.rewardSupply()).to.equal(0);

      //=============================== User2 deposit
      // Mint and approve tokens
      await wXENE.mintTo(user2, { value: depositAmount });
      await wXENE.connect(user2).approve(lendingStake, depositAmount);

      // Perform deposit
      await expect(lendingStake.connect(user2).deposit(depositAmount)).to.changeTokenBalances(
        wXENE,
        [user2, lendingStake],
        [-depositAmount, depositAmount]
      );

      // Verify state changes
      userInfo = await lendingStake.userInfo(user2);
      expect(userInfo.amount).to.equal(depositAmount);
      expect(userInfo.rewardDebt).to.equal(3000000000000000000n);
      expect(userInfo.rewardPending).to.equal(0);

      poolInfo = await lendingStake.poolInfo();
      expect(poolInfo.stakedSupply).to.equal(depositAmount * 2n);
      expect(poolInfo.totalPendingReward).to.equal(3000000000000000000n);

      expect(await lendingStake.addressLength()).to.equal(2);
      expect(await lendingStake.getAllAddress()).to.deep.equal([user1.address, user2.address]);
      expect(await lendingStake.pendingReward(user2)).to.equal(0);
      expect(await lendingStake.rewardSupply()).to.equal(3000000000000000000n);

      //=============================== User1 continue to deposit
      // Mint and approve tokens
      await wXENE.mintTo(user1, { value: depositAmount });
      await wXENE.connect(user1).approve(lendingStake, depositAmount);

      // Perform deposit
      await expect(lendingStake.connect(user1).deposit(depositAmount)).to.changeTokenBalances(
        wXENE,
        [user1, lendingStake],
        [-depositAmount, depositAmount]
      );

      // Verify state changes
      userInfo = await lendingStake.userInfo(user1);
      expect(userInfo.amount).to.equal(depositAmount * 2n);
      expect(userInfo.rewardDebt).to.equal(9000000000000000000n);
      expect(userInfo.rewardPending).to.equal(4500000000000000000n);

      poolInfo = await lendingStake.poolInfo();
      expect(poolInfo.stakedSupply).to.equal(depositAmount * 3n);
      expect(poolInfo.totalPendingReward).to.equal(6000000000000000000n);

      expect(await lendingStake.addressLength()).to.equal(2);
      expect(await lendingStake.getAllAddress()).to.deep.equal([user1.address, user2.address]);
      expect(await lendingStake.pendingReward(user1)).to.equal(4500000000000000000n);
      expect(await lendingStake.rewardSupply()).to.equal(6000000000000000000n);
    });
  });

  describe("withdraw", function () {
    it("should revert when amount is zero", async function () {
      const { lendingStake } = await loadFixture(deployFixture);
      await expect(lendingStake.withdraw(0)).to.be.revertedWith("amount zero");
    });

    it("should revert when insufficient balance", async function () {
      const { lendingStake, user1 } = await loadFixture(deployFixture);
      await expect(lendingStake.connect(user1).withdraw(100)).to.be.revertedWith("withdraw: not enough");
    });

    it("should withdraw successfully", async function () {
      const { lendingStake, wXENE, user1 } = await loadFixture(deployFixture);
      const depositAmount = ethers.parseEther("10");
      const withdrawAmount = ethers.parseEther("5");

      // Setup: deposit first
      await wXENE.mintTo(user1, { value: depositAmount });
      await wXENE.connect(user1).approve(lendingStake, depositAmount);
      await lendingStake.connect(user1).deposit(depositAmount);

      //======================= Withdraw an haft of the deposit
      await expect(lendingStake.connect(user1).withdraw(withdrawAmount)).to.changeTokenBalances(
        wXENE,
        [lendingStake, user1],
        [-withdrawAmount, withdrawAmount]
      );

      // Verify state changes
      let userInfo = await lendingStake.userInfo(user1);
      expect(userInfo.amount).to.equal(depositAmount - withdrawAmount);
      expect(userInfo.rewardDebt).to.equal(500000000000000000n);
      expect(userInfo.rewardPending).to.equal(1000000000000000000n);

      let poolInfo = await lendingStake.poolInfo();
      expect(poolInfo.stakedSupply).to.equal(depositAmount - withdrawAmount);
      expect(poolInfo.totalPendingReward).to.equal(1000000000000000000n);

      expect(await lendingStake.addressLength()).to.equal(1);
      expect(await lendingStake.getAllAddress()).to.deep.equal([user1.address]);
      expect(await lendingStake.pendingReward(user1)).to.equal(1000000000000000000n);
      expect(await lendingStake.rewardSupply()).to.equal(1000000000000000000n);

      //======================= Withdraw all remaining
      await expect(lendingStake.connect(user1).withdraw(withdrawAmount)).to.changeTokenBalances(
        wXENE,
        [lendingStake, user1],
        [-withdrawAmount, withdrawAmount]
      );

      // Verify state changes
      userInfo = await lendingStake.userInfo(user1);
      expect(userInfo.amount).to.equal(0);
      expect(userInfo.rewardDebt).to.equal(0);
      expect(userInfo.rewardPending).to.equal(2000000000000000000n);

      poolInfo = await lendingStake.poolInfo();
      expect(poolInfo.stakedSupply).to.equal(0);
      expect(poolInfo.totalPendingReward).to.equal(2000000000000000000n);

      expect(await lendingStake.addressLength()).to.equal(0);
      expect(await lendingStake.getAllAddress()).to.deep.equal([]);
      expect(await lendingStake.pendingReward(user1)).to.equal(2000000000000000000n);
      expect(await lendingStake.rewardSupply()).to.equal(2000000000000000000n);
    });
  });

  describe("claimReward", function () {
    it("should revert when lending pool balance is zero", async function () {
      const { lendingStake, wXENE, user1 } = await loadFixture(deployFixture);
      const depositAmount = ethers.parseEther("10");

      // Setup: deposit and mine some blocks
      await wXENE.mintTo(user1, { value: depositAmount });
      await wXENE.connect(user1).approve(lendingStake, depositAmount);
      await lendingStake.connect(user1).deposit(depositAmount);

      // Mine blocks to accumulate rewards
      await ethers.provider.send("hardhat_mine", ["0x5"]);

      // Check pending rewards
      let pendingRewards = await lendingStake.pendingReward(user1);
      expect(pendingRewards).to.be.gt(0);

      // Claim rewards FAILED cause lending pool balance is ZERO
      await expect(lendingStake.connect(user1).claimReward()).to.revertedWithCustomError(
        lendingStake,
        "RewardBalanceTooSmall"
      );
    });

    it("should claim rewards successfully", async function () {
      const { lendingStake, wXENE, lendingPool, user1 } = await loadFixture(deployFixture);
      const depositAmount = ethers.parseEther("10");

      // Setup: deposit and mine some blocks
      await wXENE.mintTo(user1, { value: depositAmount });
      await wXENE.connect(user1).approve(lendingStake, depositAmount);
      await lendingStake.connect(user1).deposit(depositAmount);

      // Mine blocks to accumulate rewards
      await ethers.provider.send("hardhat_mine", ["0x5"]);

      // Check pending rewards
      let pendingRewards = await lendingStake.pendingReward(user1);
      expect(pendingRewards).to.be.gt(0);

      // Claim rewards successfully
      await wXENE.mintTo(lendingPool, { value: ONE * 10n });
      await expect(lendingStake.connect(user1).claimReward()).to.changeTokenBalances(
        wXENE,
        [lendingStake, lendingPool, user1],
        [0, -7000000000000000000n, 7000000000000000000n]
      );
      pendingRewards = await lendingStake.pendingReward(user1);
      expect(pendingRewards).to.equal(0);
    });
  });

  describe("EmergencyWithdraw", function () {
    it("should emergency withdraw successfully", async function () {
      const { lendingStake, wXENE, user1 } = await loadFixture(deployFixture);
      const depositAmount = ethers.parseEther("10");

      // Setup: deposit first
      await wXENE.mintTo(user1, { value: depositAmount });
      await wXENE.connect(user1).approve(lendingStake, depositAmount);
      await lendingStake.connect(user1).deposit(depositAmount);

      // Perform emergency withdrawal
      await expect(lendingStake.connect(user1).emergencyWithdraw()).to.changeTokenBalances(
        wXENE,
        [lendingStake, user1],
        [-depositAmount, depositAmount]
      );

      // Verify state changes
      const userInfo = await lendingStake.userInfo(user1);
      expect(userInfo.amount).to.equal(0);
      expect(userInfo.rewardDebt).to.equal(0);
      expect(userInfo.rewardPending).to.equal(0);
      expect(await wXENE.balanceOf(user1)).to.equal(depositAmount);
    });
  });
});
