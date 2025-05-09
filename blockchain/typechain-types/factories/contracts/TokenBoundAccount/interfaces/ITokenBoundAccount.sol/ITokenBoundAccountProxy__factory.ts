/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  ITokenBoundAccountProxy,
  ITokenBoundAccountProxyInterface,
} from "../../../../../contracts/TokenBoundAccount/interfaces/ITokenBoundAccount.sol/ITokenBoundAccountProxy";

const _abi = [
  {
    inputs: [],
    name: "implementation",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class ITokenBoundAccountProxy__factory {
  static readonly abi = _abi;
  static createInterface(): ITokenBoundAccountProxyInterface {
    return new Interface(_abi) as ITokenBoundAccountProxyInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ITokenBoundAccountProxy {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as ITokenBoundAccountProxy;
  }
}
