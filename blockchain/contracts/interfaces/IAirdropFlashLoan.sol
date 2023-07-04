// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.18;

interface IAirdropFlashLoan {
    function pullAirdrop(
        address _nftCollateralContract,
        uint256 _nftCollateralId,
        address _nftWrapper,
        address _target,
        bytes calldata _data,
        address _nftAirdrop,
        uint256 _nftAirdropId,
        address _beneficiary
    ) external;
}
