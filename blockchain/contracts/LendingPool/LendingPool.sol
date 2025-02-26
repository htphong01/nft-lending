// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {Permission, Ownable} from "../utils/Permission.sol";
import {IMarketplace} from "../interfaces/IMarketplace.sol";
import {ILendingStake} from "../interfaces/ILendingStake.sol";

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

    error InvalidAddress();

    constructor(address _initialOwner) Ownable(_initialOwner) {}

    function setLoan(address _loan) external onlyOwner {
        if (_loan == address(0)) revert InvalidAddress();

        address _oldValue = loan;
        loan = _loan;
        emit SetLoan(_oldValue, loan);
    }

    function setLendingStake(address _lendingStake) external onlyOwner {
        if (_lendingStake == address(0)) revert InvalidAddress();

        address _oldValue = lendingStake;
        lendingStake = _lendingStake;
        emit SetLendingStake(_oldValue, lendingStake);
    }

    function setMarketplace(address _marketplace) external onlyOwner {
        if (_marketplace == address(0)) revert InvalidAddress();

        address _oldValue = marketplace;
        marketplace = _marketplace;
        emit SetMarketplace(_oldValue, marketplace);
    }

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
        IERC721(_nftContract).approve(marketplace, _nftTokenId);
        IMarketplace(marketplace).makeItem(_nftContract, _nftTokenId, ILendingStake(lendingStake).wXENE(), _price, lendingStake);
    }

    function withdrawNftFromMarket(uint256 _marketItemId) external whenNotPaused onlyAdmin {
        IMarketplace(marketplace).closeItem(_marketItemId);
    }

    function approveToPayRewards(address _token, uint256 _amount) external whenNotPaused permittedTo(lendingStake) {
        IERC20(_token).approve(lendingStake, _amount);
    }

    /**
     * @dev called by the owner to pause, triggers stopped state
     */
    function pause() external onlyOwner whenNotPaused {
        _pause();
    }

    /**
     * @dev called by the owner to unpause, returns to normal state
     */
    function unpause() external onlyOwner whenPaused {
        _unpause();
    }
}
