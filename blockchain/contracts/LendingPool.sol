// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./libraries/Formula.sol";
import "./interfaces/ILendingPool.sol";
import "./utils/Permission.sol";
import "./WXCRS.sol";
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
    /**
     *  @notice Other dependent contracts.
     */
    WXCR public immutable token;
    WXCRS public immutable sToken;

    /**
     *  @notice Total amount of token stake has been staked.
     */
    uint256 public totalStake;

    mapping(address => uint256) public totalStakedPerUsers;

    /**
     *  @notice Accumulated compound interest rate of everyday since the beginning.
     */
    uint256 public productOfInterestRate = Formula.ONE;

    event Stake(address indexed account, uint256 indexed amount);
    event Unstake(address indexed account, uint256 indexed amount);
    event Inflation(uint256 indexed reward);

    constructor(WXCR _token, WXCRS _sToken) {
        token = _token;
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
     *  @dev    Only admin can call this function.
     *
     *          Name    Meaning
     *  @param  _reward Amount of reward to fetch
     */
    function fetchReward(uint256 _reward) external onlyAdmin {
        // The balance of token stake of each stakeholder will increase as the accumulated interest rate increases.
        productOfInterestRate = Formula.newProductOfInterestRate(productOfInterestRate, _reward, totalStake);
        totalStake += _reward;
        emit Inflation(_reward);
    }

    /**
     *  @notice Stake token to the Lending Pool.
     *
     *          Name    Meaning
     *  @param  _amount Token amount to stake
     */
    function stake(uint256 _amount) external {
        require(_amount > 0, "LendingPool: Invalid amount");
        // Calculate and mint discount factor for the stakeholder.
        uint256 discountFactor = tokenToDiscountFactor(_amount);
        sToken.mintDiscountFactor(msg.sender, discountFactor);

        totalStakedPerUsers[msg.sender] += _amount;

        // Increase total amount of stake.
        totalStake += _amount;

        // Transfer token from address of the stakeholder to address of this contract.
        token.transferFrom(msg.sender, address(this), _amount);

        emit Stake(msg.sender, _amount);
    }

    /**
     *  @notice Unstake token stake from the Lending Pool.
     *
     *          Name    Meaning
     *  @param  _amount Token amount to unstake
     */
    function unstake(uint256 _amount) external returns (uint256) {
        require(_amount <= sToken.balanceOf(msg.sender), "LendingPool: Unstake amount exceeds the stake.");

        // Update total stake.
        totalStake -= _amount;
        totalStakedPerUsers[msg.sender] -= _amount;

        // Calculate and burn discount factor for the stakeholder.
        uint256 discountFactor = tokenToDiscountFactor(_amount);
        sToken.burnDiscountFactor(msg.sender, discountFactor);

        // Transfer token from address of this contract to address of the stakeholder.
        token.transfer(msg.sender, _amount);

        emit Unstake(msg.sender, _amount);

        // Return the token amount.
        return _amount;
    }
}
