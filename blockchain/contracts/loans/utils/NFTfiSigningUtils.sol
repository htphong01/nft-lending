// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

import {LoanData} from "../direct/LoanData.sol";
import {ILendingPool} from "../../LendingPool/interfaces/ILendingPool.sol";
import {SignatureChecker} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title  NFTfiSigningUtils
 * @notice Helper contract for Loan. This contract manages verifying signatures from off-chain Loan orders.
 * Based on the version of this same contract used on Loan V1
 */
library NFTfiSigningUtils {
    /* ********* */
    /* FUNCTIONS */
    /* ********* */

    /**
     * @dev This function gets the current chain ID.
     */
    function getChainID() public view returns (uint256) {
        uint256 id;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            id := chainid()
        }
        return id;
    }

    /**
     * @notice This function is when the borrower accepts a lender's offer, to validate the lender's signature that the
     * lender provided off-chain to verify that it did indeed made such offer.
     *
     * @param _offer - The offer struct containing:
     * - erc20Denomination: The address of the ERC20 contract of the currency being used as principal/interest
     * for this loan.
     * - principalAmount: The original sum of money transferred from lender to borrower at the beginning of
     * the loan, measured in erc20Denomination's smallest units.
     * - maximumRepaymentAmount: The maximum amount of money that the borrower would be required to retrieve their
     * collateral, measured in the smallest units of the ERC20 currency used for the loan. The borrower will always have
     * to pay this amount to retrieve their collateral, regardless of whether they repay early.
     * - nftCollateralContract: The address of the ERC721 contract of the NFT collateral.
     * - nftCollateralId: The ID within the NFTCollateralContract for the NFT being used as collateral for this
     * loan. The NFT is stored within this contract during the duration of the loan.
     * - referrer: The address of the referrer who found the lender matching the listing, Zero address to signal
     * this there is no referrer.
     * - duration: The amount of time (measured in seconds) that can elapse before the lender can liquidate the
     * loan and seize the underlying collateral NFT.
     * - adminFeeInBasisPoints: The percent (measured in basis points) of the interest earned that will be
     * taken as a fee by the contract admins when the loan is repaid. The fee is stored in the loan struct to prevent an
     * attack where the contract admins could adjust the fee right before a loan is repaid, and take all of the interest
     * earned.
     * @param _signature - The signature structure containing:
     * - signer: The address of the signer. The borrower for `acceptOffer` the lender for `acceptListing`.
     * - nonce: The nonce referred here is not the same as an Ethereum account's nonce.
     * We are referring instead to a nonce that is used by the lender or the borrower when they are first signing
     * off-chain Loan orders. These nonce can be any uint256 value that the user has not previously used to sign an
     * off-chain order. Each nonce can be used at most once per user within Loan, regardless of whether they are the
     * lender or the borrower in that situation. This serves two purposes:
     *   - First, it prevents replay attacks where an attacker would submit a user's off-chain order more than once.
     *   - Second, it allows a user to cancel an off-chain order by calling
     * Loan.cancelLoanCommitmentBeforeLoanHasBegun(), which marks the nonce as used and prevents any future loan from
     * using the user's off-chain order that contains that nonce.
     * - expiry: Date when the signature expires
     * - signature: The ECDSA signature of the lender, obtained off-chain ahead of time, signing the following
     * combination of parameters:
     *   - offer.erc20Denomination
     *   - offer.principalAmount
     *   - offer.maximumRepaymentAmount
     *   - offer.nftCollateralContract
     *   - offer.nftCollateralId
     *   - offer.duration
     *   - offer.adminFeeInBasisPoints
     *   - signature.signer,
     *   - signature.nonce,
     *   - signature.expiry,
     *   - address of this contract
     *   - chainId
     */
    function isValidLenderSignature(
        LoanData.Offer memory _offer,
        LoanData.Signature memory _signature
    ) external view returns (bool) {
        return isValidLenderSignature(_offer, _signature, address(this));
    }

    /**
     * @dev This function overload the previous function to allow the caller to specify the address of the contract
     *
     * @param _offer - The offer struct containing:
     * - erc20Denomination: The address of the ERC20 contract of the currency being used as principal/interest
     * for this loan.
     * - principalAmount: The original sum of money transferred from lender to borrower at the beginning of
     * the loan, measured in erc20Denomination's smallest units.
     * - maximumRepaymentAmount: The maximum amount of money that the borrower would be required to retrieve their
     * collateral, measured in the smallest units of the ERC20 currency used for the loan. The borrower will always have
     * to pay this amount to retrieve their collateral, regardless of whether they repay early.
     * - nftCollateralContract: The address of the ERC721 contract of the NFT collateral.
     * - nftCollateralId: The ID within the NFTCollateralContract for the NFT being used as collateral for this
     * loan. The NFT is stored within this contract during the duration of the loan.
     * - referrer: The address of the referrer who found the lender matching the listing, Zero address to signal
     * this there is no referrer.
     * - duration: The amount of time (measured in seconds) that can elapse before the lender can liquidate the
     * loan and seize the underlying collateral NFT.
     * - adminFeeInBasisPoints: The percent (measured in basis points) of the interest earned that will be
     * taken as a fee by the contract admins when the loan is repaid. The fee is stored in the loan struct to prevent an
     * attack where the contract admins could adjust the fee right before a loan is repaid, and take all of the interest
     * earned.
     * @param _signature - The signature structure containing:
     * - signer: The address of the signer. The borrower for `acceptOffer` the lender for `acceptListing`.
     * - nonce: The nonce referred here is not the same as an Ethereum account's nonce.
     * We are referring instead to a nonce that is used by the lender or the borrower when they are first signing
     * off-chain Loan orders. These nonce can be any uint256 value that the user has not previously used to sign an
     * off-chain order. Each nonce can be used at most once per user within Loan, regardless of whether they are the
     * lender or the borrower in that situation. This serves two purposes:
     *   - First, it prevents replay attacks where an attacker would submit a user's off-chain order more than once.
     *   - Second, it allows a user to cancel an off-chain order by calling
     * Loan.cancelLoanCommitmentBeforeLoanHasBegun(), which marks the nonce as used and prevents any future loan from
     * using the user's off-chain order that contains that nonce.
     * - expiry: Date when the signature expires
     * - signature: The ECDSA signature of the lender, obtained off-chain ahead of time, signing the following
     * combination of parameters:
     *   - offer.erc20Denomination
     *   - offer.principalAmount
     *   - offer.maximumRepaymentAmount
     *   - offer.nftCollateralContract
     *   - offer.nftCollateralId
     *   - offer.duration
     *   - offer.adminFeeInBasisPoints
     *   - signature.signer,
     *   - signature.nonce,
     *   - signature.expiry,
     *   - address of this contract
     *   - chainId
     * @param _loanContract contract address of loan
     */
    function isValidLenderSignature(
        LoanData.Offer memory _offer,
        LoanData.Signature memory _signature,
        address _loanContract
    ) public view returns (bool) {
        require(block.timestamp <= _signature.expiry, "Lender Signature has expired");
        require(_loanContract != address(0), "Loan is zero address");
        if (_signature.signer == address(0)) {
            return false;
        } else {
            if (_offer.lendingPool != address(0)) {
                require(ILendingPool(_offer.lendingPool).isAdmin(_signature.signer), "Signature signer is not admin");
            }

            bytes32 message = keccak256(
                abi.encodePacked(getEncodedOffer(_offer), getEncodedSignature(_signature), _loanContract, getChainID())
            );

            return
                SignatureChecker.isValidSignatureNow(
                    _signature.signer,
                    MessageHashUtils.toEthSignedMessageHash(message),
                    _signature.signature
                );
        }
    }

    /**
     * @notice This function is called in renegotiateLoan() to validate the lender's signature that the lender provided
     * off-chain to verify that they did indeed want to agree to this loan renegotiation according to these terms.
     *
     * @param _loanId - The unique identifier for the loan to be renegotiated
     * @param _newLoanDuration - The new amount of time (measured in seconds) that can elapse before the lender can
     * liquidate the loan and seize the underlying collateral NFT.
     * @param _newMaximumRepaymentAmount - The new maximum amount of money that the borrower would be required to
     * retrieve their collateral, measured in the smallest units of the ERC20 currency used for the loan. The
     * borrower will always have to pay this amount to retrieve their collateral, regardless of whether they repay
     * early.
     * @param _renegotiationFee Agreed upon fee in ether that borrower pays for the lender for the renegitiation
     * @param _loan The current loan data
     * @param _signature - The signature structure containing:
     * - signer: The address of the signer. The borrower for `acceptOffer` the lender for `acceptListing`.
     * - nonce: The nonce referred here is not the same as an Ethereum account's nonce.
     * We are referring instead to a nonce that is used by the lender or the borrower when they are first signing
     * off-chain Loan orders. These nonce can be any uint256 value that the user has not previously used to sign an
     * off-chain order. Each nonce can be used at most once per user within Loan, regardless of whether they are the
     * lender or the borrower in that situation. This serves two purposes:
     * - First, it prevents replay attacks where an attacker would submit a user's off-chain order more than once.
     * - Second, it allows a user to cancel an off-chain order by calling Loan.cancelLoanCommitmentBeforeLoanHasBegun()
     * , which marks the nonce as used and prevents any future loan from using the user's off-chain order that contains
     * that nonce.
     * - expiry - The date when the renegotiation offer expires
     * - lenderSignature - The ECDSA signature of the lender, obtained off-chain ahead of time, signing the
     * following combination of parameters:
     * - _loanId
     * - _newLoanDuration
     * - _newMaximumRepaymentAmount
     * - _lender
     * - _lenderNonce
     * - _expiry
     * - address of this contract
     * - chainId
     */
    function isValidLenderRenegotiationSignature(
        bytes32 _loanId,
        uint32 _newLoanDuration,
        uint256 _newMaximumRepaymentAmount,
        uint256 _renegotiationFee,
        LoanData.LoanTerms memory _loan,
        LoanData.Signature memory _signature
    ) external view returns (bool) {
        return
            isValidLenderRenegotiationSignature(
                _loanId,
                _newLoanDuration,
                _newMaximumRepaymentAmount,
                _renegotiationFee,
                _loan,
                _signature,
                address(this)
            );
    }

    /**
     * @dev This function overload the previous function to allow the caller to specify the address of the contract
     *
     * @param _loanId - The unique identifier for the loan to be renegotiated
     * @param _newLoanDuration - The new amount of time (measured in seconds) that can elapse before the lender can
     * liquidate the loan and seize the underlying collateral NFT.
     * @param _newMaximumRepaymentAmount - The new maximum amount of money that the borrower would be required to
     * retrieve their collateral, measured in the smallest units of the ERC20 currency used for the loan. The
     * borrower will always have to pay this amount to retrieve their collateral, regardless of whether they repay
     * early.
     * @param _renegotiationFee Agreed upon fee in ether that borrower pays for the lender for the renegitiation
     * @param _loan The current loan data
     * @param _signature - The signature structure containing:
     * - signer: The address of the signer. The borrower for `acceptOffer` the lender for `acceptListing`.
     * - nonce: The nonce referred here is not the same as an Ethereum account's nonce.
     * We are referring instead to a nonce that is used by the lender or the borrower when they are first signing
     * off-chain Loan orders. These nonce can be any uint256 value that the user has not previously used to sign an
     * off-chain order. Each nonce can be used at most once per user within Loan, regardless of whether they are the
     * lender or the borrower in that situation. This serves two purposes:
     * - First, it prevents replay attacks where an attacker would submit a user's off-chain order more than once.
     * - Second, it allows a user to cancel an off-chain order by calling Loan.cancelLoanCommitmentBeforeLoanHasBegun()
     * , which marks the nonce as used and prevents any future loan from using the user's off-chain order that contains
     * that nonce.
     * - expiry - The date when the renegotiation offer expires
     * - lenderSignature - The ECDSA signature of the lender, obtained off-chain ahead of time, signing the
     * following combination of parameters:
     * - _loanId
     * - _newLoanDuration
     * - _newMaximumRepaymentAmount
     * - _lender
     * - _lenderNonce
     * - _expiry
     * - address of this contract
     * - chainId
     *
     * @param _loanContract contract address of loan
     */
    function isValidLenderRenegotiationSignature(
        bytes32 _loanId,
        uint32 _newLoanDuration,
        uint256 _newMaximumRepaymentAmount,
        uint256 _renegotiationFee,
        LoanData.LoanTerms memory _loan,
        LoanData.Signature memory _signature,
        address _loanContract
    ) public view returns (bool) {
        require(block.timestamp <= _signature.expiry, "Renegotiation Signature has expired");
        require(_loanContract != address(0), "Loan is zero address");

        if (_loan.useLendingPool) {
            if (!ILendingPool(_loan.lender).isAdmin(_signature.signer)) return false;
        } else {
            if (_signature.signer != _loan.lender) return false;
        }

        bytes32 message = keccak256(
            abi.encodePacked(
                _loanId,
                _newLoanDuration,
                _newMaximumRepaymentAmount,
                _renegotiationFee,
                getEncodedSignature(_signature),
                _loanContract,
                getChainID()
            )
        );

        return
            SignatureChecker.isValidSignatureNow(
                _signature.signer,
                MessageHashUtils.toEthSignedMessageHash(message),
                _signature.signature
            );
    }

    /**
     * @dev We need this to avoid stack too deep errors.
     * @param _offer - The offer struct containing:
     * - erc20Denomination: The address of the ERC20 contract of the currency being used as principal/interest
     * for this loan.
     * - principalAmount: The original sum of money transferred from lender to borrower at the beginning of
     * the loan, measured in erc20Denomination's smallest units.
     * - maximumRepaymentAmount: The maximum amount of money that the borrower would be required to retrieve their
     * collateral, measured in the smallest units of the ERC20 currency used for the loan. The borrower will always have
     * to pay this amount to retrieve their collateral, regardless of whether they repay early.
     * - nftCollateralContract: The address of the ERC721 contract of the NFT collateral.
     * - nftCollateralId: The ID within the NFTCollateralContract for the NFT being used as collateral for this
     * loan. The NFT is stored within this contract during the duration of the loan.
     * - referrer: The address of the referrer who found the lender matching the listing, Zero address to signal
     * this there is no referrer.
     * - duration: The amount of time (measured in seconds) that can elapse before the lender can liquidate the
     * loan and seize the underlying collateral NFT.
     * - adminFeeInBasisPoints: The percent (measured in basis points) of the interest earned that will be
     * taken as a fee by the contract admins when the loan is repaid. The fee is stored in the loan struct to prevent an
     * attack where the contract admins could adjust the fee right before a loan is repaid, and take all of the interest
     * earned.
     */
    function getEncodedOffer(LoanData.Offer memory _offer) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                _offer.erc20Denomination,
                _offer.principalAmount,
                _offer.maximumRepaymentAmount,
                _offer.nftCollateralContract,
                _offer.nftCollateralId,
                _offer.duration,
                _offer.adminFeeInBasisPoints,
                _offer.lendingPool
            );
    }

    /**
     * @dev We need this to avoid stack too deep errors.
     * @param _signature - The signature structure containing:
     * - signer: The address of the signer. The borrower for `acceptOffer` the lender for `acceptListing`.
     * - nonce: The nonce referred here is not the same as an Ethereum account's nonce.
     * We are referring instead to a nonce that is used by the lender or the borrower when they are first signing
     * off-chain Loan orders. These nonce can be any uint256 value that the user has not previously used to sign an
     * off-chain order. Each nonce can be used at most once per user within Loan, regardless of whether they are the
     * lender or the borrower in that situation. This serves two purposes:
     *   - First, it prevents replay attacks where an attacker would submit a user's off-chain order more than once.
     *   - Second, it allows a user to cancel an off-chain order by calling
     * Loan.cancelLoanCommitmentBeforeLoanHasBegun(), which marks the nonce as used and prevents any future loan from
     * using the user's off-chain order that contains that nonce.
     * - expiry: Date when the signature expires
     * - signature: The ECDSA signature of the lender, obtained off-chain ahead of time, signing the following
     * combination of parameters:
     *   - offer.erc20Denomination
     *   - offer.principalAmount
     *   - offer.maximumRepaymentAmount
     *   - offer.nftCollateralContract
     *   - offer.nftCollateralId
     *   - offer.duration
     *   - offer.adminFeeInBasisPoints
     *   - signature.signer,
     *   - signature.nonce,
     *   - signature.expiry,
     *   - address of this contract
     *   - chainId
     */
    function getEncodedSignature(LoanData.Signature memory _signature) internal pure returns (bytes memory) {
        return abi.encodePacked(_signature.signer, _signature.nonce, _signature.expiry);
    }
}
