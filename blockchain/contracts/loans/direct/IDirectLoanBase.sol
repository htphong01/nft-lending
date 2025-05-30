// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface IDirectLoanBase {
    function maximumLoanDuration() external view returns (uint256);

    function adminFeeInBasisPoints() external view returns (uint16);

    function loanIdToLoan(
        bytes32
    )
        external
        view
        returns (
            uint256,
            uint256,
            uint256,
            address,
            uint32,
            uint16,
            uint64,
            address,
            address,
            address,
            bool
        );

    function loanRepaidOrLiquidated(bytes32) external view returns (bool);

    function getWhetherNonceHasBeenUsedForUser(address _user, uint256 _nonce) external view returns (bool);

    function isValidLoanId(bytes32 _loanId) external view returns (bool);
}
