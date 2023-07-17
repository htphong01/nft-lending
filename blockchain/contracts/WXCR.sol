// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.18;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WXCR is ERC20 {

    /* *********** */
    /* CONSTRUCTOR */
    /* *********** */
    constructor() ERC20("Wrapped XCR", "wXCR") {}

    /* ****************** */
    /* EXTERNAL FUNCTIONS */
    /* ****************** */

    /**
     * @notice Mint wXCR to user
     * @dev Everyone can call this function
     * @param _to Address that will be received wXCR
     * @param _amount Amount of XCR
     */
    function mint(address _to, uint256 _amount) external {
        _mint(_to, _amount);
    }
}
