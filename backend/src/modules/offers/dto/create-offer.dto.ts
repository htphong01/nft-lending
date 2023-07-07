export class CreateOfferDto {
  creator: string;
  signature: string;
  order: string;
  borrower: string;
  offer: number;
  duration: number;
  rate: number;
  expiration: number;
}
