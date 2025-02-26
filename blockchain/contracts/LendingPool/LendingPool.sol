// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

import "../utils/Permission.sol";
import "../interfaces/ILendingPool.sol";
import "../interfaces/IMarketplace.sol";
import "../interfaces/ILendingStake.sol";

/**
 * @title  LendingPool
 * @dev    A main management contract for lending pool.
 */
contract LendingPool is Permission, Pausable, ReentrancyGuard, ERC721Holder {
    using SafeERC20 for IERC20;

    address public loan;
    address public lendingStake;
    address public marketplace;

    event SetLoan(address indexed oldValue, address indexed newValue);
    event SetLendingStake(address indexed oldValue, address indexed newValue);
    event SetMarketplace(address indexed oldValue, address indexed newValue);
    event Disbursed(address indexed token, address indexed to, uint256 amount);
    event PaidBack(address indexed token, uint256 amount);
    event ListNftToMarket(address indexed nftContract, uint256 indexed nftTokenId, uint256 indexed price);

    function setLoan(address _loan) external onlyOwner {
        require(_loan != address(0), "Invalid address");

        address _oldValue = loan;
        loan = _loan;
        emit SetLoan(_oldValue, loan);
    }

    function setLendingStake(address _lendingStake) external onlyOwner {
        require(_lendingStake != address(0), "Invalid address");

        address _oldValue = lendingStake;
        lendingStake = _lendingStake;
        emit SetLendingStake(_oldValue, lendingStake);
    }

    function setMarketplace(address _marketplace) external onlyOwner {
        require(_marketplace != address(0), "Invalid address");

        address _oldValue = marketplace;
        marketplace = _marketplace;
        emit SetMarketplace(_oldValue, marketplace);
    }

    /* ********* */
    /* FUNCTIONS */
    /* ********* */

    function informDisburse(address _token, address _to, uint256 _amount) external nonReentrant whenNotPaused permittedTo(loan) {
        ILendingStake(lendingStake).approve(_amount);
        IERC20(_token).safeTransferFrom(lendingStake, _to, _amount);
        emit Disbursed(_token, _to, _amount);
    }

    function informPayBack(address _token, uint256 _principal) external whenNotPaused permittedTo(loan) {
        IERC20(_token).safeTransfer(lendingStake, _principal);
        emit PaidBack(_token, _principal);
    }

    function listNftToMarket(address _nftContract, uint256 _nftTokenId, uint256 _price) external whenNotPaused onlyAdmin {
        IMarketplace(marketplace).makeItem(_nftContract, _nftTokenId, ILendingStake(lendingStake).wXENE(), _price, lendingStake);
    }

    function closeNftFromMarket(uint256 _marketItemId) external whenNotPaused onlyAdmin {
        IMarketplace(marketplace).closeItem(_marketItemId);
    }

    function approveToPayRewards(address _token, uint256 _amount) external whenNotPaused permittedTo(lendingStake) {
        IERC20(_token).approve(lendingStake, _amount);
    }

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - Only the owner can call this method.
     * - The contract must not be paused.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - Only the owner can call this method.
     * - The contract must be paused.
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
