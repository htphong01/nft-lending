// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract Weapon is ERC721URIStorage {
    using EnumerableSet for EnumerableSet.UintSet;

    /**
     * @notice Token Id
     */
    uint256 public tokenIds;

    constructor() ERC721("Weapon", "Weapon") {}

    function mint(address _to, string memory _uri) external {
        tokenIds++;
        _safeMint(_to, tokenIds);
        _setTokenURI(tokenIds, _uri);
    }
}
