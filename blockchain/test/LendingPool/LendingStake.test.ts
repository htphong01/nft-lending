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
      await expect(lendingStake.getAddressByIndex(0)).to.be.reverted;
    });
  });

  describe("setLendingPool", function () {
    it("should revert when caller is not owner", async function () {
      const { lendingStake, user1 } = await loadFixture(deployFixture);
      const newLendingPool = ethers.Wallet.createRandom().address;

      await expect(lendingStake.connect(user1).setLendingPool(newLendingPool))
        .to.be.revertedWithCustomError(lendingStake, "OwnableUnauthorizedAccount")
        .withArgs(user1.address);
    });

    it("should revert when new address is zero", async function () {
      const { lendingStake, deployer } = await loadFixture(deployFixture);

      await expect(lendingStake.connect(deployer).setLendingPool(ethers.ZeroAddress)).to.be.revertedWithCustomError(
        lendingStake,
        "InvalidAddress"
      );
    });

    it("should set new lending pool address successfully", async function () {
      const { lendingStake, deployer } = await loadFixture(deployFixture);
      const newLendingPool = ethers.Wallet.createRandom().address;

      await lendingStake.connect(deployer).setLendingPool(newLendingPool);
      expect(await lendingStake.lendingPool()).to.equal(newLendingPool);
    });
  });

  describe("setRewardPerBlock", function () {
    it("should revert when caller is not owner", async function () {
      const { lendingStake, user1 } = await loadFixture(deployFixture);
      const newRewardPerBlock = ethers.parseEther("2");

      await expect(lendingStake.connect(user1).setRewardPerBlock(newRewardPerBlock))
        .to.be.revertedWithCustomError(lendingStake, "OwnableUnauthorizedAccount")
        .withArgs(user1.address);
    });

    it("should set new reward per block successfully", async function () {
      const { lendingStake, deployer } = await loadFixture(deployFixture);
      const newRewardPerBlock = ethers.parseEther("2");

      await lendingStake.connect(deployer).setRewardPerBlock(newRewardPerBlock);
      expect(await lendingStake.rewardPerBlock()).to.equal(newRewardPerBlock);
    });

    it("should update rewards correctly after changing reward per block", async function () {
      const { lendingStake, wXENE, deployer, user1, user2 } = await loadFixture(deployFixture);
      const depositAmount = ethers.parseEther("10");
      const newRewardPerBlock = ethers.parseEther("2");

      //================== User1 deposits tokens
      // Setup: User1 deposits tokens
      await wXENE.mintTo(user1, { value: depositAmount });
      await wXENE.connect(user1).approve(lendingStake, depositAmount);
      await lendingStake.connect(user1).deposit(depositAmount);

      // Mine some blocks
      await ethers.provider.send("hardhat_mine", ["0x5"]);

      // Change reward per block
      await lendingStake.connect(deployer).setRewardPerBlock(newRewardPerBlock);
      await ethers.provider.send("hardhat_mine", ["0x5"]);
      expect(await lendingStake.pendingReward(user1.address)).to.be.gt(0);

      //================== User2 deposits tokens
      // Setup: User1 deposits tokens
      await wXENE.mintTo(user2, { value: depositAmount });
      await wXENE.connect(user2).approve(lendingStake, depositAmount);
      await lendingStake.connect(user2).deposit(depositAmount);

      // Change reward per block
      await lendingStake.connect(deployer).setRewardPerBlock(0);

      // Mine more blocks and verify rewards are calculated with new rate
      await ethers.provider.send("hardhat_mine", ["0x5"]);
      expect(await lendingStake.pendingReward(user1.address)).to.be.gt(0);
      expect(await lendingStake.pendingReward(user2.address)).to.be.equal(0);
    });
  });

  describe("setStartBlock", function () {
    it("should revert when caller is not owner", async function () {
      const { lendingStake, user1 } = await loadFixture(deployFixture);
      await expect(lendingStake.connect(user1).setStartBlock(1000n))
        .to.be.revertedWithCustomError(lendingStake, "OwnableUnauthorizedAccount")
        .withArgs(user1.address);
    });

    it("should revert when user already staked", async function () {
      const { lendingStake, deployer, wXENE, user1 } = await loadFixture(deployFixture);
      const depositAmount = ethers.parseEther("10");
      const newStartBlock = 1000n;

      await lendingStake.connect(deployer).setStartBlock(newStartBlock);
      expect(await lendingStake.startBlock()).to.equal(newStartBlock);

      // Setup: User1 deposits tokens
      await wXENE.mintTo(user1, { value: depositAmount });
      await wXENE.connect(user1).approve(lendingStake, depositAmount);
      await lendingStake.connect(user1).deposit(depositAmount);

      await expect(lendingStake.connect(deployer).setStartBlock(newStartBlock)).to.revertedWithCustomError(
        lendingStake,
        "UserAlreadyStaked"
      );

      expect(await lendingStake.startBlock()).to.equal(newStartBlock);
    });

    it("should set new start block successfully", async function () {
      const { lendingStake, deployer } = await loadFixture(deployFixture);
      const newStartBlock = 1000n;

      await lendingStake.connect(deployer).setStartBlock(newStartBlock);
      expect(await lendingStake.startBlock()).to.equal(newStartBlock);
    });
  });

  describe("deposit", function () {
    it("should revert when amount is zero", async function () {
      const { lendingStake } = await loadFixture(deployFixture);
      await expect(lendingStake.deposit(0)).to.revertedWithCustomError(lendingStake, "AmountTooSmall");
    });

    it("should revert when paused", async function () {
      const { lendingStake } = await loadFixture(deployFixture);
      await lendingStake.pause();
      await expect(lendingStake.deposit(1)).to.revertedWithCustomError(lendingStake, "EnforcedPause");
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
      expect(await lendingStake.getAddressByIndex(0)).to.equal(user1);

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
      expect(await lendingStake.getAddressByIndex(0)).to.equal(user1);
    });
  });

  describe("withdraw", function () {
    it("should revert when paused", async function () {
      const { lendingStake } = await loadFixture(deployFixture);
      await lendingStake.pause();
      await expect(lendingStake.withdraw(1)).to.revertedWithCustomError(lendingStake, "EnforcedPause");
    });

    it("should revert when amount is zero", async function () {
      const { lendingStake } = await loadFixture(deployFixture);
      await expect(lendingStake.withdraw(0)).to.revertedWithCustomError(lendingStake, "AmountTooSmall");
    });

    it("should revert when insufficient balance", async function () {
      const { lendingStake, user1 } = await loadFixture(deployFixture);
      await expect(lendingStake.connect(user1).withdraw(100)).to.revertedWithCustomError(lendingStake, "AmountTooBig");
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
      expect(await lendingStake.getAddressByIndex(0)).to.equal(user1);

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
      await expect(lendingStake.getAddressByIndex(0)).to.be.reverted;
    });
  });

  describe("claimReward", function () {
    it("should revert when paused", async function () {
      const { lendingStake } = await loadFixture(deployFixture);
      await lendingStake.pause();
      await expect(lendingStake.claimReward()).to.revertedWithCustomError(lendingStake, "EnforcedPause");
    });

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
      expect(await lendingStake.rewardSupply()).to.equal(5000000000000000000n);

      // Claim rewards successfully
      await wXENE.mintTo(lendingPool, { value: ONE * 10n });
      await expect(lendingStake.connect(user1).claimReward()).to.changeTokenBalances(
        wXENE,
        [lendingStake, lendingPool, user1],
        [0, -7000000000000000000n, 7000000000000000000n]
      );
      pendingRewards = await lendingStake.pendingReward(user1);
      expect(pendingRewards).to.equal(0);
      expect(await lendingStake.rewardSupply()).to.equal(0);
    });
  });

  describe("rescueToken", function () {
    it("should revert when caller is not Lending Pool owner", async function () {
      const { lendingStake, wXENE, user1 } = await loadFixture(deployFixture);

      await expect(lendingStake.connect(user1).rescueToken(wXENE.target, user1))
        .to.be.revertedWithCustomError(lendingStake, "OwnableUnauthorizedAccount")
        .withArgs(user1.address);
    });

    it("should revert when token address is zero address", async function () {
      const { lendingStake, user1 } = await loadFixture(deployFixture);
      await expect(lendingStake.rescueToken(ethers.ZeroAddress, user1)).to.be.revertedWithoutReason();
    });

    it("should revert when receiver address is invalid", async function () {
      const { lendingStake, wXENE } = await loadFixture(deployFixture);

      await expect(lendingStake.rescueToken(wXENE.target, ethers.ZeroAddress)).to.be.revertedWithCustomError(
        lendingStake,
        "InvalidAddress"
      );
    });

    describe("when token is wXENE", function () {
      it("should not withdraw staked tokens", async function () {
        const { lendingStake, wXENE, deployer, user1 } = await loadFixture(deployFixture);
        const stakedAmount = ethers.parseEther("10");

        // User stakes tokens
        await wXENE.mintTo(user1, { value: stakedAmount });
        await wXENE.connect(user1).approve(lendingStake, stakedAmount);
        await lendingStake.connect(user1).deposit(stakedAmount);

        // Try to rescue tokens
        await expect(lendingStake.rescueToken(wXENE, user1)).to.changeTokenBalances(
          wXENE,
          [lendingStake, user1, deployer],
          [0, 0, 0]
        );
      });

      it("should only withdraw excess tokens", async function () {
        const { lendingStake, wXENE, deployer, user1 } = await loadFixture(deployFixture);
        const stakedAmount = ethers.parseEther("10");
        const excessAmount = ethers.parseEther("5");

        // User stakes tokens
        await wXENE.mintTo(user1, { value: stakedAmount });
        await wXENE.connect(user1).approve(lendingStake, stakedAmount);
        await lendingStake.connect(user1).deposit(stakedAmount);

        // Send excess tokens to contract
        await wXENE.mintTo(lendingStake, { value: excessAmount });

        // Rescue tokens
        await expect(lendingStake.rescueToken(wXENE, user1)).to.changeTokenBalances(
          wXENE,
          [lendingStake, user1, deployer],
          [-excessAmount, excessAmount, 0]
        );
      });
    });

    describe("when token is not wXENE", function () {
      it("should withdraw all tokens", async function () {
        const { lendingStake, deployer } = await loadFixture(deployFixture);

        // Deploy test token
        const testToken = await ethers.deployContract("WXENE");
        const amount = ethers.parseEther("100");

        // Send tokens to contract
        await testToken.mintTo(lendingStake, { value: amount });

        // Rescue tokens
        await expect(lendingStake.rescueToken(testToken, deployer)).to.changeTokenBalances(
          testToken,
          [lendingStake, deployer],
          [-amount, amount]
        );
      });
    });
  });

  describe("approve", function () {
    it("should revert when caller is not lending pool", async function () {
      const { lendingStake, user1 } = await loadFixture(deployFixture);
      const amount = ethers.parseEther("100");

      await expect(lendingStake.connect(user1).approve(amount))
        .to.be.revertedWithCustomError(lendingStake, "OnlyLendingPool")
        .withArgs(user1.address);
    });

    it("should approve successfully when called by lending pool", async function () {
      const { lendingStake, wXENE, user1 } = await loadFixture(deployFixture);
      const amount = ethers.parseEther("100");

      // Call approve from lending pool address
      await lendingStake.setLendingPool(user1.address);
      await expect(lendingStake.connect(user1).approve(amount)).to.not.be.reverted;

      // Verify approval
      expect(await wXENE.allowance(lendingStake, user1)).to.equal(amount);
    });

    it("should update allowance when called multiple times", async function () {
      const { lendingStake, wXENE, user1 } = await loadFixture(deployFixture);
      const firstAmount = ethers.parseEther("100");
      const secondAmount = ethers.parseEther("200");

      // First approval
      await lendingStake.setLendingPool(user1.address);
      await lendingStake.connect(user1).approve(firstAmount);
      expect(await wXENE.allowance(lendingStake, user1)).to.equal(firstAmount);

      // Second approval
      await lendingStake.connect(user1).approve(secondAmount);
      expect(await wXENE.allowance(lendingStake, user1)).to.equal(secondAmount);
    });
  });

  describe("pause", function () {
    it("should revert when caller is not owner", async function () {
      const { lendingStake, user1 } = await loadFixture(deployFixture);
      await expect(lendingStake.connect(user1).pause()).to.revertedWithCustomError(
        lendingStake,
        "OwnableUnauthorizedAccount"
      );
    });

    it("should revert when already paused", async function () {
      const { lendingStake } = await loadFixture(deployFixture);
      await lendingStake.pause();
      await expect(lendingStake.pause()).to.revertedWithCustomError(lendingStake, "EnforcedPause");
    });

    it("Should pause successfully", async function () {
      const { lendingStake } = await loadFixture(deployFixture);
      expect(await lendingStake.paused()).to.be.false;

      await lendingStake.pause();
      expect(await lendingStake.paused()).to.be.true;
    });
  });

  describe("unpause", function () {
    it("should revert when caller is not owner", async function () {
      const { lendingStake, user1 } = await loadFixture(deployFixture);
      await lendingStake.pause();
      await expect(lendingStake.connect(user1).unpause()).to.revertedWithCustomError(
        lendingStake,
        "OwnableUnauthorizedAccount"
      );
    });

    it("should revert when paused", async function () {
      const { lendingStake } = await loadFixture(deployFixture);
      await expect(lendingStake.unpause()).to.revertedWithCustomError(lendingStake, "ExpectedPause");
    });

    it("Should unpause successfully", async function () {
      const { lendingStake } = await loadFixture(deployFixture);
      await lendingStake.pause();
      expect(await lendingStake.paused()).to.be.true;

      await lendingStake.unpause();
      expect(await lendingStake.paused()).to.be.false;
    });
  });
});
