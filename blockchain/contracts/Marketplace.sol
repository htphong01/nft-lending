// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./libraries/NFTChecker.sol";
import "./libraries/Helper.sol";

struct Offer {
    uint256 itemId; // The unique identifier for an item
    address nft; // The address of a non-fungible token (NFT) contract associated with the item.
    uint256 tokenId; // The unique token identifier associated with the specific NFT.
    uint256 totalAmount; // The total quantity or amount of the item available for sale.
    uint256 price; // The cost or price at which the item is listed for sale
    uint256 expTime; // The expiration time or timestamp until which the item listing remains valid.
    address seller; // The address of the user or entity selling the item.
    uint256 nonce; // Is used for security purposes, typically in cryptographic operations, to prevent replay attacks or ensure uniqueness.
    bytes signature; // the EIP-712 signature of all other fields in the Offer struct. For a voucher to be valid, it must be signed by verifier.
}

contract Marketplace is ERC721Holder, ERC1155Holder, ReentrancyGuard, Ownable {
    address public verifier;
    address public feeAccount; // The account that receives fees.
    uint256 public feePercent; // The fee percentage on sales.
    uint256 public constant WEIGHT_DECIMAL = 1e6;

    /// @dev Check signature is used yet.
    mapping(bytes => bool) public signatureUsed;

    event Bought(
        address indexed nft,
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        address indexed seller,
        address indexed buyer
    );

    event SetVerifier(address indexed oldAddress, address indexed newAddress);
    event SetFeeAccount(address indexed oldAddress, address indexed newAddress);
    event SetFeePercent(uint256 indexed oldFee, uint256 indexed newFee);

    constructor(uint256 _feePercent) {
        verifier = _msgSender();
        feeAccount = _msgSender();
        feePercent = _feePercent;
    }

    function purchaseItem(Offer calldata _offer, uint256 _amount) external payable nonReentrant {
        uint256 totalPrice = _offer.price * _amount;
        require(_verify(_offer), "Invalid signature");
        require(block.timestamp < _offer.expTime, "The purchasing time has expired");
        require(_amount <= _offer.totalAmount, "Amount exceeds balance");
        require(msg.value == totalPrice, "The purchase price is not accurate");

        // Update signature status.
        signatureUsed[_offer.signature] = true;

        // Pay seller and feeAccount.
        uint256 marketFee = _getPriceToPercent(totalPrice, feePercent);
        Helper.safeTransferNative(_offer.seller, totalPrice - marketFee);
        Helper.safeTransferNative(feeAccount, marketFee);

        // Transfer tokens to claimer.
        if (NFTChecker.isERC721(_offer.nft)) {
            IERC721(_offer.nft).safeTransferFrom(_offer.seller, _msgSender(), _offer.tokenId);
        } else {
            IERC1155(_offer.nft).safeTransferFrom(_offer.seller, _msgSender(), _offer.tokenId, _amount, "");
        }

        emit Bought(_offer.nft, _offer.tokenId, _amount, totalPrice, _offer.seller, _msgSender());
    }

    function setFeeAccount(address _feeAccount) external onlyOwner {
        require(_feeAccount != address(0), "feeAccount is zero address");
        address oldAddress = feeAccount;
        feeAccount = _feeAccount;
        emit SetFeeAccount(oldAddress, _feeAccount);
    }

    function setFeePercent(uint256 _feePercent) external onlyOwner {
        uint256 oldFee = feePercent;
        feePercent = _feePercent;
        emit SetFeePercent(oldFee, _feePercent);
    }

    function setVerifier(address _verifier) external onlyOwner {
        require(_verifier != address(0), "verifier is zero address");
        address oldAddres = verifier;
        verifier = _verifier;
        emit SetVerifier(oldAddres, _verifier);
    }

    /// @notice Verifies the signature for a given Offer, returning true if signer is verifier.
    /// @dev Will revert if the signature is invalid.
    /// @param _offer An Offer describing an unminted NFT.
    function _verify(Offer calldata _offer) private view returns (bool) {
        if (signatureUsed[_offer.signature]) return false;
        bytes memory messageHash = abi.encode(
            _offer.itemId,
            _offer.nft,
            _offer.tokenId,
            _offer.totalAmount,
            _offer.price,
            _offer.expTime,
            _offer.seller,
            _offer.nonce
        );
        bytes32 digest = ECDSA.toEthSignedMessageHash(messageHash);
        return ECDSA.recover(digest, _offer.signature) == verifier;
    }

    function _getPriceToPercent(uint256 _price, uint256 _percent) private pure returns (uint256) {
        return (_price * _percent) / (100 * WEIGHT_DECIMAL);
    }
}
