// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./libraries/Helper.sol";

enum ItemStatus {
    OPENING,
    SOLD,
    CLOSED
}

contract Marketplace is ReentrancyGuard, Ownable {
    // Variables
    address public feeAccount; // the account that receives fees
    uint256 public feePercent; // the fee percentage on sales
    uint256 public itemCount;

    struct Item {
        uint256 itemId;
        IERC721 nft;
        uint256 tokenId;
        uint256 price;
        address seller;
        ItemStatus status;
    }

    // itemId -> Item
    mapping(uint256 => Item) public items;

    event Offered(uint256 itemId, address indexed nft, uint256 tokenId, uint256 price, address indexed seller);
    event Bought(
        uint256 itemId,
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed seller,
        address indexed buyer
    );
    event CloseItem(uint256 indexed itemId, address indexed nft, uint256 indexed tokenId);
    event SetFeeAccount(address indexed oldAccount, address indexed newAccount);
    event SetFeePercent(uint256 indexed oldFee, uint256 indexed newFee);

    constructor(uint256 _feePercent) {
        feeAccount = _msgSender();
        feePercent = _feePercent;
    }

    // Make item to offer on the marketplace
    function makeItem(IERC721 _nft, uint256 _tokenId, uint256 _price) external nonReentrant {
        require(_price > 0, "Price must be greater than zero");
        // increment itemCount
        itemCount++;
        // transfer nft
        _nft.transferFrom(_msgSender(), address(this), _tokenId);
        // add new item to items mapping
        items[itemCount] = Item(itemCount, _nft, _tokenId, _price, _msgSender(), ItemStatus.OPENING);
        // emit Offered event
        emit Offered(itemCount, address(_nft), _tokenId, _price, _msgSender());
    }

    function purchaseItems(uint256[] memory _itemIds) external payable nonReentrant {
        uint256 _payable = msg.value;
        uint256 _totalMarketFee = 0;
        for (uint256 i = 0; i < _itemIds.length; ++i) {
            Item storage item = items[_itemIds[i]];
            require(item.itemId > 0, "item doesn't exist");
            require(item.status != ItemStatus.SOLD, "item already sold");
            require(item.status != ItemStatus.CLOSED, "item already closed");
            require(_payable >= item.price, "not enough ether to paid");
            // update item to sold
            uint256 marketFee = (item.price * feePercent) / 100;
            _payable -= item.price;
            _totalMarketFee += marketFee;
            item.status = ItemStatus.SOLD;
            // pay seller
            Helper.safeTransferNative(item.seller, item.price - marketFee);
            // transfer nft to buyer
            item.nft.transferFrom(address(this), _msgSender(), item.tokenId);
            // emit Bought event
            emit Bought(item.itemId, address(item.nft), item.tokenId, item.price, item.seller, _msgSender());
        }
        // pay feeAccount
        Helper.safeTransferNative(feeAccount, _totalMarketFee + _payable);
    }

    function closeItem(uint256 _itemId) external {
        Item storage item = items[_itemId];
        require(item.itemId > 0, "item doesn't exist");
        require(_msgSender() == item.seller, "caller is not seller");
        require(item.status != ItemStatus.SOLD, "item already sold");
        require(item.status != ItemStatus.CLOSED, "item already closed");
        item.status = ItemStatus.CLOSED;
        // transfer nft to buyer
        item.nft.transferFrom(address(this), _msgSender(), item.tokenId);
        // emit Bought event
        emit CloseItem(_itemId, address(item.nft), item.tokenId);
    }

    function setFeeAccount(address _newAccount) external onlyOwner {
        require(_newAccount != address(0), "newAccount is zero address");
        address oldAccount = feeAccount;
        feeAccount = _newAccount;
        emit SetFeeAccount(oldAccount, _newAccount);
    }

    function setFeePercent(uint256 _newFee) external onlyOwner {
        uint256 oldFee = feePercent;
        feePercent = _newFee;
        emit SetFeePercent(oldFee, _newFee);
    }
}
