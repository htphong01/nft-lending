// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

import {DirectLoanBaseMinimal, NFTfiSigningUtils, LoanChecksAndCalculations} from "./DirectLoanBaseMinimal.sol";

/**
 * @title  DirectLoanFixed
 * @notice Main contract for Loan Direct Loans Fixed Type. This contract manages the ability to create NFT-backed
 * peer-to-peer loans of type Fixed (agreed to be a fixed-repayment loan) where the borrower pays the
 * maximumRepaymentAmount regardless of whether they repay early or not.
 *
 * There are two ways to commence an NFT-backed loan:
 *
 * a. The borrower accepts a lender's offer by calling `acceptOffer`.
 *   1. the borrower calls nftContract.approveAll(Loan), approving the Loan contract to move their NFT's on their
 * be1alf.
 *   2. the lender calls erc20Contract.approve(Loan), allowing Loan to move the lender's ERC20 tokens on their
 * behalf.
 *   3. the lender signs an off-chain message, proposing its offer terms.
 *   4. the borrower calls `acceptOffer` to accept these terms and enter into the loan. The NFT is stored in
 * the contract, the borrower receives the loan principal in the specified ERC20 currency, the lender receives an
 * Loan promissory note (in ERC721 form) that represents the rights to either the principal-plus-interest, or the
 * underlying NFT collateral if the borrower does not pay back in time, and the borrower receives obligation receipt
 * (in ERC721 form) that gives them the right to pay back the loan and get the collateral back.
 *
 * b. The lender accepts a borrowe's binding terms by calling `acceptListing`.
 *   1. the borrower calls nftContract.approveAll(Loan), approving the Loan contract to move their NFT's on their
 * be1alf.
 *   2. the lender calls erc20Contract.approve(Loan), allowing Loan to move the lender's ERC20 tokens on their
 * behalf.
 *   3. the borrower signs an off-chain message, proposing its binding terms.
 *   4. the lender calls `acceptListing` with an offer matching the binding terms and enter into the loan. The NFT is
 * stored in the contract, the borrower receives the loan principal in the specified ERC20 currency, the lender
 * receives an Loan promissory note (in ERC721 form) that represents the rights to either the principal-plus-interest,
 * or the underlying NFT collateral if the borrower does not pay back in time, and the borrower receives obligation
 * receipt (in ERC721 form) that gives them the right to pay back the loan and get the collateral back.
 *
 * The lender can freely transfer and trade this ERC721 promissory note as they wish, with the knowledge that
 * transferring the ERC721 promissory note tranfsers the rights to principal-plus-interest and/or collateral, and that
 * they will no longer have a claim on the loan. The ERC721 promissory note itself represents that claim.
 *
 * The borrower can freely transfer and trade this ERC721 obligaiton receipt as they wish, with the knowledge that
 * transferring the ERC721 obligaiton receipt tranfsers the rights right to pay back the loan and get the collateral
 * back.
 *
 *
 * A loan may end in one of two ways:
 * - First, a borrower may call Loan.payBackLoan() and pay back the loan plus interest at any time, in which case they
 * receive their NFT back in the same transaction.
 * - Second, if the loan's duration has passed and the loan has not been paid back yet, a lender can call
 * Loan.liquidateOverdueLoan(), in which case they receive the underlying NFT collateral and forfeit the rights to the
 * principal-plus-interest, which the borrower now keeps.
 */
contract DirectLoanFixedOffer is DirectLoanBaseMinimal {
    /* *********** */
    /* CONSTRUCTOR */
    /* *********** */

    /**
     * @dev Sets `hub` and permitted erc20-s
     *
     * @param _admin - Initial admin of this contract.
     * @param  _permittedErc20s - list of permitted ERC20 token contract addresses
     */
    constructor(address _admin, address[] memory _permittedErc20s) DirectLoanBaseMinimal(_admin, _permittedErc20s) {
        // solhint-disable-previous-line no-empty-blocks
    }

    /* ********* */
    /* FUNCTIONS */
    /* ********* */

    /**
     * @notice This function is called by the borrower when accepting a lender's offer to begin a loan.
     *
     * @param _loanId - offchain id of loan
     * @param _offer - The offer made by the lender.
     * @param _signature - The components of the lender's signature.
     */
    function acceptOffer(bytes32 _loanId, Offer memory _offer, Signature memory _signature) external whenNotPaused nonReentrant {
        _loanSanityChecks(_offer);
        _loanSanityChecksOffer(_offer);

        address lender = _offer.lendingPool != address(0) ? _offer.lendingPool : _signature.signer;
        _acceptOffer(_loanId, _setupLoanTerms(_offer, lender), _offer, _signature);
    }

    /* ****************** */
    /* INTERNAL FUNCTIONS */
    /* ****************** */

    /**
     * @notice This function is called by the borrower when accepting a lender's offer to begin a loan.
     *
     * @param _loanTerms - The main Loan Terms struct. This data is saved upon loan creation on loanIdToLoan.
     * @param _offer - The offer made by the lender.
     * @param _signature - The components of the lender's signature.
     */
    function _acceptOffer(bytes32 _loanId, LoanTerms memory _loanTerms, Offer memory _offer, Signature memory _signature) internal {
        // Check loan nonces. These are different from Ethereum account nonces.
        // Here, these are uint256 numbers that should uniquely identify
        // each signature for each user (i.e. each user should only create one
        // off-chain signature for each nonce, with a nonce being any arbitrary
        // uint256 value that they have not used yet for an off-chain Loan
        // signature).
        require(!_nonceHasBeenUsedForUser[_signature.signer][_signature.nonce], "Lender nonce invalid");

        _nonceHasBeenUsedForUser[_signature.signer][_signature.nonce] = true;

        require(NFTfiSigningUtils.isValidLenderSignature(_offer, _signature), "Lender signature is invalid");

        _createLoan(_loanId, _loanTerms, msg.sender, _loanTerms.lender);

        // Emit an event with all relevant details from this transaction.
        emit LoanStarted(_loanId, msg.sender, _loanTerms.lender, _loanTerms);
    }

    /**
     * @dev Creates a `LoanTerms` struct using data sent as the lender's `_offer` on `acceptOffer`.
     * This is needed in order to avoid stack too deep issues.
     */
    function _setupLoanTerms(Offer memory _offer, address _lender) internal view returns (LoanTerms memory) {
        return
            LoanTerms({
                erc20Denomination: _offer.erc20Denomination,
                principalAmount: _offer.principalAmount,
                maximumRepaymentAmount: _offer.maximumRepaymentAmount,
                nftCollateralContract: _offer.nftCollateralContract,
                nftCollateralId: _offer.nftCollateralId,
                loanStartTime: uint64(block.timestamp),
                duration: _offer.duration,
                adminFeeInBasisPoints: _offer.adminFeeInBasisPoints,
                borrower: msg.sender,
                lender: _lender,
                useLendingPool: _offer.lendingPool != address(0)
            });
    }

    /**
     * @dev Calculates the payoff amount and admin fee
     *
     * @param _loanTerms - Struct containing all the loan's parameters
     */
    function _payoffAndFee(LoanTerms memory _loanTerms) internal pure override returns (uint256 adminFee, uint256 payoffAmount) {
        // Calculate amounts to send to lender and admins
        uint256 interestDue = _loanTerms.maximumRepaymentAmount - _loanTerms.principalAmount;
        adminFee = LoanChecksAndCalculations.computeAdminFee(interestDue, uint256(_loanTerms.adminFeeInBasisPoints));
        payoffAmount = _loanTerms.maximumRepaymentAmount - adminFee;
    }

    /**
     * @dev Function that performs some validation checks over loan parameters when accepting an offer
     *
     */
    function _loanSanityChecksOffer(Offer memory _offer) internal pure {
        require(_offer.maximumRepaymentAmount >= _offer.principalAmount, "Negative interest rate loans are not allowed.");
    }
}
