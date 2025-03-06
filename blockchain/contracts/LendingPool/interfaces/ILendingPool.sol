// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 *  @title  Lending Pool Interface
 *
 */
interface ILendingPool {
    function informDisburse(address _token, address _to, uint256 _amount) external;
    function informPayBack(address _token, uint256 _principal) external;
    function approveToPayRewards(address _token, uint256 _amount) external;
    function isAdmin(address _account) external view returns (bool);
    function owner() external view returns (address);
}
