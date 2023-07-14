import { getParsedEthersError } from '@enzoferey/ethers-error-parser';

export const parseMetamaskError = (error) => {
  return getParsedEthersError(error);
};
