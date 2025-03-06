// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

library TransferHelper {
    error TransferNativeFailed();

    /// @notice Transfers Native token to the recipient address
    /// @dev Fails with error `TransferNativeFailed`
    /// @param to The destination of the transfer
    /// @param value The value to be transferred
    function safeTransferNative(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}(new bytes(0));
        if (!success) {
            revert TransferNativeFailed();
        }
    }
}
