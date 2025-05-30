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

export interface LendingStakeInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "addressLength"
      | "approve"
      | "claimReward"
      | "deposit"
      | "getAddressByIndex"
      | "getAllAddress"
      | "lendingPool"
      | "pause"
      | "paused"
      | "pendingReward"
      | "poolInfo"
      | "rescueToken"
      | "rewardPerBlock"
      | "rewardSupply"
      | "setLendingPool"
      | "setRewardPerBlock"
      | "setStartBlock"
      | "startBlock"
      | "unpause"
      | "updatePool"
      | "userInfo"
      | "wXENE"
      | "withdraw"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "ClaimReward"
      | "Deposit"
      | "Paused"
      | "Unpaused"
      | "Withdraw"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "addressLength",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "claimReward",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getAddressByIndex",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getAllAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "lendingPool",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "pendingReward",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "poolInfo", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "rescueToken",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "rewardPerBlock",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setLendingPool",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setRewardPerBlock",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setStartBlock",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "startBlock",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "updatePool",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "userInfo",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "wXENE", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "addressLength",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "claimReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getAddressByIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAllAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lendingPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pendingReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "poolInfo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rescueToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardPerBlock",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setLendingPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRewardPerBlock",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setStartBlock",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "startBlock", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "updatePool", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "userInfo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "wXENE", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}

export namespace ClaimRewardEvent {
  export type InputTuple = [user: AddressLike, amount: BigNumberish];
  export type OutputTuple = [user: string, amount: bigint];
  export interface OutputObject {
    user: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DepositEvent {
  export type InputTuple = [user: AddressLike, amount: BigNumberish];
  export type OutputTuple = [user: string, amount: bigint];
  export interface OutputObject {
    user: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PausedEvent {
  export type InputTuple = [account: AddressLike];
  export type OutputTuple = [account: string];
  export interface OutputObject {
    account: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UnpausedEvent {
  export type InputTuple = [account: AddressLike];
  export type OutputTuple = [account: string];
  export interface OutputObject {
    account: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WithdrawEvent {
  export type InputTuple = [user: AddressLike, amount: BigNumberish];
  export type OutputTuple = [user: string, amount: bigint];
  export interface OutputObject {
    user: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface LendingStake extends BaseContract {
  connect(runner?: ContractRunner | null): LendingStake;
  waitForDeployment(): Promise<this>;

  interface: LendingStakeInterface;

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

  addressLength: TypedContractMethod<[], [bigint], "view">;

  approve: TypedContractMethod<[_amount: BigNumberish], [void], "nonpayable">;

  claimReward: TypedContractMethod<[], [void], "nonpayable">;

  deposit: TypedContractMethod<[_amount: BigNumberish], [void], "nonpayable">;

  getAddressByIndex: TypedContractMethod<
    [_index: BigNumberish],
    [string],
    "view"
  >;

  getAllAddress: TypedContractMethod<[], [string[]], "view">;

  lendingPool: TypedContractMethod<[], [string], "view">;

  pause: TypedContractMethod<[], [void], "nonpayable">;

  paused: TypedContractMethod<[], [boolean], "view">;

  pendingReward: TypedContractMethod<[_user: AddressLike], [bigint], "view">;

  poolInfo: TypedContractMethod<
    [],
    [
      [bigint, bigint, bigint, bigint] & {
        lastRewardBlock: bigint;
        accRewardPerShare: bigint;
        stakedSupply: bigint;
        totalPendingReward: bigint;
      }
    ],
    "view"
  >;

  rescueToken: TypedContractMethod<
    [_token: AddressLike, _to: AddressLike],
    [void],
    "nonpayable"
  >;

  rewardPerBlock: TypedContractMethod<[], [bigint], "view">;

  rewardSupply: TypedContractMethod<[], [bigint], "view">;

  setLendingPool: TypedContractMethod<
    [_lendingPool: AddressLike],
    [void],
    "nonpayable"
  >;

  setRewardPerBlock: TypedContractMethod<
    [_rewardPerBlock: BigNumberish],
    [void],
    "nonpayable"
  >;

  setStartBlock: TypedContractMethod<
    [_startBlock: BigNumberish],
    [void],
    "nonpayable"
  >;

  startBlock: TypedContractMethod<[], [bigint], "view">;

  unpause: TypedContractMethod<[], [void], "nonpayable">;

  updatePool: TypedContractMethod<[], [void], "nonpayable">;

  userInfo: TypedContractMethod<
    [arg0: AddressLike],
    [
      [bigint, bigint, bigint] & {
        amount: bigint;
        rewardDebt: bigint;
        rewardPending: bigint;
      }
    ],
    "view"
  >;

  wXENE: TypedContractMethod<[], [string], "view">;

  withdraw: TypedContractMethod<[_amount: BigNumberish], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "addressLength"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "approve"
  ): TypedContractMethod<[_amount: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "claimReward"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "deposit"
  ): TypedContractMethod<[_amount: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "getAddressByIndex"
  ): TypedContractMethod<[_index: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "getAllAddress"
  ): TypedContractMethod<[], [string[]], "view">;
  getFunction(
    nameOrSignature: "lendingPool"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "pause"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "paused"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "pendingReward"
  ): TypedContractMethod<[_user: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "poolInfo"
  ): TypedContractMethod<
    [],
    [
      [bigint, bigint, bigint, bigint] & {
        lastRewardBlock: bigint;
        accRewardPerShare: bigint;
        stakedSupply: bigint;
        totalPendingReward: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "rescueToken"
  ): TypedContractMethod<
    [_token: AddressLike, _to: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "rewardPerBlock"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "rewardSupply"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "setLendingPool"
  ): TypedContractMethod<[_lendingPool: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setRewardPerBlock"
  ): TypedContractMethod<[_rewardPerBlock: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setStartBlock"
  ): TypedContractMethod<[_startBlock: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "startBlock"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "unpause"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updatePool"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "userInfo"
  ): TypedContractMethod<
    [arg0: AddressLike],
    [
      [bigint, bigint, bigint] & {
        amount: bigint;
        rewardDebt: bigint;
        rewardPending: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "wXENE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<[_amount: BigNumberish], [void], "nonpayable">;

  getEvent(
    key: "ClaimReward"
  ): TypedContractEvent<
    ClaimRewardEvent.InputTuple,
    ClaimRewardEvent.OutputTuple,
    ClaimRewardEvent.OutputObject
  >;
  getEvent(
    key: "Deposit"
  ): TypedContractEvent<
    DepositEvent.InputTuple,
    DepositEvent.OutputTuple,
    DepositEvent.OutputObject
  >;
  getEvent(
    key: "Paused"
  ): TypedContractEvent<
    PausedEvent.InputTuple,
    PausedEvent.OutputTuple,
    PausedEvent.OutputObject
  >;
  getEvent(
    key: "Unpaused"
  ): TypedContractEvent<
    UnpausedEvent.InputTuple,
    UnpausedEvent.OutputTuple,
    UnpausedEvent.OutputObject
  >;
  getEvent(
    key: "Withdraw"
  ): TypedContractEvent<
    WithdrawEvent.InputTuple,
    WithdrawEvent.OutputTuple,
    WithdrawEvent.OutputObject
  >;

  filters: {
    "ClaimReward(address,uint256)": TypedContractEvent<
      ClaimRewardEvent.InputTuple,
      ClaimRewardEvent.OutputTuple,
      ClaimRewardEvent.OutputObject
    >;
    ClaimReward: TypedContractEvent<
      ClaimRewardEvent.InputTuple,
      ClaimRewardEvent.OutputTuple,
      ClaimRewardEvent.OutputObject
    >;

    "Deposit(address,uint256)": TypedContractEvent<
      DepositEvent.InputTuple,
      DepositEvent.OutputTuple,
      DepositEvent.OutputObject
    >;
    Deposit: TypedContractEvent<
      DepositEvent.InputTuple,
      DepositEvent.OutputTuple,
      DepositEvent.OutputObject
    >;

    "Paused(address)": TypedContractEvent<
      PausedEvent.InputTuple,
      PausedEvent.OutputTuple,
      PausedEvent.OutputObject
    >;
    Paused: TypedContractEvent<
      PausedEvent.InputTuple,
      PausedEvent.OutputTuple,
      PausedEvent.OutputObject
    >;

    "Unpaused(address)": TypedContractEvent<
      UnpausedEvent.InputTuple,
      UnpausedEvent.OutputTuple,
      UnpausedEvent.OutputObject
    >;
    Unpaused: TypedContractEvent<
      UnpausedEvent.InputTuple,
      UnpausedEvent.OutputTuple,
      UnpausedEvent.OutputObject
    >;

    "Withdraw(address,uint256)": TypedContractEvent<
      WithdrawEvent.InputTuple,
      WithdrawEvent.OutputTuple,
      WithdrawEvent.OutputObject
    >;
    Withdraw: TypedContractEvent<
      WithdrawEvent.InputTuple,
      WithdrawEvent.OutputTuple,
      WithdrawEvent.OutputObject
    >;
  };
}
