// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {TransferHelper} from "../utils/TransferHelper.sol";
import {Permission, Ownable} from "../utils/Permission.sol";
import {IMarketplace} from "./IMarketplace.sol";

contract Marketplace is IMarketplace, Permission, ReentrancyGuard, ERC721Holder {
    using SafeERC20 for IERC20;

    address public feeReceiver;
    uint256 public feePercent;
    uint256 public itemCount;

    // Permitted payments token for marketplace
    mapping(address => bool) public paymentToken;

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

    event MakeItem(uint256 indexed itemId, Item item);
    event BoughtItem(uint256 indexed itemId, address indexed buyer);
    event ClosedItem(uint256 indexed itemId);
    event SetPaymentToken(address indexed token, bool allow);
    event SetFeeReceiver(address indexed oldValue, address indexed newValue);
    event SetFeePercent(uint256 indexed oldValue, uint256 indexed newValue);

    constructor(address _initialOwner, address _feeReceiver, uint256 _feePercent) Ownable(_initialOwner) {
        feeReceiver = _feeReceiver;
        feePercent = _feePercent;
    }

    function makeItem(address _nft, uint256 _tokenId, address _paymentToken, uint256 _price, address _beneficiary) external {
        if (_nft == address(0)) revert InvalidNft();
        if (!paymentToken[_paymentToken]) revert NotPermittedToken();
        if (_price == 0) revert InvalidPrice();
        if (_beneficiary == address(0)) revert InvalidBeneficiary();

        itemCount++;
        items[itemCount] = Item(itemCount, _nft, _tokenId, _price, _paymentToken, _msgSender(), _beneficiary, ItemStatus.OPENING);

        IERC721(_nft).transferFrom(_msgSender(), address(this), _tokenId);

        emit MakeItem(itemCount, items[itemCount]);
    }

    function purchaseItem(uint256 _itemId) external payable nonReentrant {
        Item storage item = items[_itemId];
        if (item.itemId == 0) revert NotExistedItem();
        if (item.status != ItemStatus.OPENING) revert NotOpeningItem();

        item.status = ItemStatus.SOLD;

        // transfer sold token to beneficiary address
        uint256 marketFee = (item.price * feePercent) / 10000;
        uint256 receivedAmount = item.price - marketFee;
        if (item.paymentToken == address(0)) {
            if (msg.value != item.price) revert NotEnougnETH();
            if (marketFee > 0) {
                TransferHelper.safeTransferNative(feeReceiver, marketFee);
            }
            TransferHelper.safeTransferNative(item.beneficiary, receivedAmount);
        } else {
            if (marketFee > 0) {
                IERC20(item.paymentToken).safeTransferFrom(_msgSender(), feeReceiver, marketFee);
            }
            IERC20(item.paymentToken).safeTransferFrom(_msgSender(), item.beneficiary, receivedAmount);
        }

        // transfer nft to buyer
        IERC721(item.nft).transferFrom(address(this), _msgSender(), item.tokenId);

        emit BoughtItem(item.itemId, _msgSender());
    }

    function closeItem(uint256 _itemId) external {
        Item storage item = items[_itemId];
        if (item.itemId == 0) revert NotExistedItem();
        if (item.status != ItemStatus.OPENING) revert NotOpeningItem();
        if (item.seller != _msgSender()) revert OnlyItemOwner();

        item.status = ItemStatus.CLOSED;

        // transfer nft to buyer
        IERC721(item.nft).transferFrom(address(this), _msgSender(), item.tokenId);

        emit ClosedItem(_itemId);
    }

    function setPaymentToken(address _token, bool allow) external onlyAdmin {
        paymentToken[_token] = allow;
        emit SetPaymentToken(_token, allow);
    }

    function setFeeReceiver(address _feeReceiver) external onlyAdmin {
        if (_feeReceiver == address(0)) revert InvalidFeeReceiver();

        address oldValue = feeReceiver;
        feeReceiver = _feeReceiver;
        emit SetFeeReceiver(oldValue, _feeReceiver);
    }

    function setFeePercent(uint256 _newValue) external onlyAdmin {
        if (_newValue > 10000) revert InvalidFeePercent();

        uint256 oldValue = feePercent;
        feePercent = _newValue;
        emit SetFeePercent(oldValue, _newValue);
    }
}
