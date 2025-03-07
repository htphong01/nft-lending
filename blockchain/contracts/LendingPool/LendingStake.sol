// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Pausable, Context} from "@openzeppelin/contracts/utils/Pausable.sol";
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {ILendingPool} from "./interfaces/ILendingPool.sol";

contract LendingStake is Context, Pausable, ReentrancyGuard {
    using Math for uint256;
    using SafeERC20 for IERC20;
    using EnumerableSet for EnumerableSet.AddressSet;

    // A big number to perform mul and div operations
    uint256 private constant REWARDS_PRECISION = 1e12;

    // Infomation of each user.
    struct UserInfo {
        uint256 amount; // How many wXENE tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        uint256 rewardPending;
        //
        // We do some fancy math here. Basically, any point in time, the amount of wXENE
        // entitled to a user but is pending to be distributed is:
        //
        //   pending reward = (user.amount * pool.accRewardPerShare) - user.rewardDebt + user.rewardPending
        //
        // Whenever a user deposits or withdraws wXENE tokens to a pool. Here's what happens:
        //   1. The pool's `accRewardPerShare` (and `lastRewardBlock`) gets updated.
        //   2. User receives the pending reward sent to his/her address.
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated.
    }

    // Staking Pool information
    struct PoolInfo {
        uint256 lastRewardBlock; // Last block number that Rewards distribution occurs.
        uint256 accRewardPerShare; // Accumulated reward per share, times 1e12. See below.
        uint256 stakedSupply;
        uint256 totalPendingReward;
    }
    PoolInfo public poolInfo;

    // The stake token
    IERC20 public immutable wXENE;

    // The lending pool contract address
    address public lendingPool;

    // The block number when mining starts
    uint256 public startBlock;

    // Rewards created per block.
    uint256 public rewardPerBlock;

    // Infomation of each staker
    mapping(address => UserInfo) public userInfo;

    // Addresses list of all stakers
    EnumerableSet.AddressSet private addressList;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event ClaimReward(address indexed user, uint256 amount);

    error OwnableUnauthorizedAccount(address account);
    error OnlyLendingPool(address account);
    error RewardBalanceTooSmall();
    error AmountTooSmall();
    error AmountTooBig();
    error InvalidAddress();
    error UserAlreadyStaked();

    modifier onlyOwner() {
        if (ILendingPool(lendingPool).owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
        _;
    }

    constructor(IERC20 _wXENE, address _lendingPool, uint256 _rewardPerBlock, uint256 _startBlock) {
        wXENE = _wXENE;
        lendingPool = _lendingPool;
        rewardPerBlock = _rewardPerBlock;
        startBlock = _startBlock;

        // Initial staking pool information
        poolInfo = PoolInfo({lastRewardBlock: _startBlock, accRewardPerShare: 0, stakedSupply: 0, totalPendingReward: 0});
    }

    /**
     * @dev Get number of staker
     */
    function addressLength() external view returns (uint256) {
        return addressList.length();
    }

    /**
     * @dev Get a staked address by index
     */
    function getAddressByIndex(uint256 _index) external view returns (address) {
        return addressList.at(_index);
    }

    /**
     * @dev Get all staked addresses
     */
    function getAllAddress() external view returns (address[] memory) {
        return addressList.values();
    }

    /**
     * @dev Get current pending rewards of given user
     */
    function pendingReward(address _user) external view returns (uint256) {
        uint256 accRewardPerShare = poolInfo.accRewardPerShare;
        uint256 stakedSupply = poolInfo.stakedSupply;
        if (block.number > poolInfo.lastRewardBlock && stakedSupply != 0) {
            uint256 multiplier = getMultiplier(poolInfo.lastRewardBlock, block.number);
            uint256 tokenReward = multiplier * rewardPerBlock;

            accRewardPerShare = accRewardPerShare + tokenReward.mulDiv(REWARDS_PRECISION, stakedSupply);
        }

        UserInfo memory user = userInfo[_user];
        return user.amount.mulDiv(accRewardPerShare, REWARDS_PRECISION) - user.rewardDebt + user.rewardPending;
    }

    /**
     * @dev Get current reward supply
     */
    function rewardSupply() external view returns (uint256) {
        if (block.number > poolInfo.lastRewardBlock && poolInfo.stakedSupply != 0) {
            uint256 multiplier = getMultiplier(poolInfo.lastRewardBlock, block.number);
            return poolInfo.totalPendingReward + (multiplier * rewardPerBlock);
        }

        return poolInfo.totalPendingReward;
    }

    /**
     * @dev called by anyone to update reward variables of the given pool to be up-to-date
     */
    function updatePool() public {
        if (block.number <= poolInfo.lastRewardBlock) {
            return;
        }
        uint256 wXENESupply = poolInfo.stakedSupply;
        if (wXENESupply == 0) {
            poolInfo.lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = getMultiplier(poolInfo.lastRewardBlock, block.number);
        uint256 tokenReward = multiplier * rewardPerBlock;

        poolInfo.totalPendingReward = poolInfo.totalPendingReward + tokenReward;
        poolInfo.accRewardPerShare = poolInfo.accRewardPerShare + tokenReward.mulDiv(REWARDS_PRECISION, wXENESupply);
        poolInfo.lastRewardBlock = block.number;
    }

    /**
     * @dev called by users to deposit wXENE tokens
     */
    function deposit(uint256 _amount) external whenNotPaused {
        if (_amount == 0) revert AmountTooSmall();

        updatePool();
        wXENE.safeTransferFrom(_msgSender(), address(this), _amount);

        UserInfo storage user = userInfo[_msgSender()];
        if (user.amount == 0 && user.rewardPending == 0 && user.rewardDebt == 0) {
            addressList.add(_msgSender());
        }

        user.rewardPending = user.amount.mulDiv(poolInfo.accRewardPerShare, REWARDS_PRECISION) - user.rewardDebt + user.rewardPending;
        user.amount = user.amount + _amount;
        user.rewardDebt = user.amount.mulDiv(poolInfo.accRewardPerShare, REWARDS_PRECISION);

        poolInfo.stakedSupply = poolInfo.stakedSupply + _amount;

        emit Deposit(_msgSender(), _amount);
    }

    /**
     * @dev called by staked users to withdraw staked wXENE tokens
     */
    function withdraw(uint256 _amount) external nonReentrant whenNotPaused {
        if (_amount == 0) revert AmountTooSmall();

        UserInfo storage user = userInfo[_msgSender()];
        if (user.amount < _amount) revert AmountTooBig();

        updatePool();

        user.rewardPending = user.amount.mulDiv(poolInfo.accRewardPerShare, REWARDS_PRECISION) - user.rewardDebt + user.rewardPending;
        user.amount = user.amount - _amount;
        user.rewardDebt = user.amount.mulDiv(poolInfo.accRewardPerShare, REWARDS_PRECISION);

        poolInfo.stakedSupply = poolInfo.stakedSupply - _amount;

        if (user.amount == 0) {
            addressList.remove(_msgSender());
        }

        wXENE.safeTransfer(_msgSender(), _amount);

        emit Withdraw(_msgSender(), _amount);
    }

    /**
     * @dev called by staked users to claim rewards from lending pool
     */
    function claimReward() external nonReentrant whenNotPaused {
        UserInfo storage user = userInfo[_msgSender()];

        updatePool();

        uint256 _currentRewardDebt = user.amount.mulDiv(poolInfo.accRewardPerShare, REWARDS_PRECISION);
        uint256 _amount = _currentRewardDebt - user.rewardDebt + user.rewardPending;
        if (_amount > wXENE.balanceOf(lendingPool)) {
            revert RewardBalanceTooSmall();
        }

        user.rewardPending = 0;
        user.rewardDebt = _currentRewardDebt;
        poolInfo.totalPendingReward -= _amount;

        ILendingPool(lendingPool).approveToPayRewards(address(wXENE), _amount);
        wXENE.safeTransferFrom(lendingPool, _msgSender(), _amount);

        emit ClaimReward(_msgSender(), _amount);
    }

    /**
     * @dev Get the multiplier between two blocks
     */
    function getMultiplier(uint256 _from, uint256 _to) private pure returns (uint256) {
        unchecked {
            return _to - _from;
        }
    }

    /**
     * @dev called by lending pool to approve tokens for disbursement
     */
    function approve(uint256 _amount) external {
        if (_msgSender() != lendingPool) revert OnlyLendingPool(_msgSender());
        wXENE.approve(lendingPool, _amount);
    }

    /**
     * @dev called by the owner to rescue tokens
     */
    function rescueToken(address _token, address _to) external onlyOwner {
        if (_to == address(0)) revert InvalidAddress();
        uint256 _withdrawable = IERC20(_token).balanceOf(address(this));

        // Protect the staked wXENE from being withdrawn
        if (_token == address(wXENE)) {
            _withdrawable = _withdrawable > poolInfo.stakedSupply ? _withdrawable - poolInfo.stakedSupply : 0;
        }

        IERC20(_token).safeTransfer(_to, _withdrawable);
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

    /**
     * @dev called by the owner to set lending pool address
     */
    function setLendingPool(address _lendingPool) external onlyOwner {
        if (_lendingPool == address(0)) revert InvalidAddress();
        lendingPool = _lendingPool;
    }

    /**
     * @dev called by the owner to set reward per block
     */
    function setRewardPerBlock(uint256 _rewardPerBlock) external onlyOwner {
        rewardPerBlock = _rewardPerBlock;
    }

    /**
     * @dev called by the owner to set start block
     */
    function setStartBlock(uint256 _startBlock) external onlyOwner {
        if (poolInfo.stakedSupply != 0) revert UserAlreadyStaked();
        startBlock = _startBlock;
        poolInfo.lastRewardBlock = _startBlock;
    }
}
