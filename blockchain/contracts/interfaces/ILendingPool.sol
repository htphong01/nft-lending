// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

/**
 *  @title  Lending Pool Interface
 *
 *  @notice Interface of `LendingPool` to be used in `WXCRS`.
 *  @notice This interface includes functions:
 *          - Convert between discount factors and staking tokens
 */
interface ILendingPool {
    /**
     *  @notice Convert an token amount to the corresponding amount of discount factor.
     */
    function tokenToDiscountFactor(uint256 _token) external view returns (uint256);

    /**
     *  @notice Convert an amount of discount factor to the corresponding token amount.
     */
    function discountFactorToToken(uint256 _discountFactor) external view returns (uint256);
}
