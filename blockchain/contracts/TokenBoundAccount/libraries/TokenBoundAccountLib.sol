// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";
import {TokenBoundAccountBytecodeLib} from "./TokenBoundAccountBytecodeLib.sol";

library TokenBoundAccountLib {
    function computeAddress(
        address registry,
        address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        uint256 _salt
    ) internal pure returns (address) {
        bytes32 bytecodeHash = keccak256(
            TokenBoundAccountBytecodeLib.getCreationCode(implementation, chainId, tokenContract, tokenId, _salt)
        );

        return Create2.computeAddress(bytes32(_salt), bytecodeHash, registry);
    }

    function token() internal view returns (uint256, address, uint256) {
        bytes memory footer = new bytes(0x60);

        assembly {
            // copy 0x60 bytes from end of footer
            extcodecopy(address(), add(footer, 0x20), 0x4d, 0x60)
        }

        return abi.decode(footer, (uint256, address, uint256));
    }

    function salt() internal view returns (uint256) {
        bytes memory footer = new bytes(0x20);

        assembly {
            // copy 0x20 bytes from beginning of footer
            extcodecopy(address(), add(footer, 0x20), 0x2d, 0x20)
        }

        return abi.decode(footer, (uint256));
    }
}
