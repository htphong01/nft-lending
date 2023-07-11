// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.18;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WXCR is ERC20 {
    constructor() ERC20("Wrapped XCR", "wXCR") {}

    function mint(address _to, uint256 _amount) external {
        _mint(_to, _amount);
    }
}
