// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./libraries/Helper.sol";

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
        bool sold;
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
    event CancelItem(uint256 indexed itemId, address indexed nft, uint256 indexed tokenId);
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
        items[itemCount] = Item(itemCount, _nft, _tokenId, _price, _msgSender(), false);
        // emit Offered event
        emit Offered(itemCount, address(_nft), _tokenId, _price, _msgSender());
    }

    function purchaseItem(uint256 _itemId) external payable nonReentrant {
        uint256 _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
        require(!item.sold, "item already sold");
        // pay seller and feeAccount
        Helper.safeTransferNative(item.seller, item.price);
        Helper.safeTransferNative(feeAccount, _totalPrice - item.price);
        // update item to sold
        item.sold = true;
        // transfer nft to buyer
        item.nft.transferFrom(address(this), _msgSender(), item.tokenId);
        // emit Bought event
        emit Bought(_itemId, address(item.nft), item.tokenId, item.price, item.seller, _msgSender());
    }

    function cancelItem(uint256 _itemId) external {
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(_msgSender() == item.seller, "caller is not seller");
        require(!item.sold, "item already sold");
        item.sold = true;
        // transfer nft to buyer
        item.nft.transferFrom(address(this), _msgSender(), item.tokenId);
        // emit Bought event
        emit CancelItem(_itemId, address(item.nft), item.tokenId);
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

    function getTotalPrice(uint256 _itemId) public view returns (uint256) {
        return ((items[_itemId].price * (100 + feePercent)) / 100);
    }
}
