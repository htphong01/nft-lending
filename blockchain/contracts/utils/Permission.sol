// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

/**
 *  @title  Permission
 *
 *  @notice This abstract contract provides a modifier to restrict the permission of functions.
 */
abstract contract Permission {
    modifier permittedTo(address _account) {
        require(msg.sender == _account, "Permission: Unauthorized.");
        _;
    }
}
