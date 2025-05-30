// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

import {IDirectLoanBase} from "./IDirectLoanBase.sol";
import {LoanData} from "./LoanData.sol";
import {LoanChecksAndCalculations} from "./LoanChecksAndCalculations.sol";
import {BaseLoan} from "../BaseLoan.sol";
import {NFTfiSigningUtils, ILendingPool} from "../utils/NFTfiSigningUtils.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title  DirectLoanBase
 * @notice Main contract for Loan Direct Loans Type. This contract manages the ability to create NFT-backed
 * peer-to-peer loans.
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
 * A loan may end in one of two ways:
 * - First, a borrower may call Loan.payBackLoan() and pay back the loan plus interest at any time, in which case they
 * receive their NFT back in the same transaction.
 * - Second, if the loan's duration has passed and the loan has not been paid back yet, a lender can call
 * Loan.liquidateOverdueLoan(), in which case they receive the underlying NFT collateral and forfeit the rights to the
 * principal-plus-interest, which the borrower now keeps.
 *
 *
 * If the loan was created as a ProRated type loan (pro-rata interest loan), then the user only pays the principal plus
 * pro-rata interest if repaid early.
 * However, if the loan was was created as a Fixed type loan (agreed to be a fixed-repayment loan), then the borrower
 * pays the maximumRepaymentAmount regardless of whether they repay early or not.
 *
 */
abstract contract DirectLoanBaseMinimal is IDirectLoanBase, BaseLoan, ERC721Holder, LoanData {
    using SafeERC20 for IERC20;

    /* ******* */
    /* STORAGE */
    /* ******* */

    uint16 public constant HUNDRED_PERCENT = 10000;

    /**
     * @notice The maximum duration of any loan started for this loan type, measured in seconds. This is both a
     * sanity-check for borrowers and an upper limit on how long admins will have to support v1 of this contract if they
     * eventually deprecate it, as well as a check to ensure that the loan duration never exceeds the space alotted for
     * it in the loan struct.
     */
    uint256 public override maximumLoanDuration = 53 weeks;

    /**
     * @notice The percentage of interest earned by lenders on this platform that is taken by the contract admin's as a
     * fee, measured in basis points (hundreths of a percent). The max allowed value is 10000.
     */
    uint16 public override adminFeeInBasisPoints = 25;

    /**
     * @notice A mapping from a loan's identifier to the loan's details, represted by the loan struct.
     */
    mapping(bytes32 => LoanTerms) public loanIdToLoan;

    /**
     * @notice A mapping tracking whether a loan has either been repaid or liquidated. This prevents an attacker trying
     * to repay or liquidate the same loan twice.
     */
    mapping(bytes32 => bool) public loanRepaidOrLiquidated;

    /**
     * @dev keeps track of tokens being held as loan collateral, so we dont allow these
     * to be transferred with the aridrop draining functions
     */
    mapping(address => mapping(uint256 => uint256)) private _escrowTokens;

    /**
     * @notice A mapping that takes both a user's address and a loan nonce that was first used when signing an off-chain
     * order and checks whether that nonce has previously either been used for a loan, or has been pre-emptively
     * cancelled. The nonce referred to here is not the same as an Ethereum account's nonce. We are referring instead to
     * nonces that are used by both the lender and the borrower when they are first signing off-chain Loan orders.
     *
     * These nonces can be any uint256 value that the user has not previously used to sign an off-chain order. Each
     * nonce can be used at most once per user within Loan, regardless of whether they are the lender or the borrower
     * in that situation. This serves two purposes. First, it prevents replay attacks where an attacker would submit a
     * user's off-chain order more than once. Second, it allows a user to cancel an off-chain order by calling
     * Loan.cancelLoanCommitmentBeforeLoanHasBegun(), which marks the nonce as used and prevents any future loan from
     * using the user's off-chain order that contains that nonce.
     */
    mapping(address => mapping(uint256 => bool)) internal _nonceHasBeenUsedForUser;

    /**
     * @notice A mapping from an ERC20 currency address to whether that currency
     * is permitted to be used by this contract.
     */
    mapping(address => bool) private erc20Permits;

    /**
     * @notice A mapping from an NFT contract's address to the Token type of that contract. A zero Token Type indicates
     * non-permitted.
     */
    mapping(address => bool) private nftPermits;

    /* ****** */
    /* EVENTS */
    /* ****** */

    /**
     * @notice This event is fired whenever the admins change the percent of interest rates earned that they charge as a
     * fee. Note that newAdminFee can never exceed 10,000, since the fee is measured in basis points.
     *
     * @param newAdminFee - The new admin fee measured in basis points. This is a percent of the interest paid upon a
     * loan's completion that go to the contract admins.
     */
    event AdminFeeUpdated(uint16 newAdminFee);

    /**
     * @notice This event is fired whenever the admins change the maximum duration of any loan started for this loan
     * type.
     *
     * @param newMaximumLoanDuration - The new maximum duration.
     */
    event MaximumLoanDurationUpdated(uint256 newMaximumLoanDuration);

    /**
     * @notice This event is fired whenever a borrower begins a loan by calling Loan.beginLoan(), which can only occur
     * after both the lender and borrower have approved their ERC721 and ERC20 contracts to use Loan, and when they
     * both have signed off-chain messages that agree on the terms of the loan.
     *
     * @param loanId - A unique identifier for this particular loan, sourced from the Loan Coordinator.
     * @param borrower - The address of the borrower.
     * @param lender - The address of the lender. The lender can change their address by transferring the Loan ERC721
     * token that they received when the loan began.
     */
    event LoanStarted(bytes32 indexed loanId, address indexed borrower, address indexed lender, LoanTerms loanTerms);

    /**
     * @notice This event is fired whenever a borrower successfully repays their loan, paying
     * principal-plus-interest-minus-fee to the lender in erc20Denomination, paying fee to owner in
     * erc20Denomination, and receiving their NFT collateral back.
     *
     * @param loanId - A unique identifier for this particular loan, sourced from the Loan Coordinator.
     * @param borrower - The address of the borrower.
     * @param lender - The address of the lender. The lender can change their address by transferring the Loan ERC721
     * token that they received when the loan began.
     * @param principalAmount - The original sum of money transferred from lender to borrower at the beginning of
     * the loan, measured in erc20Denomination's smallest units.
     * @param nftCollateralId - The ID within the NFTCollateralContract for the NFT being used as collateral for this
     * loan. The NFT is stored within this contract during the duration of the loan.
     * @param amountPaidToLender - The amount of ERC20 that the borrower paid to the lender, measured in the smalled
     * units of erc20Denomination.
     * @param adminFee - The amount of interest paid to the contract admins, measured in the smalled units of
     * erc20Denomination and determined by adminFeeInBasisPoints. This amount never exceeds the amount of interest
     * earned.
     * @param interest - The amount of interest paid to the lender.
     * @param nftCollateralContract - The ERC721 contract of the NFT collateral
     * @param erc20Denomination - The ERC20 contract of the currency being used as principal/interest for this
     * loan.
     */
    event LoanRepaid(
        bytes32 indexed loanId,
        address indexed borrower,
        address indexed lender,
        uint256 principalAmount,
        uint256 nftCollateralId,
        uint256 amountPaidToLender,
        uint256 adminFee,
        uint256 interest,
        address nftCollateralContract,
        address erc20Denomination
    );

    /**
     * @notice This event is fired whenever a lender liquidates an outstanding loan that is owned to them that has
     * exceeded its duration. The lender receives the underlying NFT collateral, and the borrower no longer needs to
     * repay the loan principal-plus-interest.
     *
     * @param loanId - A unique identifier for this particular loan, sourced from the Loan Coordinator.
     * @param borrower - The address of the borrower.
     * @param lender - The address of the lender. The lender can change their address by transferring the Loan ERC721
     * token that they received when the loan began.
     * @param principalAmount - The original sum of money transferred from lender to borrower at the beginning of
     * the loan, measured in erc20Denomination's smallest units.
     * @param nftCollateralId - The ID within the NFTCollateralContract for the NFT being used as collateral for this
     * loan. The NFT is stored within this contract during the duration of the loan.
     * @param loanMaturityDate - The unix time (measured in seconds) that the loan became due and was eligible for
     * liquidation.
     * @param loanLiquidationDate - The unix time (measured in seconds) that liquidation occurred.
     * @param nftCollateralContract - The ERC721 contract of the NFT collateral
     */
    event LoanLiquidated(
        bytes32 indexed loanId,
        address indexed borrower,
        address indexed lender,
        uint256 principalAmount,
        uint256 nftCollateralId,
        uint256 loanMaturityDate,
        uint256 loanLiquidationDate,
        address nftCollateralContract
    );

    /**
     * @notice This event is fired when some of the terms of a loan are being renegotiated.
     *
     * @param loanId - The unique identifier for the loan to be renegotiated
     * @param newLoanDuration - The new amount of time (measured in seconds) that can elapse before the lender can
     * liquidate the loan and seize the underlying collateral NFT.
     * @param newMaximumRepaymentAmount - The new maximum amount of money that the borrower would be required to
     * retrieve their collateral, measured in the smallest units of the ERC20 currency used for the loan. The
     * borrower will always have to pay this amount to retrieve their collateral, regardless of whether they repay
     * early.
     * @param renegotiationFee Agreed upon fee in loan denomination that borrower pays for the lender for the
     * renegotiation, has to be paid with an ERC20 transfer erc20Denomination token, uses transfer from,
     * frontend will have to propmt an erc20 approve for this from the borrower to the lender
     * @param renegotiationAdminFee renegotiationFee admin portion based on determined by adminFeeInBasisPoints
     */
    event LoanRenegotiated(
        bytes32 indexed loanId,
        address indexed borrower,
        address indexed lender,
        uint32 newLoanDuration,
        uint256 newMaximumRepaymentAmount,
        uint256 renegotiationFee,
        uint256 renegotiationAdminFee
    );

    /**
     * @notice This event is fired whenever the admin sets a ERC20 permit.
     *
     * @param erc20Contract - Address of the ERC20 contract.
     * @param isPermitted - Signals ERC20 permit.
     */
    event ERC20Permit(address indexed erc20Contract, bool isPermitted);

    /* *********** */
    /* CONSTRUCTOR */
    /* *********** */

    /**
     * @dev Sets `permittedNFTs`
     *
     * @param _admin - Initial admin of this contract.
     * @param  _permittedErc20s -
     */
    constructor(address _admin, address[] memory _permittedErc20s) BaseLoan(_admin) {
        for (uint256 i = 0; i < _permittedErc20s.length; i++) {
            _setERC20Permit(_permittedErc20s[i], true);
        }
    }

    /**
     * @notice This function can be called by admins to change the maximumLoanDuration. Note that they can never change
     * maximumLoanDuration to be greater than UINT32_MAX, since that's the maximum space alotted for the duration in the
     * loan struct.
     *
     * @param _newMaximumLoanDuration - The new maximum loan duration, measured in seconds.
     *
     * emit {MaximumLoanDurationUpdated} event
     */
    function updateMaximumLoanDuration(uint256 _newMaximumLoanDuration) external onlyOwner {
        require(_newMaximumLoanDuration <= uint256(type(uint32).max), "Loan duration overflow");
        maximumLoanDuration = _newMaximumLoanDuration;
        emit MaximumLoanDurationUpdated(_newMaximumLoanDuration);
    }

    /**
     * @notice This function can be called by admins to change the percent of interest rates earned that they charge as
     * a fee. Note that newAdminFee can never exceed 10,000, since the fee is measured in basis points.
     *
     * @param _newAdminFeeInBasisPoints - The new admin fee measured in basis points. This is a percent of the interest
     * paid upon a loan's completion that go to the contract admins.
     *
     * emit {AdminFeeUpdated} event
     */
    function updateAdminFee(uint16 _newAdminFeeInBasisPoints) external onlyOwner {
        require(_newAdminFeeInBasisPoints <= HUNDRED_PERCENT, "basis points > 10000");
        adminFeeInBasisPoints = _newAdminFeeInBasisPoints;
        emit AdminFeeUpdated(_newAdminFeeInBasisPoints);
    }

    /**
     * @notice used by the owner account to be able to drain ERC20 tokens received as airdrops
     * for the locked  collateral NFT-s
     * @param _tokenAddress - address of the token contract for the token to be sent out
     * @param _receiver - receiver of the token
     */
    function drainERC20Airdrop(address _tokenAddress, address _receiver) external onlyOwner {
        IERC20 tokenContract = IERC20(_tokenAddress);
        uint256 amount = tokenContract.balanceOf(address(this));
        IERC20(_tokenAddress).safeTransfer(_receiver, amount);
    }

    /**
     * @notice This function can be called by admins to change the permitted status of an ERC20 currency. This includes
     * both adding an ERC20 currency to the permitted list and removing it.
     *
     * @param _erc20 - The address of the ERC20 currency whose permit list status changed.
     * @param _permit - The new status of whether the currency is permitted or not.
     */
    function setERC20Permit(address _erc20, bool _permit) external onlyOwner {
        _setERC20Permit(_erc20, _permit);
    }

    /**
     * @notice This function changes the permitted list status of an NFT contract. This includes both adding an NFT
     * contract to the permitted list and removing it.
     * @param _nftContract - The address of the NFT contract.
     * @param _isPermitted - true - enable / false - disable
     */
    function setNFTPermit(address _nftContract, bool _isPermitted) external onlyOwner {
        require(_nftContract != address(0), "Invalid nft address");
        nftPermits[_nftContract] = _isPermitted;
    }

    /**
     * @notice used by the owner account to be able to drain ERC721 tokens received as airdrops
     * for the locked  collateral NFT-s
     * @param _tokenAddress - address of the token contract for the token to be sent out
     * @param _tokenId - id token to be sent out
     * @param _receiver - receiver of the token
     */
    function drainERC721Airdrop(address _tokenAddress, uint256 _tokenId, address _receiver) external onlyOwner {
        require(_escrowTokens[_tokenAddress][_tokenId] == 0, "token is collateral");
        IERC721(_tokenAddress).transferFrom(address(this), _receiver, _tokenId);
    }

    /**
     * @dev makes possible to change loan duration and max repayment amount, loan duration even can be extended if
     * loan was expired but not liquidated.
     *
     * @param _loanId - The unique identifier for the loan to be renegotiated
     * @param _newLoanDuration - The new amount of time (measured in seconds) that can elapse before the lender can
     * liquidate the loan and seize the underlying collateral NFT.
     * @param _newMaximumRepaymentAmount - The new maximum amount of money that the borrower would be required to
     * retrieve their collateral, measured in the smallest units of the ERC20 currency used for the loan. The
     * borrower will always have to pay this amount to retrieve their collateral, regardless of whether they repay
     * early.
     * @param _renegotiationFee Agreed upon fee in ether that borrower pays for the lender for the renegitiation
     * @param _signature - The components of the lender's signature.
     * following combination of parameters:
     * - _loanId
     * - _newLoanDuration
     * - _newMaximumRepaymentAmount
     * - _lender
     * - _expiry - The date when the renegotiation offer expires
     *  - address of this contract
     * - chainId
     */
    function renegotiateLoan(
        bytes32 _loanId,
        uint32 _newLoanDuration,
        uint256 _newMaximumRepaymentAmount,
        uint256 _renegotiationFee,
        Signature calldata _signature
    ) external whenNotPaused nonReentrant {
        _renegotiateLoan(_loanId, _newLoanDuration, _newMaximumRepaymentAmount, _renegotiationFee, _signature);
    }

    /**
     * @notice This function is called by a anyone to repay a loan. It can be called at any time after the loan has
     * begun and before loan expiry.. The caller will pay a pro-rata portion of their interest if the loan is paid off
     * early and the loan is pro-rated type, but the complete repayment amount if it is fixed type.
     * The the borrower (current owner of the obligation note) will get the collaterl NFT back.
     *
     * This function is purposefully not pausable in order to prevent an attack where the contract admin's pause the
     * contract and hold hostage the NFT's that are still within it.
     *
     * @param _loanId  A unique identifier for this particular loan, sourced from the Loan Coordinator.
     */
    function payBackLoan(bytes32 _loanId) external whenNotPaused nonReentrant {
        LoanChecksAndCalculations.payBackChecks(_loanId);
        (address borrower, address lender, LoanTerms memory loan) = _getPartiesAndData(_loanId);

        _payBackLoan(_loanId, borrower, lender, loan);

        _resolveLoan(_loanId, borrower, loan);

        // Delete the loan from storage in order to achieve a substantial gas savings and to lessen the burden of
        // storage on Ethereum nodes, since we will never access this loan's details again, and the details are still
        // available through event data.
        delete loanIdToLoan[_loanId];
    }

    /**
     * @notice This function is called by a lender once a loan has finished its duration and the borrower still has not
     * repaid. The lender can call this function to seize the underlying NFT collateral, although the lender gives up
     * all rights to the principal-plus-collateral by doing so.
     *
     * This function is purposefully not pausable in order to prevent an attack where the contract admin's pause
     * the contract and hold hostage the NFT's that are still within it.
     *
     * We intentionally allow anybody to call this function, although only the lender will end up receiving the seized
     * collateral. We are exploring the possbility of incentivizing users to call this function by using some of the
     * admin funds.
     *
     * @param _loanId  A unique identifier for this particular loan, sourced from the Loan Coordinator.
     *
     * emit {LoanLiquidated} event
     */
    function liquidateOverdueLoan(bytes32 _loanId) external whenNotPaused nonReentrant {
        // Sanity check that payBackLoan() and liquidateOverdueLoan() have never been called on this loanId.
        // Depending on how the rest of the code turns out, this check may be unnecessary.
        LoanChecksAndCalculations.checkLoanIdValidity(_loanId);

        (address borrower, address lender, LoanTerms memory loan) = _getPartiesAndData(_loanId);

        // Ensure that the loan is indeed overdue, since we can only liquidate overdue loans.
        uint256 loanMaturityDate = uint256(loan.loanStartTime) + uint256(loan.duration);
        require(block.timestamp > loanMaturityDate, "Loan is not overdue yet");

        if (loan.useLendingPool) {
            require(ILendingPool(lender).isAdmin(msg.sender), "Only Lending pool admin can liquidate");
        } else {
            require(msg.sender == lender, "Only lender can liquidate");
        }

        _resolveLoan(_loanId, lender, loan);

        // Emit an event with all relevant details from this transaction.
        emit LoanLiquidated(_loanId, borrower, lender, loan.principalAmount, loan.nftCollateralId, loanMaturityDate, block.timestamp, loan.nftCollateralContract);

        // Delete the loan from storage in order to achieve a substantial gas savings and to lessen the burden of
        // storage on Ethereum nodes, since we will never access this loan's details again, and the details are still
        // available through event data.
        delete loanIdToLoan[_loanId];
    }

    /**
     * @notice This function can be called by either a lender or a borrower to cancel all off-chain orders that they
     * have signed that contain this nonce. If the off-chain orders were created correctly, there should only be one
     * off-chain order that contains this nonce at all.
     *
     * The nonce referred to here is not the same as an Ethereum account's nonce. We are referring
     * instead to nonces that are used by both the lender and the borrower when they are first signing off-chain Loan
     * orders. These nonces can be any uint256 value that the user has not previously used to sign an off-chain order.
     * Each nonce can be used at most once per user within Loan, regardless of whether they are the lender or the
     * borrower in that situation. This serves two purposes. First, it prevents replay attacks where an attacker would
     * submit a user's off-chain order more than once. Second, it allows a user to cancel an off-chain order by calling
     * Loan.cancelLoanCommitmentBeforeLoanHasBegun(), which marks the nonce as used and prevents any future loan from
     * using the user's off-chain order that contains that nonce.
     *
     * @param _nonce - User nonce
     */
    function cancelLoanCommitmentBeforeLoanHasBegun(uint256 _nonce) external whenNotPaused {
        require(!_nonceHasBeenUsedForUser[msg.sender][_nonce], "Invalid nonce");
        _nonceHasBeenUsedForUser[msg.sender][_nonce] = true;
    }

    /* ******************* */
    /* READ-ONLY FUNCTIONS */
    /* ******************* */

    /**
     * @notice This function can be used to view whether a particular nonce for a particular user has already been used,
     * either from a successful loan or a cancelled off-chain order.
     *
     * @param _user - The address of the user. This function works for both lenders and borrowers alike.
     * @param _nonce - The nonce referred to here is not the same as an Ethereum account's nonce. We are referring
     * instead to nonces that are used by both the lender and the borrower when they are first signing off-chain
     * Loan orders. These nonces can be any uint256 value that the user has not previously used to sign an off-chain
     * order. Each nonce can be used at most once per user within Loan, regardless of whether they are the lender or
     * the borrower in that situation. This serves two purposes:
     * - First, it prevents replay attacks where an attacker would submit a user's off-chain order more than once.
     * - Second, it allows a user to cancel an off-chain order by calling Loan.cancelLoanCommitmentBeforeLoanHasBegun()
     * , which marks the nonce as used and prevents any future loan from using the user's off-chain order that contains
     * that nonce.
     *
     * @return A bool representing whether or not this nonce has been used for this user.
     */
    function getWhetherNonceHasBeenUsedForUser(address _user, uint256 _nonce) external view override returns (bool) {
        return _nonceHasBeenUsedForUser[_user][_nonce];
    }

    /**
     * @notice This function can be called by anyone to get the permit associated with the erc20 contract.
     *
     * @param _erc20 - The address of the erc20 contract.
     *
     * @return Returns whether the erc20 is permitted
     */
    function getERC20Permit(address _erc20) public view returns (bool) {
        return erc20Permits[_erc20];
    }

    /**
     * @notice This function can be called by anyone to get the permit associated with the erc20 contract.
     *
     * @param _nftContract - The address of the NFT contract.
     *
     * @return Returns whether the erc20 is permitted
     */
    function getNftPermit(address _nftContract) public view returns (bool) {
        return nftPermits[_nftContract];
    }

    /* ****************** */
    /* INTERNAL FUNCTIONS */
    /* ****************** */

    /**
     * @dev makes possible to change loan duration and max repayment amount, loan duration even can be extended if
     * loan was expired but not liquidated. IMPORTANT: Frontend will have to propt the caller to do an ERC20 approve for
     * the fee amount from themselves (borrower/obligation reciept holder) to the lender (promissory note holder)
     *
     * @param _loanId - The unique identifier for the loan to be renegotiated
     * @param _newLoanDuration - The new amount of time (measured in seconds) that can elapse before the lender can
     * liquidate the loan and seize the underlying collateral NFT.
     * @param _newMaximumRepaymentAmount - The new maximum amount of money that the borrower would be required to
     * retrieve their collateral, measured in the smallest units of the ERC20 currency used for the loan. The
     * borrower will always have to pay this amount to retrieve their collateral, regardless of whether they repay
     * early.
     * @param _renegotiationFee Agreed upon fee in loan denomination that borrower pays for the lender and
     * the admin for the renegotiation, has to be paid with an ERC20 transfer erc20Denomination token,
     * uses transfer from, frontend will have to propmt an erc20 approve for this from the borrower to the lender,
     * admin fee is calculated by the loan's adminFeeInBasisPoints value
     * @param _signature - The components of the lender's signature.
     * following combination of parameters:
     * - _loanId
     * - _newLoanDuration
     * - _newMaximumRepaymentAmount
     * - _lender
     * - _expiry - The date when the renegotiation offer expires
     * - address of this contract
     * - chainId
     * 
     * emit {LoanRenegotiated} event
     */
    function _renegotiateLoan(
        bytes32 _loanId,
        uint32 _newLoanDuration,
        uint256 _newMaximumRepaymentAmount,
        uint256 _renegotiationFee,
        Signature calldata _signature
    ) internal {
        LoanTerms storage loan = loanIdToLoan[_loanId];

        (address borrower, address lender) = LoanChecksAndCalculations.renegotiationChecks(loan, _loanId, _newLoanDuration, _newMaximumRepaymentAmount, _signature.nonce);

        _nonceHasBeenUsedForUser[lender][_signature.nonce] = true;

        require(
            NFTfiSigningUtils.isValidLenderRenegotiationSignature(
                _loanId,
                _newLoanDuration,
                _newMaximumRepaymentAmount,
                _renegotiationFee,
                loan,
                _signature
            ),
            "Renegotiation signature is invalid"
        );

        uint256 renegotiationAdminFee = 0;
        /**
         * @notice Transfers fee to the lender immediately
         * @dev implements Checks-Effects-Interactions pattern by modifying state only after
         * the transfer happened successfully, we also add the nonReentrant modifier to
         * the pbulic versions
         */
        if (_renegotiationFee > 0) {
            renegotiationAdminFee = LoanChecksAndCalculations.computeAdminFee(_renegotiationFee, loan.adminFeeInBasisPoints);
            // Transfer principal-plus-interest-minus-fees from the caller (always has to be borrower) to lender
            IERC20(loan.erc20Denomination).safeTransferFrom(borrower, lender, _renegotiationFee - renegotiationAdminFee);
            // Transfer fees from the caller (always has to be borrower) to admins
            IERC20(loan.erc20Denomination).safeTransferFrom(borrower, owner(), renegotiationAdminFee);
        }

        loan.duration = _newLoanDuration;
        loan.maximumRepaymentAmount = _newMaximumRepaymentAmount;

        emit LoanRenegotiated(_loanId, borrower, lender, _newLoanDuration, _newMaximumRepaymentAmount, _renegotiationFee, renegotiationAdminFee);
    }

    /**
     * @dev Transfer collateral NFT from borrower to this contract and principal from lender to the borrower and
     * registers the new loan through the loan coordinator.
     *
     * @param _loanTerms - Struct containing the loan's settings
     * @param _lender - The address of the lender.
     * that there is no referrer.
     */
    function _createLoan(bytes32 _loanId, LoanTerms memory _loanTerms, address _borrower, address _lender) internal {
        // Transfer collateral from borrower to this contract to be held until
        // loan completion.
        _transferNFT(_loanTerms, _borrower, address(this));

        _createLoanNoNftTransfer(_loanId, _loanTerms, _borrower, _lender);
    }

    /**
     * @dev Transfer principal from lender to the borrower and
     * registers the new loan through the loan coordinator.
     *
     * @param _loanTerms - Struct containing the loan's settings
     * @param _lender - The address of the lender.
     * that there is no referrer.
     */
    function _createLoanNoNftTransfer(bytes32 _loanId, LoanTerms memory _loanTerms, address _borrower, address _lender) internal {
        _escrowTokens[_loanTerms.nftCollateralContract][_loanTerms.nftCollateralId] += 1;

        // Transfer principal from lender to borrower.
        if (_loanTerms.useLendingPool) {
            ILendingPool(_loanTerms.lender).informDisburse(_loanTerms.erc20Denomination, _borrower, _loanTerms.principalAmount);
        } else {
            IERC20(_loanTerms.erc20Denomination).safeTransferFrom(_lender, _borrower, _loanTerms.principalAmount);
        }

        // Add the loan to storage before moving collateral/principal to follow
        // the Checks-Effects-Interactions pattern.
        loanIdToLoan[_loanId] = _loanTerms;
    }

    /**
     * @dev Transfers several types of NFTs using a wrapper that knows how to handle each case.
     *
     * @param _loanTerms - Struct containing all the loan's parameters
     * @param _sender - Current owner of the NFT
     * @param _recipient - Recipient of the transfer
     */
    function _transferNFT(LoanTerms memory _loanTerms, address _sender, address _recipient) internal {
        IERC721(_loanTerms.nftCollateralContract).safeTransferFrom(_sender, _recipient, _loanTerms.nftCollateralId, "");
    }

    /**
     * @notice This function is called by a anyone to repay a loan. It can be called at any time after the loan has
     * begun and before loan expiry.. The caller will pay a pro-rata portion of their interest if the loan is paid off
     * early and the loan is pro-rated type, but the complete repayment amount if it is fixed type.
     * The the borrower (current owner of the obligation note) will get the collaterl NFT back.
     *
     * This function is purposefully not pausable in order to prevent an attack where the contract admin's pause the
     * contract and hold hostage the NFT's that are still within it.
     *
     * @param _loanId  A unique identifier for this particular loan, sourced from the Loan Coordinator.
     *
     * emit {LoanRepaid} event
     */
    function _payBackLoan(bytes32 _loanId, address _borrower, address _lender, LoanTerms memory _loan) internal {
        (uint256 adminFee, uint256 payoffAmount) = _payoffAndFee(_loan);

        // Transfer principal-plus-interest-minus-fees from the caller to lender
        IERC20(_loan.erc20Denomination).safeTransferFrom(msg.sender, _lender, payoffAmount);
        if (_loan.useLendingPool) {
            ILendingPool(_lender).informPayBack(_loan.erc20Denomination, _loan.principalAmount);
        }

        // Transfer fees from the caller to admins
        IERC20(_loan.erc20Denomination).safeTransferFrom(msg.sender, owner(), adminFee);

        // Emit an event with all relevant details from this transaction.
        emit LoanRepaid(
            _loanId,
            _borrower,
            _lender,
            _loan.principalAmount,
            _loan.nftCollateralId,
            payoffAmount,
            adminFee,
            payoffAmount - _loan.principalAmount,
            _loan.nftCollateralContract,
            _loan.erc20Denomination
        );
    }

    /**
     * @notice A convenience function with shared functionality between `payBackLoan` and `liquidateOverdueLoan`.
     *
     * @param _loanId  A unique identifier for this particular loan, sourced from the Loan Coordinator.
     * @param _nftReceiver - The receiver of the collateral nft. The borrower when `payBackLoan` or the lender when
     * `liquidateOverdueLoan`.
     * @param _loanTerms - The main Loan Terms struct. This data is saved upon loan creation on loanIdToLoan.
     */
    function _resolveLoan(bytes32 _loanId, address _nftReceiver, LoanTerms memory _loanTerms) internal {
        _resolveLoanNoNftTransfer(_loanId, _loanTerms);
        // Transfer collateral from this contract to the lender, since the lender is seizing collateral for an overdue
        // loan

        _transferNFT(_loanTerms, address(this), _nftReceiver);
    }

    /**
     * @notice Resolving the loan without trasferring the nft to provide a base for the bundle
     * break up of the bundled loans
     *
     * @param _loanId  A unique identifier for this particular loan, sourced from the Loan Coordinator.
     * @param _loanTerms - The main Loan Terms struct. This data is saved upon loan creation on loanIdToLoan.
     */
    function _resolveLoanNoNftTransfer(bytes32 _loanId, LoanTerms memory _loanTerms) internal {
        // Mark loan as liquidated before doing any external transfers to follow the Checks-Effects-Interactions design
        // pattern
        loanRepaidOrLiquidated[_loanId] = true;

        _escrowTokens[_loanTerms.nftCollateralContract][_loanTerms.nftCollateralId] -= 1;
    }

    /**
     * @notice This function can be called by admins to change the permitted status of an ERC20 currency. This includes
     * both adding an ERC20 currency to the permitted list and removing it.
     *
     * @param _erc20 - The address of the ERC20 currency whose permit list status changed.
     * @param _permit - The new status of whether the currency is permitted or not.
     *
     * emit {ERC20Permit} event
     */
    function _setERC20Permit(address _erc20, bool _permit) internal {
        require(_erc20 != address(0), "erc20 is zero address");

        erc20Permits[_erc20] = _permit;

        emit ERC20Permit(_erc20, _permit);
    }

    /**
     * @dev Performs some validation checks over loan parameters
     *
     */
    function _loanSanityChecks(Offer memory _offer) internal view {
        require(getERC20Permit(_offer.erc20Denomination), "Currency denomination is not permitted");
        require(nftPermits[_offer.nftCollateralContract], "NFT collateral contract is not permitted");
        require(uint256(_offer.duration) <= maximumLoanDuration, "Loan duration exceeds maximum loan duration");
        require(uint256(_offer.duration) != 0, "Loan duration cannot be zero");
        require(_offer.adminFeeInBasisPoints == adminFeeInBasisPoints, "The admin fee has changed since this order was signed.");
    }

    /**
     * @dev reads some variable values of a loan for payback functions, created to reduce code repetition
     */
    function _getPartiesAndData(bytes32 _loanId) internal view returns (address borrower, address lender, LoanTerms memory loan) {
        // Fetch loan details from storage, but store them in memory for the sake of saving gas.
        loan = loanIdToLoan[_loanId];
        borrower = loan.borrower;
        lender = loan.lender;
    }

    /**
     * @dev Calculates the payoff amount and admin fee
     */
    function _payoffAndFee(LoanTerms memory _loanTerms) internal view virtual returns (uint256, uint256);

    /**
     * @dev Check valid loan ID
     */
    function isValidLoanId(bytes32 _loanId) public view returns (bool) {
        return loanIdToLoan[_loanId].borrower != address(0);
    }
}
