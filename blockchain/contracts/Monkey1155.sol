//SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract Monkey1155 is ERC1155Upgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter public lastId;

    /// @dev The name of the token.
    string public name;

    /// @dev The symbol of the token.
    string public symbol;

    /**
     * @dev Mapping for token metadata URIs.
     */
    mapping(uint256 => string) private _tokenURIs;

    // ============ EVENTS ============

    /// @dev Emit an event when mint success.
    event Mint(address indexed to, uint256 indexed tokenId, string tokenUri, uint256 amount);

    /// @dev Emit an event when mintBatch success.
    event MintBatch(address indexed to, uint256[] tokenIds, uint256[] amounts, string[] tokenUris);

    /// @dev Emit an event when updated new contract URI.
    event SetContractURI(string oldUri, string newUri);

    /// @dev Emit an event when updated new token URI.
    event SetTokenURI(uint256 indexed tokenId, string oldUri, string newUri);

    /**
     * @notice This function sets the initial states of the contract and is only called once at deployment.
     * @param _contractUri The metadata URI associated with the contract.
     * @param _name The name of the token.
     * @param _symbol The symbol used to represent the token.
     */
    function initialize(string memory _contractUri, string memory _name, string memory _symbol) public initializer {
        __ERC1155_init("");

        name = _name;
        symbol = _symbol;
        _tokenURIs[0] = _contractUri;
    }

    /**
     * @notice Sets the metadata URI for the specified token ID.
     * @param _tokenId Token ID.
     * @param _tokenUri New Metadata URI.
     * Requirements:
     * - The specified "tokenId" must exist.
     */
    function setTokenURI(uint256 _tokenId, string memory _tokenUri) external {
        require(_tokenId > 0 && _tokenId <= lastId.current(), "URI set of nonexistent token");
        require(bytes(_tokenUri).length > 0, "Invalid tokenUri");
        string memory oldUri = _tokenURIs[_tokenId];
        _tokenURIs[_tokenId] = _tokenUri;
        emit SetTokenURI(_tokenId, oldUri, _tokenUri);
    }

    /**
     * @notice Updates the contract's URI to a new value.
     * @param _newUri The new URI to be set for the contract.
     */
    function setContractURI(string memory _newUri) external {
        require(bytes(_newUri).length > 0, "Invalid newUri");
        string memory oldUri = _tokenURIs[0];
        _tokenURIs[0] = _newUri;
        emit SetContractURI(oldUri, _newUri);
    }

    // ============ OWNER OR CONTROLLER-ONLY FUNCTIONS ============

    /**
     * @notice This function mints a token to a specified address.
     * @param _to The address where the token will be minted to.
     * @param _amount The number of tokens to be minted.
     * @param _tokenUri The metadata URI associated with the token being minted.
     * @return tokenId The unique identifier of the token that was minted, assigned to the owner's address.
     */
    function mint(address _to, uint256 _amount, string memory _tokenUri) public returns (uint256 tokenId) {
        require(_amount > 0, "Invalid amount");
        require(bytes(_tokenUri).length > 0, "Invalid tokenUri");
        lastId.increment();
        tokenId = lastId.current();
        _mint(_to, tokenId, _amount, "");
        _tokenURIs[tokenId] = _tokenUri;
        emit Mint(_to, tokenId, _tokenUri, _amount);
    }

    /**
     * @notice This function mints multiple tokens to a specified address.
     * @param _to The address where the tokens will be minted to.
     * @param _amounts An array of the number of tokens to be minted for each token.
     * @param _tokenUris The metadata URIs associated with each token being minted.
     * @return tokenIds The list of unique identifiers of the tokens that were minted, assigned to the owner's address.
     */
    function mintBatch(
        address _to,
        uint256[] memory _amounts,
        string[] memory _tokenUris
    ) external returns (uint256[] memory tokenIds) {
        require(_amounts.length > 0 && _amounts.length == _tokenUris.length, "Invalid parameters");
        tokenIds = new uint256[](_amounts.length);
        for (uint256 i = 0; i < _amounts.length; i++) {
            tokenIds[i] = mint(_to, _amounts[i], _tokenUris[i]);
        }
        emit MintBatch(_to, tokenIds, _amounts, _tokenUris);
    }

    // ============ OTHER FUNCTIONS =============

    /**
     * @notice Takes a tokenId and returns base64 string to represent the token metadata.
     * @param _tokenId Id of the token.
     * @return string base64
     */
    function uri(uint256 _tokenId) public view override returns (string memory) {
        return _tokenURIs[_tokenId];
    }

    /**
     * @notice Returns base64 string to represent the contract metadata.
     * See https://docs.opensea.io/docs/contract-level-metadata
     * @return string base64
     */
    function contractURI() public view returns (string memory) {
        return uri(0);
    }
}
