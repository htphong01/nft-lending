// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 *  @title  Lending Stake Interface
 *
 */
interface ILendingStake {
    function approve(uint256 _amount) external;
    function wXENE() external view returns (address);
}
