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
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface TokenBoundAccountRegistryInterface extends Interface {
  getFunction(nameOrSignature: "account" | "createAccount"): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "AccountCreated"): EventFragment;

  encodeFunctionData(
    functionFragment: "account",
    values: [AddressLike, BigNumberish, AddressLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "createAccount",
    values: [AddressLike, BigNumberish, AddressLike, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "account", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "createAccount",
    data: BytesLike
  ): Result;
}

export namespace AccountCreatedEvent {
  export type InputTuple = [
    account: AddressLike,
    implementation: AddressLike,
    chainId: BigNumberish,
    tokenContract: AddressLike,
    tokenId: BigNumberish,
    salt: BigNumberish
  ];
  export type OutputTuple = [
    account: string,
    implementation: string,
    chainId: bigint,
    tokenContract: string,
    tokenId: bigint,
    salt: bigint
  ];
  export interface OutputObject {
    account: string;
    implementation: string;
    chainId: bigint;
    tokenContract: string;
    tokenId: bigint;
    salt: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface TokenBoundAccountRegistry extends BaseContract {
  connect(runner?: ContractRunner | null): TokenBoundAccountRegistry;
  waitForDeployment(): Promise<this>;

  interface: TokenBoundAccountRegistryInterface;

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

  account: TypedContractMethod<
    [
      implementation: AddressLike,
      chainId: BigNumberish,
      tokenContract: AddressLike,
      tokenId: BigNumberish,
      salt: BigNumberish
    ],
    [string],
    "view"
  >;

  createAccount: TypedContractMethod<
    [
      implementation: AddressLike,
      chainId: BigNumberish,
      tokenContract: AddressLike,
      tokenId: BigNumberish,
      salt: BigNumberish
    ],
    [string],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "account"
  ): TypedContractMethod<
    [
      implementation: AddressLike,
      chainId: BigNumberish,
      tokenContract: AddressLike,
      tokenId: BigNumberish,
      salt: BigNumberish
    ],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "createAccount"
  ): TypedContractMethod<
    [
      implementation: AddressLike,
      chainId: BigNumberish,
      tokenContract: AddressLike,
      tokenId: BigNumberish,
      salt: BigNumberish
    ],
    [string],
    "nonpayable"
  >;

  getEvent(
    key: "AccountCreated"
  ): TypedContractEvent<
    AccountCreatedEvent.InputTuple,
    AccountCreatedEvent.OutputTuple,
    AccountCreatedEvent.OutputObject
  >;

  filters: {
    "AccountCreated(address,address,uint256,address,uint256,uint256)": TypedContractEvent<
      AccountCreatedEvent.InputTuple,
      AccountCreatedEvent.OutputTuple,
      AccountCreatedEvent.OutputObject
    >;
    AccountCreated: TypedContractEvent<
      AccountCreatedEvent.InputTuple,
      AccountCreatedEvent.OutputTuple,
      AccountCreatedEvent.OutputObject
    >;
  };
}
