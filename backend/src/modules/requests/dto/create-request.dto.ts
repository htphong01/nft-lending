type RequestSignature = {
  signer: string;
  nonce: number;
  expiry: number;
  signature: string;
};

export class CreateRequestDto {
  creator: string;
  loanId: string;
  loanDuration: number;
  maxRepaymentAmount: number;
  renegotiateFee: number;
  signature: RequestSignature;
}
