// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 *  @title  Marketplace Interface
 *
 */
interface IMarketplace {
    function makeItem(address _nft, uint256 _tokenId, address _paymentToken, uint256 _price, address _beneficiary) external;
    function closeItem(uint256 _itemId) external;

    enum ItemStatus {
        OPENING,
        SOLD,
        CLOSED
    }
}
