// SPDX-License-Identifier: BUSL-1.1

import "./LoanData.sol";

pragma solidity 0.8.18;

interface IDirectLoanBase {
    function maximumLoanDuration() external view returns (uint256);

    function adminFeeInBasisPoints() external view returns (uint16);

    function loanIdToLoan(
        uint256
    )
        external
        view
        returns (uint256, uint256, uint256, address, uint32, uint16, uint16, uint64, address, address, address, bool);

    function loanRepaidOrLiquidated(uint256) external view returns (bool);

    function getWhetherNonceHasBeenUsedForUser(address _user, uint256 _nonce) external view returns (bool);

    function isValidLoanId(uint256 _loanId) external view returns (bool);
}
