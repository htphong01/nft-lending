// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract ChonkSociety is ERC721URIStorage {
    using Strings for uint256;
    using EnumerableSet for EnumerableSet.UintSet;

    /* ******* */
    /* STORAGE */
    /* ******* */

    /**
     * @notice base extension for metadata URI
     */
    string public constant baseExtension = ".json";

    /**
     * @notice Token Id
     */
    uint256 public tokenIds;

    /**
     * @notice base URI for metadata
     */
    string public baseURI = "";

    /* *********** */
    /* CONSTRUCTOR */
    /* *********** */

    /**
     * @notice null Constructor
     * @param _baseURI Base URI of NFT
     */
    constructor(string memory _baseURI) ERC721("Chonk Society", "CHONK") {
        baseURI = _baseURI;
    }

    /* ****************** */
    /* EXTERNAL FUNCTIONS */
    /* ****************** */

    /**
     * @notice Mint new NFT
     * @dev Everyone can call
     * @param _to Address will be received NFT
     * @param _amount Amount NFT that address will be received
     */
    function mint(address _to, uint256 _amount) external {
        for (uint256 i = 0; i < _amount; i++) {
            tokenIds++;
            _safeMint(_to, tokenIds);
        }
    }

    /* ************* */
    /* VIEW FUNCTIONS */
    /* ************* */

    /**
     * @notice Get token URI of a NFT
     * @dev Everyone can call
     * @param tokenId Id of NFT
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId);
        return string(abi.encodePacked(baseURI, tokenId.toString(), baseExtension));
    }
}
