// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "./libraries/Formula.sol";
import "./utils/Permission.sol";
import "./WXCR.sol";

/**
 *  @title  Lending Pool
 *
 *  @notice This smart contract provides methods for users to stake/unstake tokens and manage the interest rate for the
 *          token Stake.
 *
 *  @dev    This contract implements interface `ILendingPool`.
 */
contract LendingPoolV2 is Permission {

    uint256 private rewardTokensPerBlock; // Number of reward tokens minted per block
    uint256 private constant REWARDS_PRECISION = 1e12; // A big number to perform mul and div operations

    // Staking user for a pool
    struct PoolStaker {
        uint256 amount; // The tokens quantity the user has staked.
        uint256 rewardDebt; // The amount relative to accumulatedRewardsPerShare the user can't get as reward
    }

    // Staking pool
    WXCR public stakeToken; // Token to be staked
    uint256 public tokensStaked; // Total tokens staked
    uint256 public totalRewardDebt;
    uint256 public lastRewardedBlock; // Last block number the user had their rewards calculated
    uint256 public accumulatedRewardsPerShare; // Accumulated rewards per share times REWARDS_PRECISION
    uint256 public totalWXCRReward;

    // Mapping staker address => PoolStaker
    mapping(address => PoolStaker) public poolStakers;

    // Events
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event ClaimRewards(address indexed user, uint256 points, uint256 reward);
    event PoolCreated(uint256 poolId);

    // Constructor
    constructor(WXCR _stakeToken, uint256 _rewardTokensPerBlock) {
        stakeToken = _stakeToken;
        rewardTokensPerBlock = _rewardTokensPerBlock;
    }

    /**
     * @dev Deposit tokens to an existing pool
     */
    function deposit(uint256 _amount) external {
        require(_amount > 0, "Deposit amount can't be zero");
        PoolStaker storage staker = poolStakers[msg.sender];

        // Update pool stakers
        claimRewards();

        // Update current staker
        staker.amount = staker.amount + _amount;
        updateRewardDebt();

        // Update pool
        tokensStaked = tokensStaked + _amount;

        // Deposit tokens
        emit Deposit(msg.sender, _amount);
        stakeToken.transferFrom(address(msg.sender), address(this), _amount);
    }

    /**
     * @dev Withdraw all tokens from an existing pool
     */
    function withdraw() external {
        PoolStaker storage staker = poolStakers[msg.sender];
        uint256 amount = staker.amount;
        require(amount > 0, "Withdraw amount can't be zero");

        // Pay rewards
        claimRewards();

        // Update staker
        staker.amount = 0;
        staker.rewardDebt = 0;

        // Update pool
        tokensStaked = tokensStaked - amount;

        // Withdraw tokens
        emit Withdraw(msg.sender, amount);
        stakeToken.transfer(address(msg.sender), amount);
    }

    /**
     * @dev Harvest user rewards from a given pool id
     */
    function claimRewards() public {
        updatePoolRewards();
        PoolStaker storage staker = poolStakers[msg.sender];

        uint256 points = ((staker.amount * accumulatedRewardsPerShare) / REWARDS_PRECISION) -
            staker.rewardDebt;
        
        uint256 totalRewardsToHarvest = ((tokensStaked * accumulatedRewardsPerShare) / REWARDS_PRECISION) -
            totalRewardDebt;

        if (points == 0) {
            updateRewardDebt();
            return;
        }
        updateRewardDebt();

        // Exchange point to xCR reward
        uint256 claimable = (points * totalWXCRReward) / totalRewardsToHarvest;
        totalWXCRReward -= claimable;
        stakeToken.transfer(address(this), claimable);

        emit ClaimRewards(msg.sender, points, claimable);
    }

    /**
     * @dev Update pool's accumulatedRewardsPerShare and lastRewardedBlock
     */
    function updatePoolRewards() private {
        if (tokensStaked == 0) {
            lastRewardedBlock = block.number;
            return;
        }
        uint256 blocksSinceLastReward = block.number - lastRewardedBlock;
        uint256 rewards = blocksSinceLastReward * rewardTokensPerBlock;
        accumulatedRewardsPerShare = accumulatedRewardsPerShare + ((rewards * REWARDS_PRECISION) / tokensStaked);
        lastRewardedBlock = block.number;
    }

    /**
     * @dev Update pool's accumulatedRewardsPerShare and lastRewardedBlock
     */
    function updateRewardDebt() private {
        PoolStaker storage staker = poolStakers[msg.sender];
        uint256 currentRewardDebt = (staker.amount * accumulatedRewardsPerShare) / REWARDS_PRECISION;
        totalRewardDebt += currentRewardDebt - staker.rewardDebt;
        staker.rewardDebt = currentRewardDebt;
    }
}
