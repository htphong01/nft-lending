export class CreateOrderDto {
  creator: string;
  signature: string;
  nftAddress: string;
  nftTokenId: number;
  offer: number;
  duration: number;
  rate: number;
  doesBorrowUser: boolean;
  metadata: Record<string, any>;
}
