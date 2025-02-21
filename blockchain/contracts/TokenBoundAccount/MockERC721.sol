// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Character is ERC721URIStorage {
    uint256 public tokenIds;

    constructor() ERC721("Character", "CHAR") {}

    function mint(address _to, string memory _uri) external {
        tokenIds++;
        _safeMint(_to, tokenIds);
        _setTokenURI(tokenIds, _uri);
    }
}
