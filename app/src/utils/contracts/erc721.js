import axios from 'axios';
import { ethers } from 'ethers';
import { NFT_CONTRACT_ADDRESS } from '@src/constants';
import { ERC721_ABI } from '@src/abi';

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');

export const getNFTs = async (address, contractAddress = NFT_CONTRACT_ADDRESS) => {
  const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
  const tokens = await contract.tokensOfOwner(address);
  const baseURI = await contract.baseURI();
  const ext = await contract.baseExtension();
  return Promise.all(tokens.slice(0, 10).map((token) => axios.get(`${baseURI}${token.toNumber()}${ext}`)));
};

export const ERC721Contract = async (contractAddress = NFT_CONTRACT_ADDRESS) => {
  return new ethers.Contract(contractAddress, ERC721_ABI, provider);
};
