// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 *  @title  Permission
 *
 *  @notice This abstract contract provides a modifier to restrict the permission of functions.
 */
abstract contract Permission is Ownable {
    /**
     *  @notice _admins mapping from token ID to isAdmin status
     */
    mapping(address => bool) public admins;

    event SetAdmin(address indexed user, bool allow);

    constructor() {}

    modifier onlyAdmin() {
        require(owner() == _msgSender() || admins[_msgSender()], "Ownable: caller is not an admin");
        _;
    }

    modifier notZeroAddress(address _addr) {
        require(_addr != address(0), "Invalid address");
        _;
    }

    modifier notZeroAmount(uint256 _amount) {
        require(_amount > 0, "Invalid amount");
        _;
    }

    /**
     *  @notice Replace the admin role by another address.
     *
     *  @dev    Only owner can call this function.
     */
    function setAdmin(address _user, bool _allow) public virtual onlyOwner {
        _setAdmin(_user, _allow);
    }

    /**
     *  @notice Replace the admin role by another address.
     *
     *  @dev    Only owner can call this function.
     */
    function setAdmins(address[] memory _users, bool _allow) public virtual onlyOwner {
        require(_users.length > 0, "Invalid length");
        for (uint256 i = 0; i < _users.length; i++) {
            _setAdmin(_users[i], _allow);
        }
    }

    function _setAdmin(address _user, bool _allow) internal virtual notZeroAddress(_user) {
        admins[_user] = _allow;
        emit SetAdmin(_user, _allow);
    }

    /**
     *  @notice Check account whether it is the admin role.
     */
    function isAdmin(address _account) external view returns (bool) {
        return admins[_account];
    }

    modifier permittedTo(address _account) {
        require(msg.sender == _account, "Permission: Unauthorized.");
        _;
    }
}
