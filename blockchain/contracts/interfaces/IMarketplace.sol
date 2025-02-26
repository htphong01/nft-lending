// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 *  @title  Marketplace Interface
 *
 */
interface IMarketplace {
    enum ItemStatus {
        OPENING,
        SOLD,
        CLOSED
    }

    function makeItem(address _nft, uint256 _tokenId, address _paymentToken, uint256 _price, address _beneficiary) external;
    function closeItem(uint256 _itemId) external;

    error InvalidFeeReceiver();
    error InvalidFeePercent();
    error InvalidNft();
    error InvalidPrice();
    error InvalidBeneficiary();
    error NotPermittedToken();
    error NotExistedItem();
    error NotOpeningItem();
    error NotEnougnETH();
    error OnlyItemOwner();
}
