/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  PermittedNFTs,
  PermittedNFTsInterface,
} from "../../contracts/PermittedNFTs";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_admin",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "EnforcedPause",
    type: "error",
  },
  {
    inputs: [],
    name: "ExpectedPause",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "nftContract",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isPermitted",
        type: "bool",
      },
    ],
    name: "NFTPermit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
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
    ],
    name: "Paused",
    type: "event",
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
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_nftContract",
        type: "address",
      },
    ],
    name: "getNFTPermit",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_nftContract",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_isPermitted",
        type: "bool",
      },
    ],
    name: "setNFTPermit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_nftContracts",
        type: "address[]",
      },
      {
        internalType: "bool",
        name: "_isPermitted",
        type: "bool",
      },
    ],
    name: "setNFTPermits",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051610ee7380380610ee783398181016040528101906100329190610220565b80600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036100a55760006040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260040161009c919061025c565b60405180910390fd5b6100b4816100f660201b60201c565b5060008060146101000a81548160ff021916908315150217905550600180819055506100f0671468d1d4c309816860c01b6101ba60201b60201c565b50610277565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b50565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006101ed826101c2565b9050919050565b6101fd816101e2565b811461020857600080fd5b50565b60008151905061021a816101f4565b92915050565b600060208284031215610236576102356101bd565b5b60006102448482850161020b565b91505092915050565b610256816101e2565b82525050565b6000602082019050610271600083018461024d565b92915050565b610c61806102866000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063715018a61161005b578063715018a6146100ec5780638da5cb5b146100f6578063b06992ef14610114578063f2fde38b146101305761007d565b80632a27811e146100825780635c975abb1461009e5780636651f11d146100bc575b600080fd5b61009c600480360381019061009791906109f6565b61014c565b005b6100a66101c6565b6040516100b39190610a61565b60405180910390f35b6100d660048036038101906100d19190610a7c565b6101dc565b6040516100e39190610a61565b60405180910390f35b6100f461026e565b005b6100fe610282565b60405161010b9190610ab8565b60405180910390f35b61012e60048036038101906101299190610ad3565b6102ab565b005b61014a60048036038101906101459190610a7c565b610325565b005b61016067a49bee4cbd4e52d460c01b6103ab565b6101686103ae565b61017c677321ce534bcc079f60c01b6103ab565b6101906794b64b5f0fc45e8260c01b6103ab565b6101a46753481ba03efbb6e460c01b6103ab565b6101b867e30909174223155d60c01b6103ab565b6101c28282610435565b5050565b60008060149054906101000a900460ff16905090565b60006101f267a439bf99dad895fe60c01b6103ab565b61020667da4c392af6ce9f6860c01b6103ab565b61021a67fc6c7196ed2649cf60c01b6103ab565b600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff169050919050565b6102766103ae565b610280600061056f565b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6102bf67bbb86521d686590660c01b6103ab565b6102c76103ae565b6102db67e475198cdfa9065960c01b6103ab565b6102ef670d85146080cf58d060c01b6103ab565b61030367ce85aa9d2c3b346f60c01b6103ab565b61031767a67a2a99274b0e2e60c01b6103ab565b6103218282610633565b5050565b61032d6103ae565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361039f5760006040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016103969190610ab8565b60405180910390fd5b6103a88161056f565b50565b50565b6103b66107eb565b73ffffffffffffffffffffffffffffffffffffffff166103d4610282565b73ffffffffffffffffffffffffffffffffffffffff1614610433576103f76107eb565b6040517f118cdaa700000000000000000000000000000000000000000000000000000000815260040161042a9190610ab8565b60405180910390fd5b565b6104496764be015b5435150460c01b6103ab565b61045d67aa09594afd3374db60c01b6103ab565b61047167f9d8f11da310298a60c01b6103ab565b61048567680284f6149ddc8960c01b6103ab565b60008251116104c9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104c090610b70565b60405180910390fd5b6104dd677f88416691296ea860c01b6103ab565b6104f1672879eb40cf6a710960c01b6103ab565b6105056758c98548ba1bce3c60c01b6103ab565b60005b825181101561056a5761052567f73dbeb9e22c08c960c01b6103ab565b610539671cfe47d17211a53560c01b6103ab565b61055d83828151811061054f5761054e610b90565b5b602002602001015183610633565b8080600101915050610508565b505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b61064767df86b3af466e0c5660c01b6103ab565b61065b671c5b40723b53000160c01b6103ab565b61066f676fbe4866e885a43f60c01b6103ab565b61068367261a6467614cffd960c01b6103ab565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036106f2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106e990610c0b565b60405180910390fd5b6107066780327ca72d02e27260c01b6103ab565b61071a673b7c6ad9c59a0c5260c01b6103ab565b80600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555061078567917a446627a4554d60c01b6103ab565b61079967c93907c889ddabbc60c01b6103ab565b8173ffffffffffffffffffffffffffffffffffffffff167f9f64376b4ce09200833c49794198c90facdc3856721f47e050d031d5b923438f826040516107df9190610a61565b60405180910390a25050565b600033905090565b6000604051905090565b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6108558261080c565b810181811067ffffffffffffffff821117156108745761087361081d565b5b80604052505050565b60006108876107f3565b9050610893828261084c565b919050565b600067ffffffffffffffff8211156108b3576108b261081d565b5b602082029050602081019050919050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006108f4826108c9565b9050919050565b610904816108e9565b811461090f57600080fd5b50565b600081359050610921816108fb565b92915050565b600061093a61093584610898565b61087d565b9050808382526020820190506020840283018581111561095d5761095c6108c4565b5b835b8181101561098657806109728882610912565b84526020840193505060208101905061095f565b5050509392505050565b600082601f8301126109a5576109a4610807565b5b81356109b5848260208601610927565b91505092915050565b60008115159050919050565b6109d3816109be565b81146109de57600080fd5b50565b6000813590506109f0816109ca565b92915050565b60008060408385031215610a0d57610a0c6107fd565b5b600083013567ffffffffffffffff811115610a2b57610a2a610802565b5b610a3785828601610990565b9250506020610a48858286016109e1565b9150509250929050565b610a5b816109be565b82525050565b6000602082019050610a766000830184610a52565b92915050565b600060208284031215610a9257610a916107fd565b5b6000610aa084828501610912565b91505092915050565b610ab2816108e9565b82525050565b6000602082019050610acd6000830184610aa9565b92915050565b60008060408385031215610aea57610ae96107fd565b5b6000610af885828601610912565b9250506020610b09858286016109e1565b9150509250929050565b600082825260208201905092915050565b7f496e76616c6964206c656e677468206e6674436f6e7472616374730000000000600082015250565b6000610b5a601b83610b13565b9150610b6582610b24565b602082019050919050565b60006020820190508181036000830152610b8981610b4d565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f6e6674436f6e7472616374206973207a65726f20616464726573730000000000600082015250565b6000610bf5601b83610b13565b9150610c0082610bbf565b602082019050919050565b60006020820190508181036000830152610c2481610be8565b905091905056fea26469706673582212206fcbc5fe220f2bbabcf5bffaa732510008c10a6f50a8833519f99716909d11ad64736f6c634300081c0033";

type PermittedNFTsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PermittedNFTsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PermittedNFTs__factory extends ContractFactory {
  constructor(...args: PermittedNFTsConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _admin: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_admin, overrides || {});
  }
  override deploy(
    _admin: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_admin, overrides || {}) as Promise<
      PermittedNFTs & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): PermittedNFTs__factory {
    return super.connect(runner) as PermittedNFTs__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PermittedNFTsInterface {
    return new Interface(_abi) as PermittedNFTsInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): PermittedNFTs {
    return new Contract(address, _abi, runner) as unknown as PermittedNFTs;
  }
}
