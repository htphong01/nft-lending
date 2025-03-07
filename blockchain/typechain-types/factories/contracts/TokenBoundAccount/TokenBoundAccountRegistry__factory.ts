/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  TokenBoundAccountRegistry,
  TokenBoundAccountRegistryInterface,
} from "../../../contracts/TokenBoundAccount/TokenBoundAccountRegistry";

const _abi = [
  {
    inputs: [],
    name: "Create2EmptyBytecode",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedDeployment",
    type: "error",
  },
  {
    inputs: [],
    name: "InitializationFailed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "InsufficientBalance",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenContract",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "salt",
        type: "uint256",
      },
    ],
    name: "AccountCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "salt",
        type: "uint256",
      },
    ],
    name: "account",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "salt",
        type: "uint256",
      },
    ],
    name: "createAccount",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080604052348015600f57600080fd5b506103d58061001f6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80635e9bc5361461003b578063c1340f691461006a575b600080fd5b61004e6100493660046102d0565b61007d565b6040516001600160a01b03909116815260200160405180910390f35b61004e6100783660046102d0565b6100ae565b60008061008d8787878787610169565b805160209091012090506100a183826101d2565b9150505b95945050505050565b6000806100be8787878787610169565b905060006100d68460001b83805190602001206101d2565b90506001600160a01b0381163b156100f15791506100a59050565b604080516001600160a01b0383811682528a811660208301528183018a9052881660608201526080810187905260a0810186905290517f07fba7bba1191da7ee1155dcfa0030701c9c9a9cc34a93b991fc6fd0c9268d8f9181900360c00190a161015d600085846101e6565b98975050505050505050565b60408051602081018390529081018590526001600160a01b0384166060828101919091526080820184905290869060a00160408051601f19818403018152908290526101b8929160200161031e565b604051602081830303815290604052905095945050505050565b60006101df838330610281565b9392505050565b6000834710156102165760405163cf47918160e01b81524760048201526024810185905260440160405180910390fd5b815160000361023857604051631328927760e21b815260040160405180910390fd5b8282516020840186f590503d15198115161561025a576040513d6000823e3d81fd5b6001600160a01b0381166101df5760405163b06ebf3d60e01b815260040160405180910390fd5b6000604051836040820152846020820152828152600b8101905060ff8153605590206001600160a01b0316949350505050565b80356001600160a01b03811681146102cb57600080fd5b919050565b600080600080600060a086880312156102e857600080fd5b6102f1866102b4565b945060208601359350610306604087016102b4565b94979396509394606081013594506080013592915050565b733d60ad80600a3d3981f3363d3d373d3d3d363d7360601b8152606083901b6bffffffffffffffffffffffff191660148201526e5af43d82803e903d91602b57fd5bf360881b60288201528151600090815b8181101561038d5760208186018101516037868401015201610370565b5060009201603701918252509291505056fea2646970667358221220b55c52d6330941d0198e6994c574b2d68e1ee5d1d5e58c548dd5f86ce9d7e74f64736f6c634300081c0033";

type TokenBoundAccountRegistryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TokenBoundAccountRegistryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TokenBoundAccountRegistry__factory extends ContractFactory {
  constructor(...args: TokenBoundAccountRegistryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      TokenBoundAccountRegistry & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): TokenBoundAccountRegistry__factory {
    return super.connect(runner) as TokenBoundAccountRegistry__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TokenBoundAccountRegistryInterface {
    return new Interface(_abi) as TokenBoundAccountRegistryInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): TokenBoundAccountRegistry {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as TokenBoundAccountRegistry;
  }
}
