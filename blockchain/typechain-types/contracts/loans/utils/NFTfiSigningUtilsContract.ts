/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../../common";

export declare namespace LoanData {
  export type LoanTermsStruct = {
    principalAmount: BigNumberish;
    maximumRepaymentAmount: BigNumberish;
    nftCollateralId: BigNumberish;
    erc20Denomination: AddressLike;
    duration: BigNumberish;
    adminFeeInBasisPoints: BigNumberish;
    loanStartTime: BigNumberish;
    nftCollateralContract: AddressLike;
    borrower: AddressLike;
    lender: AddressLike;
    useLendingPool: boolean;
  };

  export type LoanTermsStructOutput = [
    principalAmount: bigint,
    maximumRepaymentAmount: bigint,
    nftCollateralId: bigint,
    erc20Denomination: string,
    duration: bigint,
    adminFeeInBasisPoints: bigint,
    loanStartTime: bigint,
    nftCollateralContract: string,
    borrower: string,
    lender: string,
    useLendingPool: boolean
  ] & {
    principalAmount: bigint;
    maximumRepaymentAmount: bigint;
    nftCollateralId: bigint;
    erc20Denomination: string;
    duration: bigint;
    adminFeeInBasisPoints: bigint;
    loanStartTime: bigint;
    nftCollateralContract: string;
    borrower: string;
    lender: string;
    useLendingPool: boolean;
  };

  export type SignatureStruct = {
    nonce: BigNumberish;
    expiry: BigNumberish;
    signer: AddressLike;
    signature: BytesLike;
  };

  export type SignatureStructOutput = [
    nonce: bigint,
    expiry: bigint,
    signer: string,
    signature: string
  ] & { nonce: bigint; expiry: bigint; signer: string; signature: string };

  export type OfferStruct = {
    principalAmount: BigNumberish;
    maximumRepaymentAmount: BigNumberish;
    nftCollateralId: BigNumberish;
    nftCollateralContract: AddressLike;
    duration: BigNumberish;
    adminFeeInBasisPoints: BigNumberish;
    erc20Denomination: AddressLike;
    lendingPool: AddressLike;
  };

  export type OfferStructOutput = [
    principalAmount: bigint,
    maximumRepaymentAmount: bigint,
    nftCollateralId: bigint,
    nftCollateralContract: string,
    duration: bigint,
    adminFeeInBasisPoints: bigint,
    erc20Denomination: string,
    lendingPool: string
  ] & {
    principalAmount: bigint;
    maximumRepaymentAmount: bigint;
    nftCollateralId: bigint;
    nftCollateralContract: string;
    duration: bigint;
    adminFeeInBasisPoints: bigint;
    erc20Denomination: string;
    lendingPool: string;
  };
}

export interface NFTfiSigningUtilsContractInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "isValidLenderRenegotiationSignature"
      | "isValidLenderSignature"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "isValidLenderRenegotiationSignature",
    values: [
      BytesLike,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      LoanData.LoanTermsStruct,
      LoanData.SignatureStruct,
      AddressLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "isValidLenderSignature",
    values: [LoanData.OfferStruct, LoanData.SignatureStruct, AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "isValidLenderRenegotiationSignature",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isValidLenderSignature",
    data: BytesLike
  ): Result;
}

export interface NFTfiSigningUtilsContract extends BaseContract {
  connect(runner?: ContractRunner | null): NFTfiSigningUtilsContract;
  waitForDeployment(): Promise<this>;

  interface: NFTfiSigningUtilsContractInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  isValidLenderRenegotiationSignature: TypedContractMethod<
    [
      _loanId: BytesLike,
      _newLoanDuration: BigNumberish,
      _newMaximumRepaymentAmount: BigNumberish,
      _renegotiationFee: BigNumberish,
      _loan: LoanData.LoanTermsStruct,
      _signature: LoanData.SignatureStruct,
      _loanContract: AddressLike
    ],
    [boolean],
    "view"
  >;

  isValidLenderSignature: TypedContractMethod<
    [
      _offer: LoanData.OfferStruct,
      _signature: LoanData.SignatureStruct,
      _loanContract: AddressLike
    ],
    [boolean],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "isValidLenderRenegotiationSignature"
  ): TypedContractMethod<
    [
      _loanId: BytesLike,
      _newLoanDuration: BigNumberish,
      _newMaximumRepaymentAmount: BigNumberish,
      _renegotiationFee: BigNumberish,
      _loan: LoanData.LoanTermsStruct,
      _signature: LoanData.SignatureStruct,
      _loanContract: AddressLike
    ],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "isValidLenderSignature"
  ): TypedContractMethod<
    [
      _offer: LoanData.OfferStruct,
      _signature: LoanData.SignatureStruct,
      _loanContract: AddressLike
    ],
    [boolean],
    "view"
  >;

  filters: {};
}
