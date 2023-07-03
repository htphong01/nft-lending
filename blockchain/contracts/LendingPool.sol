// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./libraries/Formula.sol";
import "./libraries/Helper.sol";
import "./interfaces/ILendingPool.sol";
import "./utils/Permission.sol";
import "./TokenS420.sol";

/**
 *  @title  Lending Pool
 *
 *  @notice This smart contract provides methods for users to stake/unstake tokens and manage the interest rate for the
 *          token s420.
 *
 *  @dev    This contract implements interface `ILendingPool`.
 */
contract LendingPool is ILendingPool, Permission {
    using SafeMath for uint256;
    /**
     *  @notice Other dependent contracts in the DAO.
     */
    TokenS420 public immutable sToken;

    /**
     *  @notice Total amount of token 420 has been staked.
     */
    uint256 public totalStake;

    /**
     *  @notice Accumulated compound interest rate of everyday since the beginning of the DAO.
     */
    uint256 public productOfInterestRate = Formula.ONE;

    event DaoManagerRegistration(address indexed account);
    event Stake(address indexed account, uint256 indexed amount);
    event Unstake(address indexed account, uint256 indexed amount);
    event Inflation(uint256 indexed reward);
    event Upgrade(address indexed oldAddress, address indexed newAddress, uint256 indexed tokenBalance);

    constructor(TokenS420 _sToken) {
        sToken = _sToken;
        sToken.registerLendingPool();
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
     *  @notice Check if there is less than one token in the Lending Pool. If it is the case, no Lending reward will be
     *          issued, the charged fee is also cleared.
     */
    function isLendingTooSmall() public view returns (bool) {
        // TOKEN_SCALE displays 1 token
        return (sToken.totalSupply() < Formula.ONE);
    }

    /**
     *  @notice Fetch reward for the stakeholders before proceeding to the next day.
     *
     *  @dev    Only the DAO Manager can call this function.
     *
     *          Name    Meaning
     *  @param  _reward Amount of reward to fetch
     */
    function fetchReward(uint256 _reward) external {
        // The balance of token s420 of each stakeholder will increase as the accumulated interest rate increases.
        productOfInterestRate = Formula.newProductOfInterestRate(productOfInterestRate, _reward, totalStake);
        totalStake += _reward;
        emit Inflation(_reward);
    }

    /**
     *  @notice Stake token 420 to the Lending Pool.
     *
     *  @dev    Users must `approve` enough token 420 for this contract before calling this function.
     *
     *          Name    Meaning
     *  @param  _amount Token amount to stake
     */
    function stake(uint256 _amount) external payable {
        // Calculate and mint discount factor for the stakeholder.
        uint256 discountFactor = tokenToDiscountFactor(_amount);
        sToken.mintDiscountFactor(msg.sender, discountFactor);

        // Increase total amount of stake.
        totalStake += _amount;

        // Transfer token 420 from address of the stakeholder to address of this contract.
        Helper.safeTransferNative(address(this), _amount);

        emit Stake(msg.sender, _amount);
    }

    /**
     *  @notice Unstake token s420 from the Lending Pool.
     *
     *          Name    Meaning
     *  @param  _amount Token amount to unstake
     */
    function unstake(uint256 _amount) external returns (uint256) {
        require(_amount <= sToken.balanceOf(msg.sender), "LendingPool: Unstake amount exceeds the stake.");

        uint256 rewardPerUser = _amount.mul(address(this).balance).div(sToken.balanceOf(msg.sender));

        // Update total stake.
        totalStake -= _amount;

        // Calculate and burn discount factor for the stakeholder.
        uint256 discountFactor = tokenToDiscountFactor(_amount);
        sToken.burnDiscountFactor(msg.sender, discountFactor);

        // Transfer token s420 from address of this contract to address of the stakeholder.
        Helper.safeTransferNative(msg.sender, _amount.add(rewardPerUser));

        emit Unstake(msg.sender, _amount);

        // Return the token amount.
        return _amount.add(rewardPerUser);
    }
}
