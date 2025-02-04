import { BigNumber } from "ethers";

export interface Offer {
  principalAmount: BigNumber;
  maximumRepaymentAmount: BigNumber;
  nftCollateralId: number;
  nftCollateralContract: string;
  duration: number;
  adminFeeInBasisPoints: number;
  erc20Denomination: string;
  lendingPool: string;
}

export interface Signature {
  nonce: number;
  expiry: number;
  signer: string;
  signature: string;
}
