// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.18;

/**
 * @title INftfiHub
 * @author NFTfi
 * @dev NftfiHub interface
 */
interface INftfiHub {
    function getNFTPermit(address _nftContract) external view returns (bool);
}
