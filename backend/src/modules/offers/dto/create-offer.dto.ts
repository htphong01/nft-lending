type OfferSignature = {
  signer: string;
  nonce: number;
  expiry: number;
  signature: string;
};

export class CreateOfferDto {
  creator: string;
  order: string;
  borrower: string;
  erc20Denomination: string;
  offer: string;
  duration: string;
  rate: string;
  expiration: number;
  createdAt: number;
  nftAddress: string;
  nftTokenId: string;
  adminFeeInBasisPoints: number;
  signature: OfferSignature;
  lendingPool: string;
}
