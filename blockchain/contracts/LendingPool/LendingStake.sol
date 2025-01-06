// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "../utils/Permission.sol";
import "../interfaces/ILendingPool.sol";

contract LendingStake is Permission {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using EnumerableSet for EnumerableSet.AddressSet;

    uint256 private constant REWARDS_PRECISION = 1e12; // A big number to perform mul and div operations

    // Info of each user.
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
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated.
    }

    // Info of Pool
    struct PoolInfo {
        uint256 lastRewardBlock; // Last block number that Rewards distribution occurs.
        uint256 accRewardPerShare; // Accumulated reward per share, times 1e12. See below.
        uint256 stakedSupply;
        uint256 totalPendingReward;
    }

    IERC20 public wXENE;
    address public lendingPool;

    // rewards created per block.
    uint256 public rewardPerBlock;

    // Pool Info.
    PoolInfo public poolInfo;

    // Info of each user that stakes wXENE tokens.
    mapping(address => UserInfo) public userInfo;

    // addresses list
    EnumerableSet.AddressSet private addressList;

    // The block number when mining starts.
    uint256 public startBlock;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event ClaimReward(address indexed user, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 amount);

    constructor(IERC20 _wXENE, address _lendingPool, uint256 _rewardPerBlock, uint256 _startBlock) {
        wXENE = _wXENE;
        lendingPool = _lendingPool;
        rewardPerBlock = _rewardPerBlock;
        startBlock = _startBlock;

        // Initial staking pool information
        poolInfo = PoolInfo({
            lastRewardBlock: startBlock,
            accRewardPerShare: 0,
            stakedSupply: 0,
            totalPendingReward: 0
        });
    }

    function addressLength() external view returns (uint256) {
        return addressList.length();
    }

    /**
     *  @notice Get address by index
     *
     *  @dev    All caller can call this function.
     */
    function getAddressByIndex(uint256 _index) external view returns (address) {
        return addressList.at(_index);
    }

    /**
     *  @notice Get all address
     *
     *  @dev    All caller can call this function.
     */
    function getAllAddress() external view returns (address[] memory) {
        return addressList.values();
    }

    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(uint256 _from, uint256 _to) internal pure returns (uint256) {
        return _to.sub(_from);
    }

    // View function to see pending Tokens on frontend.
    function pendingReward(address _user) external view returns (uint256) {
        PoolInfo storage pool = poolInfo;
        UserInfo storage user = userInfo[_user];
        uint256 accRewardPerShare = pool.accRewardPerShare;
        uint256 stakedSupply = poolInfo.stakedSupply;
        if (block.number > pool.lastRewardBlock && stakedSupply != 0) {
            uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
            uint256 tokenReward = multiplier.mul(rewardPerBlock);

            accRewardPerShare = accRewardPerShare.add(tokenReward.mul(REWARDS_PRECISION).div(stakedSupply));
        }
        return user.amount.mul(accRewardPerShare).div(REWARDS_PRECISION).sub(user.rewardDebt).add(user.rewardPending);
    }

    function rewardSupply() external view returns (uint256) {
        PoolInfo storage pool = poolInfo;

        uint256 tokenReward = 0;
        if (block.number > pool.lastRewardBlock && poolInfo.stakedSupply != 0) {
            uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
            tokenReward = multiplier.mul(rewardPerBlock);
        }

        return poolInfo.totalPendingReward.add(tokenReward);
    }

    // Update reward variables of the given pool to be up-to-date.
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
        uint256 tokenReward = multiplier.mul(rewardPerBlock);

        poolInfo.totalPendingReward = poolInfo.totalPendingReward.add(tokenReward);
        poolInfo.accRewardPerShare = poolInfo.accRewardPerShare.add(
            tokenReward.mul(REWARDS_PRECISION).div(wXENESupply)
        );
        poolInfo.lastRewardBlock = block.number;
    }

    // Deposit wXENE tokens to Lending Pool for Reward allocation.
    function deposit(uint256 _amount) external {
        require(_amount > 0, "amount zero");
        UserInfo storage user = userInfo[msg.sender];
        updatePool();
        wXENE.safeTransferFrom(address(msg.sender), address(this), _amount);
        // The deposit behavior before farming will result in duplicate addresses, and thus we will manually remove them when airdropping.
        if (user.amount == 0 && user.rewardPending == 0 && user.rewardDebt == 0) {
            addressList.add(address(msg.sender));
        }
        user.rewardPending = user
            .amount
            .mul(poolInfo.accRewardPerShare)
            .div(REWARDS_PRECISION)
            .sub(user.rewardDebt)
            .add(user.rewardPending);
        user.amount = user.amount.add(_amount);
        user.rewardDebt = user.amount.mul(poolInfo.accRewardPerShare).div(REWARDS_PRECISION);

        poolInfo.stakedSupply = poolInfo.stakedSupply.add(_amount);

        emit Deposit(msg.sender, _amount);
    }

    // Withdraw staked wXENE tokens from Pool.
    function withdraw(uint256 _amount) external {
        require(_amount > 0, "amount zero");
        UserInfo storage user = userInfo[msg.sender];
        require(user.amount >= _amount, "withdraw: not enough");

        updatePool();
        wXENE.safeTransfer(address(msg.sender), _amount);

        user.rewardPending = user
            .amount
            .mul(poolInfo.accRewardPerShare)
            .div(REWARDS_PRECISION)
            .sub(user.rewardDebt)
            .add(user.rewardPending);
        user.amount = user.amount.sub(_amount);
        user.rewardDebt = user.amount.mul(poolInfo.accRewardPerShare).div(REWARDS_PRECISION);

        poolInfo.stakedSupply = poolInfo.stakedSupply.sub(_amount);
        addressList.remove(address(msg.sender));

        emit Withdraw(msg.sender, _amount);
    }

    // Claim reward from Pool.
    function claimReward() public {
        UserInfo storage user = userInfo[msg.sender];

        updatePool();

        uint256 _amount = user.amount.mul(poolInfo.accRewardPerShare).div(REWARDS_PRECISION).sub(user.rewardDebt).add(
            user.rewardPending
        );
        user.rewardPending = 0;
        user.rewardDebt = user.amount.mul(poolInfo.accRewardPerShare).div(REWARDS_PRECISION);

        uint256 _totalPendingReward = poolInfo.totalPendingReward;
        poolInfo.totalPendingReward = _totalPendingReward.sub(_amount);

        // Exchange point to XENE reward
        uint256 _claimable = (_amount * wXENE.balanceOf(lendingPool)) / _totalPendingReward;

        ILendingPool(lendingPool).approveToPayRewards(address(wXENE), _claimable);
        wXENE.safeTransferFrom(lendingPool, msg.sender, _claimable);

        emit ClaimReward(msg.sender, _amount);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw() external {
        UserInfo storage user = userInfo[msg.sender];
        wXENE.safeTransfer(address(msg.sender), user.amount);
        emit EmergencyWithdraw(msg.sender, user.amount);
        user.amount = 0;
        user.rewardDebt = 0;
        user.rewardPending = 0;
    }

    function approve(uint256 _amount) external permittedTo(lendingPool) {
        wXENE.approve(lendingPool, _amount);
    }
}
