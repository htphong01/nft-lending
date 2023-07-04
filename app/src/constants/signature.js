import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_NAME, CHAIN_ID } from './index';

export const DOMAIN = {
  name: NFT_CONTRACT_NAME,
  version: '1',
  chainId: CHAIN_ID,
  verifyingContract: NFT_CONTRACT_ADDRESS,
};

export const ORDER_TYPE_SIGNATURE = [
  {
    name: 'creator',
    type: 'address',
  },
  {
    name: 'nftAddress',
    type: 'address',
  },
  {
    name: 'nftTokenId',
    type: 'uint256',
  },
  {
    name: 'offer',
    type: 'uint256',
  },
  {
    name: 'duration',
    type: 'uint256',
  },
  {
    name: 'rate',
    type: 'uint256',
  },
];

export const OFFER_TYPE_SIGNATURE = [
  {
    name: 'lender',
    type: 'address',
  },
  {
    name: 'borrower',
    type: 'address',
  },
  {
    name: 'nftAddress',
    type: 'address',
  },
  {
    name: 'nftTokenId',
    type: 'uint256',
  },
  {
    name: 'offer',
    type: 'uint256',
  },
  {
    name: 'duration',
    type: 'uint256',
  },
  {
    name: 'rate',
    type: 'uint256',
  },
];
