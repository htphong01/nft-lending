// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./libraries/Formula.sol";
import "./interfaces/ILendingPool.sol";
import "./utils/Permission.sol";
import "./Point.sol";
import "./WXCR.sol";

/**
 *  @title  Lending Pool
 *
 *  @notice This smart contract provides methods for users to stake/unstake tokens and manage the interest rate for the
 *          token Stake.
 *
 *  @dev    This contract implements interface `ILendingPool`.
 */
contract LendingPool is ILendingPool, Permission {
    using SafeMath for uint256;

    uint256 public constant DAILY_REWARD_POINT = 100000e18;

    /**
     *  @notice Other dependent contracts.
     */
    WXCR public immutable token;
    Point public immutable point;

    /**
     *  @notice Total amount of token stake has been staked.
     */
    uint256 public totalFetchStake;

    uint256 public totalStake;

    uint256 public totalReward;

    // Staking user for a pool
    struct PoolStaker {
        uint256 amount; // The tokens quantity the user has staked.
        uint256 rewardPaid; // The reward tokens quantity the user harvested
    }

    // Mapping staker address => PoolStaker
    mapping(address => PoolStaker) public poolStakers;

    /**
     *  @notice Accumulated compound interest rate of everyday since the beginning.
     */
    uint256 public productOfInterestRate = Formula.ONE;

    event Stake(address indexed account, uint256 indexed amount);
    event Unstake(address indexed account, uint256 indexed amount);
    event Inflation(uint256 indexed reward);
    event AddedReward(uint256 indexed reward);
    event HarvestRewards(address indexed account, uint256 indexed amount);

    constructor(WXCR _token, Point _point) {
        token = _token;
        point = _point;
        point.registerLendingPool();
    }

    /**
     *  @notice Convert an token amount to the corresponding amount of discount factor.
     *
     *          Name    Meaning
     *  @param  _token  Token amount to converted
     */
    function tokenToDiscountFactor(uint256 _token) public view returns (uint256) {
        // discountFactor = token / productOfInterestRate
        return _token.div(productOfInterestRate);
    }

    /**
     *  @notice Convert an amount of discount factor to the corresponding token amount.
     *
     *          Name            Meaning
     *  @param  _discountFactor Value of discount factor to converted
     */
    function discountFactorToToken(uint256 _discountFactor) external view returns (uint256) {
        // token = truncate(discountFactor * productOfInterestRate)
        return _discountFactor.mul(productOfInterestRate);
    }

    /**
     *  @notice Fetch reward for the stakeholders before proceeding to the next day.
     *
     *  @dev    Only admin can call this function.
     */
    function fetchReward() external onlyAdmin {
        // The balance of token stake of each stakeholder will increase as the accumulated interest rate increases.
        productOfInterestRate = Formula.newProductOfInterestRate(
            productOfInterestRate,
            DAILY_REWARD_POINT,
            totalFetchStake
        );
        totalFetchStake += DAILY_REWARD_POINT;
        emit Inflation(DAILY_REWARD_POINT);
    }

    /**
     *  @notice Add reward for the stakeholders.
     *
     *  @dev    Only admin can call this function.
     *
     *          Name    Meaning
     *  @param  _reward Amount of reward to fetch
     */
    function addReward(uint256 _reward) external onlyAdmin {
        totalReward += _reward;
        token.transferFrom(msg.sender, address(this), _reward);
        emit AddedReward(_reward);
    }

    /**
     *  @notice Stake token to the Lending Pool.
     *
     *          Name    Meaning
     *  @param  _amount Token amount to stake
     */
    function stake(uint256 _amount) external {
        require(_amount > 0, "LendingPool: Invalid amount");

        PoolStaker storage staker = poolStakers[msg.sender];

        // Calculate and mint discount factor for the stakeholder.
        uint256 discountFactor = tokenToDiscountFactor(_amount);
        point.mintDiscountFactor(msg.sender, discountFactor);

        staker.amount += _amount;

        // Increase total amount of stake.
        totalStake += _amount;
        totalFetchStake += _amount;

        // Transfer token from address of the stakeholder to address of this contract.
        token.transferFrom(msg.sender, address(this), _amount);

        emit Stake(msg.sender, _amount);
    }

    /**
     * @dev Harvest user rewards
     */
    function harvestRewards(uint256 _amount) public {
        PoolStaker storage staker = poolStakers[msg.sender];
        require(
            point.balanceOf(msg.sender) - staker.amount > _amount,
            "LendingPool: Harvest amount exceeds the harvest."
        );

        uint256 rewardsToHarvest = (totalReward * _amount) / point.totalSupply();
        totalReward -= rewardsToHarvest;
        staker.rewardPaid += rewardsToHarvest;

        // Calculate and burn discount factor for the stakeholder.
        uint256 discountFactor = tokenToDiscountFactor(_amount);
        point.burnDiscountFactor(msg.sender, discountFactor);

        token.transfer(msg.sender, rewardsToHarvest);

        emit HarvestRewards(msg.sender, rewardsToHarvest);
    }

    /**
     *  @notice Unstake token stake from the Lending Pool.
     *
     */
    function unstake() external {
        PoolStaker storage staker = poolStakers[msg.sender];
        uint256 _rewardPoints = point.balanceOf(msg.sender);
        require(_rewardPoints > 0, "LendingPool: Unstake amount exceeds the stake.");

        // Update total stake.
        uint256 _amount = staker.amount;
        totalStake -= _amount;
        totalFetchStake -= _rewardPoints;
        staker.amount = 0;

        // Calculate reward
        uint256 rewardsToHarvest = (totalReward * _rewardPoints) / point.totalSupply();
        totalReward -= rewardsToHarvest;
        staker.rewardPaid += rewardsToHarvest;

        // Calculate and burn discount factor for the stakeholder.
        uint256 discountFactor = tokenToDiscountFactor(_rewardPoints);
        point.burnDiscountFactor(msg.sender, discountFactor);

        // Transfer token from address of this contract to address of the stakeholder.
        token.transfer(msg.sender, _amount + rewardsToHarvest);

        emit Unstake(msg.sender, _amount + rewardsToHarvest);
    }
}
