//SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract Monkey721 is ERC721EnumerableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter public lastId;

    /**
     * @dev Mapping for token metadata URIs.
     */
    mapping(uint256 => string) private _tokenURIs;

    // ============ EVENTS ============

    /// @dev Emit an event when mint success.
    event Mint(address indexed to, uint256 indexed tokenId, string tokenUri);

    /// @dev Emit an event when mintBatch success.
    event MintBatch(address indexed to, uint256[] tokenIds, string[] tokenUris);

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
        __ERC721_init(_name, _symbol);
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
        require(_exists(_tokenId), "URI set of nonexistent token");
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
     * @param _tokenUri The metadata URI associated with the token being minted.
     * @return tokenId The unique identifier of the token that was minted, assigned to the owner's address.
     */
    function mint(address _to, string memory _tokenUri) public returns (uint256 tokenId) {
        require(bytes(_tokenUri).length > 0, "Invalid tokenUri");
        lastId.increment();
        _safeMint(_to, lastId.current());
        _tokenURIs[lastId.current()] = _tokenUri;
        tokenId = lastId.current();
        emit Mint(_to, tokenId, _tokenUri);
    }

    /**
     * @notice This function mints multiple tokens to a specified address.
     * @param _to The address where the tokens will be minted to.
     * @param _tokenUris The metadata URIs associated with each token being minted.
     * @return tokenIds The list of unique identifiers of the tokens that were minted, assigned to the owner's address.
     */
    function mintBatch(address _to, string[] memory _tokenUris) external returns (uint256[] memory tokenIds) {
        require(_tokenUris.length > 0, "Token URIs must have at least 1 item");
        tokenIds = new uint256[](_tokenUris.length);

        for (uint256 i = 0; i < _tokenUris.length; i++) {
            tokenIds[i] = mint(_to, _tokenUris[i]);
        }

        emit MintBatch(_to, tokenIds, _tokenUris);
    }

    // ============ OTHER FUNCTIONS =============

    /**
     * @notice Takes a tokenId and returns base64 string to represent the token metadata.
     * @param _tokenId Id of the token.
     * @return string base64
     */
    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        return _tokenURIs[_tokenId];
    }

    /**
     * @notice Returns base64 string to represent the contract metadata.
     * See https://docs.opensea.io/docs/contract-level-metadata
     * @return string base64
     */
    function contractURI() public view returns (string memory) {
        return tokenURI(0);
    }
}
