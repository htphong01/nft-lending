// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./libraries/Helper.sol";
import "./utils/Permission.sol";
import "./interfaces/IMarketplace.sol";

contract Marketplace is IMarketplace, Permission, ReentrancyGuard, ERC721Holder {
    using SafeERC20 for IERC20;

    address public feeReceiver;
    uint256 public feePercent;
    uint256 public itemCount;

    // Permitted payments token for marketplace
    mapping(address => bool) paymentToken;

    struct Item {
        uint256 itemId;
        address nft;
        uint256 tokenId;
        uint256 price;
        address paymentToken;
        address seller;
        address beneficiary;
        ItemStatus status;
    }

    // Market item info mapped by item id
    mapping(uint256 => Item) public items;

    event Offered(uint256 itemId, address indexed nft, uint256 tokenId, uint256 price, address paymentToken, address indexed seller, address indexed beneficiary);
    event Bought(uint256 itemId, address indexed nft, uint256 tokenId, uint256 price, address paymentToken, address indexed seller, address indexed buyer);
    event ClosedItem(uint256 indexed itemId, address indexed nft, uint256 indexed tokenId);
    event SetPaymentToken(address indexed token, bool allow);
    event SetFeeReceiver(address indexed oldValue, address indexed newValue);
    event SetFeePercent(uint256 indexed oldValue, uint256 indexed newValue);
    event WithdrawnFund(address indexed serviceFundReceiver, uint256 indexed value);

    constructor(address _feeReceiver, uint256 _feePercent) {
        feeReceiver = _feeReceiver;
        feePercent = _feePercent;

        setAdmin(_msgSender(), true);
    }

    function makeItem(address _nft, uint256 _tokenId, address _paymentToken, uint256 _price, address _beneficiary) external {
        require(_nft != address(0), "Invalid nft address");
        require(paymentToken[_paymentToken], "Not allowed payment token");
        require(_price > 0, "Price must be greater than zero");
        require(_beneficiary != address(0), "Invalid beneficiary address");

        itemCount++;
        items[itemCount] = Item(itemCount, _nft, _tokenId, _price, _paymentToken, _msgSender(), _beneficiary, ItemStatus.OPENING);

        IERC721(_nft).transferFrom(_msgSender(), address(this), _tokenId);

        emit Offered(itemCount, _nft, _tokenId, _price, _paymentToken, _msgSender(), _beneficiary);
    }

    function purchaseItem(uint256 _itemId) external payable nonReentrant {
        Item storage item = items[_itemId];
        require(item.itemId > 0, "item is not exist");
        require(item.status == ItemStatus.OPENING, "item is not opening");

        item.status = ItemStatus.SOLD;

        // transfer sold token to beneficiary address
        uint256 marketFee = (item.price * feePercent) / 10000;
        uint256 receivedAmount = item.price - marketFee;
        if (item.paymentToken == address(0)) {
            require(msg.value == item.price, "not enough balance");
            Helper.safeTransferNative(item.beneficiary, receivedAmount);
            Helper.safeTransferNative(feeReceiver, marketFee);
        } else {
            IERC20(item.paymentToken).safeTransferFrom(_msgSender(), item.beneficiary, receivedAmount);
            IERC20(item.paymentToken).safeTransferFrom(_msgSender(), feeReceiver, marketFee);
        }

        // transfer nft to buyer
        IERC721(item.nft).transferFrom(address(this), _msgSender(), item.tokenId);

        emit Bought(item.itemId, item.nft, item.tokenId, item.price, item.paymentToken, item.seller, _msgSender());
    }

    function closeItem(uint256 _itemId) external {
        Item storage item = items[_itemId];
        require(item.itemId > 0, "item doesn't exist");
        require(_msgSender() == item.seller, "caller is not seller");
        require(item.status == ItemStatus.OPENING, "item not opening");

        item.status = ItemStatus.CLOSED;

        // transfer nft to buyer
        IERC721(item.nft).transferFrom(address(this), _msgSender(), item.tokenId);

        emit ClosedItem(_itemId, address(item.nft), item.tokenId);
    }

    function setPaymentToken(address _token, bool allow) external onlyAdmin {
        paymentToken[_token] = true;
        emit SetPaymentToken(_token, allow);
    }

    function setFeeReceiver(address _newValue) external onlyAdmin {
        require(_newValue != address(0), "Invalid address");

        address oldValue = feeReceiver;
        feeReceiver = _newValue;
        emit SetFeeReceiver(oldValue, _newValue);
    }

    function setFeePercent(uint256 _newValue) external onlyAdmin {
        require(_newValue <= 10000, "Invalid fee percent");

        uint256 oldValue = feePercent;
        feePercent = _newValue;
        emit SetFeePercent(oldValue, _newValue);
    }
}
