// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./WXENE.sol";
import "./libraries/Helper.sol";
import "./loans/direct/loanTypes/IDirectLoanBase.sol";
import "./interfaces/ILiquidateNFTPool.sol";
import "./utils/Permission.sol";

enum ItemStatus {
    OPENING,
    SOLD,
    CLOSED
}

contract Marketplace is Permission, ReentrancyGuard, IERC721Receiver {
    using SafeERC20 for IERC20;

    address public wXENE;
    address public liquidateNFTPool;
    address public feeReceiver;
    uint256 public feePercent;
    uint256 public itemCount;

    struct Item {
        uint256 itemId;
        address nft;
        uint256 tokenId;
        uint256 price;
        address seller;
        ItemStatus status;
    }

    // Market item info mapped by item id
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
    event SetWXENE(address indexed oldValue, address indexed newValue);
    event SetLiquidateNFTPool(address indexed oldValue, address indexed newValue);
    event SetFeeReceiver(address indexed oldValue, address indexed newValue);
    event SetFeePercent(uint256 indexed oldValue, uint256 indexed newValue);
    event WithdrawnFund(address indexed serviceFundReceiver, uint256 indexed value);

    constructor(address _wXENE, address _feeReceiver, uint256 _feePercent) {
        wXENE = _wXENE;
        feeReceiver = _feeReceiver;
        feePercent = _feePercent;

        setAdmin(_msgSender(), true);
    }

    // Make item to offer on the marketplace
    function makeItem(address _nft, uint256 _tokenId, uint256 _price) external {
        require(_price > 0, "Price must be greater than zero");
        // add new item to items mapping
        _makeItem(_nft, _tokenId, _price);
        // transfer nft
        IERC721(_nft).transferFrom(_msgSender(), address(this), _tokenId);
    }

    function liquidate(address _nft, uint256 _tokenId, uint256 _price) external {
        require(_msgSender() == liquidateNFTPool, "caller is not liquidateNFTPool");
        require(_price > 0, "Price must be greater than zero");
        // add new item to items mapping
        _makeItem(_nft, _tokenId, _price);
    }

    function _makeItem(address _nft, uint256 _tokenId, uint256 _price) private notZeroAddress(_nft) {
        itemCount++;
        // add new item to items mapping
        items[itemCount] = Item(itemCount, _nft, _tokenId, _price, _msgSender(), ItemStatus.OPENING);

        emit Offered(itemCount, _nft, _tokenId, _price, _msgSender());
    }

    function purchaseItems(uint256[] memory _itemIds) external payable nonReentrant {
        uint256 totalPayment = msg.value;
        uint256 _totalMarketFee = 0;
        for (uint256 i = 0; i < _itemIds.length; ++i) {
            Item storage item = items[_itemIds[i]];
            require(item.itemId > 0, "item doesn't exist");
            require(item.status == ItemStatus.OPENING, "item not opening");
            require(totalPayment >= item.price, "not enough ether to paid");

            // update item to sold
            item.status = ItemStatus.SOLD;
            totalPayment -= item.price;

            // pay seller
            if (item.seller == liquidateNFTPool) {
                address loan = ILiquidateNFTPool(liquidateNFTPool).loan();

                // Wrap XENE to wXENE
                WXENE(wXENE).mint{value: item.price}();

                // transfer wXENE to lendingPool
                WXENE(wXENE).transfer(IDirectLoanBase(loan).lendingPool(), item.price);
            } else {
                uint256 marketFee = (item.price * feePercent) / 10000;
                _totalMarketFee += marketFee;
                Helper.safeTransferNative(item.seller, item.price - marketFee);
            }

            // transfer nft to buyer
            IERC721(item.nft).transferFrom(address(this), _msgSender(), item.tokenId);

            emit Bought(item.itemId, item.nft, item.tokenId, item.price, item.seller, _msgSender());
        }

        // transfer fee
        if (_totalMarketFee + totalPayment > 0) {
            Helper.safeTransferNative(feeReceiver, _totalMarketFee + totalPayment);
        }
    }

    function closeItem(uint256 _itemId) external {
        Item storage item = items[_itemId];
        require(item.itemId > 0, "item doesn't exist");
        require(_msgSender() == item.seller, "caller is not seller");
        require(item.status == ItemStatus.OPENING, "item not opening");

        item.status = ItemStatus.CLOSED;

        // transfer nft to buyer
        IERC721(item.nft).transferFrom(address(this), _msgSender(), item.tokenId);

        emit CloseItem(_itemId, address(item.nft), item.tokenId);
    }

    function setWXENE(address _newValue) external notZeroAddress(_newValue) onlyAdmin {
        address oldValue = wXENE;
        wXENE = _newValue;
        emit SetWXENE(oldValue, _newValue);
    }

    function setLiquidateNFTPool(address _newValue) external notZeroAddress(_newValue) onlyAdmin {
        address oldValue = liquidateNFTPool;
        liquidateNFTPool = _newValue;
        emit SetLiquidateNFTPool(oldValue, _newValue);
    }

    function setFeeReceiver(address _newValue) external notZeroAddress(_newValue) onlyAdmin {
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

    function onERC721Received(address, address, uint256, bytes calldata) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    /**
     * @notice Withdraw all funds from the contract
     */
    function withdrawFund() external {
        uint256 withdrawable = address(this).balance;
        require(withdrawable > 0, "Amount exceeds balance");

        Helper.safeTransferNative(feeReceiver, withdrawable);
        emit WithdrawnFund(feeReceiver, withdrawable);
    }
}
