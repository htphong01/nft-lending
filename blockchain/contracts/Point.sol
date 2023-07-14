// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./interfaces/ILendingPool.sol";
import "./utils/Permission.sol";

/**
 *  @title  Token Stake
 *
 *  @notice Token stake is fully conformed to the ERC-20 with the remarkable feature of globally inflating the balance of
 *          each token owner.
 *
 *  @dev    This contract derives from the implementation of ERC-20 of OpenZeppelin.
 */
contract Point is ERC20, Permission {
    ILendingPool public lendingPool;

    /**
     *  @notice The significant intrinsic value of each address represents its stake in the whole circulating supply of
     *          the token. The distribution of token balances among addresses are proportional to their discount
     *          factors. The ratio between the discount factor and the real balance is the accumulated of the interest
     *          rate from the Staking Pool.
     */
    mapping(address => uint256) public discountFactors;

    /**
     *  @notice Total minted discount factor.
     */
    uint256 public totalDiscountFactor;

    event LendingPoolRegistration(address indexed account);
    event LendingPoolUpgrade(address indexed oldAddress, address indexed newAddress);
    event DiscountFactorTransfer(address indexed from, address indexed to, uint256 value);
    event DiscountFactorMint(address indexed account, uint256 value);
    event DiscountFactorBurn(address indexed account, uint256 value);

    /**
     *  @dev    Apply the constructor of the superclass contract `ERC20`.
     *          Name:     "Reward Point"
     *          Symbol:   "RP"
     */
    constructor() ERC20("Reward Point", "RP") {}

    /**
     *  @notice Register a lendingPool for some restricted function.
     *
     *  @dev    This can only be called once.
     */
    function registerLendingPool() external {
        require(address(lendingPool) == address(0), "TokenStake: Staking Pool has already been registered.");
        lendingPool = ILendingPool(msg.sender);
        emit LendingPoolRegistration(address(lendingPool));
    }

    /**
     *  @dev    ERC-20: `totalSupply()`
     *  @dev    The result is calculated from `totalDiscountFactor`.
     */
    function totalSupply() public view virtual override returns (uint256) {
        return lendingPool.discountFactorToToken(totalDiscountFactor);
    }

    /**
     *  @dev    ERC-20: `balanceOf(address)`
     *  @dev    The result is calculated from `discountFactors`.
     */
    function balanceOf(address _account) public view override returns (uint256) {
        return lendingPool.discountFactorToToken(discountFactors[_account]);
    }

    /**
     *  @dev    ERC-20: `transfer(address, uint256)`
     *  @dev    This function actually transfers the `discountFactors`.
     */
    function transfer(address _recipient, uint256 _amount) public override returns (bool) {
        uint256 discountFactor = lendingPool.tokenToDiscountFactor(_amount);
        _transfer(msg.sender, _recipient, discountFactor);
        emit Transfer(msg.sender, _recipient, _amount);

        return true;
    }

    /**
     *  @dev    ERC-20: `transferFrom(address, address, uint256)`
     *  @dev    This function actually transfers the `discountFactors`.
     */
    function transferFrom(address _sender, address _recipient, uint256 _amount) public override returns (bool) {
        uint256 currentAllowance = allowance(_sender, _recipient);
        require(currentAllowance >= _amount, "TokenStake: Transfer amount exceeds allowance.");

        // Already check overflow
        unchecked {
            _approve(_sender, msg.sender, currentAllowance - _amount);
        }

        uint256 discountFactor = lendingPool.tokenToDiscountFactor(_amount);
        _transfer(_sender, _recipient, discountFactor);

        emit Transfer(_sender, _recipient, _amount);

        return true;
    }

    /**
     *  @notice Transfer discount factor from an address to another.
     *
     *          Name            Meaning
     *  @param  _sender         Sending address
     *  @param  _recipient      Receiving address
     *  @param  _discountFactor Transfer discount factor value
     */
    function _transfer(address _sender, address _recipient, uint256 _discountFactor) internal override {
        require(_sender != address(0), "TokenStake: Transfer from the zero address.");
        require(_recipient != address(0), "TokenStake: Transfer to the zero address.");

        uint256 senderDiscountFactor = discountFactors[_sender];
        require(senderDiscountFactor >= _discountFactor, "TokenStake: Transfer amount exceeds balance.");

        discountFactors[_sender] = discountFactors[_sender] - _discountFactor;
        discountFactors[_recipient] = discountFactors[_recipient] + _discountFactor;

        emit DiscountFactorTransfer(_sender, _recipient, _discountFactor);
    }

    /**
     *  @notice Mint discount factor to an account.
     *
     *  @dev    Only the Staking Pool can call this function.
     *
     *          Name            Meaning
     *  @param  _account        Address of the account that needs to mint token
     *  @param  _discountFactor Discount factor value to mint
     */
    function mintDiscountFactor(address _account, uint256 _discountFactor) public permittedTo(address(lendingPool)) {
        require(_account != address(0), "TokenStake: Mint to the zero address");

        discountFactors[_account] = discountFactors[_account] + _discountFactor;
        totalDiscountFactor = totalDiscountFactor + _discountFactor;

        emit DiscountFactorMint(_account, _discountFactor);
    }

    /**
     *  @notice Burn discount factor from an account.
     *
     *  @dev    Only the Staking Pool can call this function.
     *
     *          Name            Meaning
     *  @param  _account        Address of the account that needs to burn token
     *  @param  _discountFactor Discount factor value to to burn
     */
    function burnDiscountFactor(address _account, uint256 _discountFactor) public permittedTo(address(lendingPool)) {
        require(_account != address(0), "TokenStake: Burn from the zero address.");
        require(discountFactors[_account] >= _discountFactor, "TokenStake: Transfer amount exceeds balance.");

        discountFactors[_account] = discountFactors[_account] - _discountFactor;
        totalDiscountFactor = totalDiscountFactor - _discountFactor;

        emit DiscountFactorBurn(_account, _discountFactor);
    }
}
