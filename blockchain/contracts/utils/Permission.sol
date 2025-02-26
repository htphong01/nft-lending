// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 *  @title  Permission
 *
 *  @notice This abstract contract provides a modifier to restrict the permission of functions.
 */
abstract contract Permission is Ownable {
    /* ******* */
    /* STORAGE */
    /* ******* */

    /**
     *  @notice _admins mapping from token ID to isAdmin status
     */
    mapping(address => bool) public admins;

    /* ****** */
    /* EVENTS */
    /* ****** */

    event SetAdmin(address indexed user, bool allow);

    /* ********* */
    /* MODIFIERS */
    /* ********* */

    /**
     * Throw exception of caller is not admin
     */
    modifier onlyAdmin() {
        require(owner() == _msgSender() || admins[_msgSender()], "AdminUnauthorizedAccount");
        _;
    }

    /**
     * Throw exception if _account is not permitted
     * @param _account Account will be checked
     */
    modifier permittedTo(address _account) {
        require(msg.sender == _account, "PermissionUnauthorizedAccount");
        _;
    }

    /* ****************** */
    /* PUBLIC FUNCTIONS */
    /* ****************** */

    /**
     * @notice Add/Remove an admin.
     * @dev    Only owner can call this function.
     * @param _user user address
     * @param _allow Specific user will be set as admin or not
     */
    function setAdmin(address _user, bool _allow) public virtual onlyOwner {
        _setAdmin(_user, _allow);
    }

    /**
     * @notice Add/Remove an admin.
     * @dev    Only owner can call this function.
     * @param _users List of user address
     * @param _allow Specific users will be set as admin or not
     */
    function setAdmins(address[] memory _users, bool _allow) public virtual onlyOwner {
        require(_users.length > 0, "Invalid length");
        for (uint256 i = 0; i < _users.length; i++) {
            _setAdmin(_users[i], _allow);
        }
    }

    /* ****************** */
    /* INTERNAL FUNCTIONS */
    /* ****************** */

    /**
     * @notice Add/Remove an admin.
     * @dev    Only owner can call this function.
     * @param _user User address
     * @param _allow Specific user will be set as admin or not
     *
     * emit {SetAdmin} event
     */
    function _setAdmin(address _user, bool _allow) internal virtual {
        require(_user != address(0), "Invalid address");
        admins[_user] = _allow;
        emit SetAdmin(_user, _allow);
    }

    /* ****************** */
    /* VIEW FUNCTIONS */
    /* ****************** */

    /**
     * @notice Check account whether it is the admin role.
     * @dev Everyone can call
     * @param _account User's account will be checkedd
     */
    function isAdmin(address _account) external view returns (bool) {
        return owner() == _account || admins[_account];
    }
}
