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
import type { NonPayableOverrides } from "../../common";
import type {
  ChonkSociety,
  ChonkSocietyInterface,
} from "../../contracts/ChonkSociety";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_baseURI",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ERC721IncorrectOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ERC721InsufficientApproval",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC721InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "ERC721InvalidOperator",
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
    name: "ERC721InvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC721InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC721InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ERC721NonexistentToken",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_fromTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_toTokenId",
        type: "uint256",
      },
    ],
    name: "BatchMetadataUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "MetadataUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "baseExtension",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "baseURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
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
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
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
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
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
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenIds",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60a060405260006080908152600890610018908261015b565b5034801561002557600080fd5b5060405161149038038061149083398101604081905261004491610219565b6040518060400160405280600d81526020016c43686f6e6b20536f636965747960981b8152506040518060400160405280600581526020016443484f4e4b60d81b8152508160009081610097919061015b565b5060016100a4828261015b565b50600891506100b59050828261015b565b50506102e5565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806100e657607f821691505b60208210810361010657634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111561015657806000526020600020601f840160051c810160208510156101335750805b601f840160051c820191505b81811015610153576000815560010161013f565b50505b505050565b81516001600160401b03811115610174576101746100bc565b6101888161018284546100d2565b8461010c565b6020601f8211600181146101bc57600083156101a45750848201515b600019600385901b1c1916600184901b178455610153565b600084815260208120601f198516915b828110156101ec57878501518255602094850194600190920191016101cc565b508482101561020a5786840151600019600387901b60f8161c191681555b50505050600190811b01905550565b60006020828403121561022b57600080fd5b81516001600160401b0381111561024157600080fd5b8201601f8101841361025257600080fd5b80516001600160401b0381111561026b5761026b6100bc565b604051601f8201601f19908116603f011681016001600160401b0381118282101715610299576102996100bc565b6040528181528282016020018610156102b157600080fd5b60005b828110156102d0576020818501810151838301820152016102b4565b50600091810160200191909152949350505050565b61119c806102f46000396000f3fe608060405234801561001057600080fd5b506004361061010b5760003560e01c80636c0360eb116100a2578063a22cb46511610071578063a22cb46514610213578063b88d4fde14610226578063c668286214610239578063c87b56dd1461025d578063e985e9c51461027057600080fd5b80636c0360eb146101d957806370a08231146101e1578063714cff561461020257806395d89b411461020b57600080fd5b806323b872dd116100de57806323b872dd1461018d57806340c10f19146101a057806342842e0e146101b35780636352211e146101c657600080fd5b806301ffc9a71461011057806306fdde0314610138578063081812fc1461014d578063095ea7b314610178575b600080fd5b61012361011e366004610d3e565b610283565b60405190151581526020015b60405180910390f35b6101406102ae565b60405161012f9190610db2565b61016061015b366004610dc5565b610340565b6040516001600160a01b03909116815260200161012f565b61018b610186366004610dfa565b610369565b005b61018b61019b366004610e24565b610378565b61018b6101ae366004610dfa565b610408565b61018b6101c1366004610e24565b610441565b6101606101d4366004610dc5565b61045c565b610140610467565b6101f46101ef366004610e61565b6104f5565b60405190815260200161012f565b6101f460075481565b61014061053d565b61018b610221366004610e7c565b61054c565b61018b610234366004610ece565b610557565b61014060405180604001604052806005815260200164173539b7b760d91b81525081565b61014061026b366004610dc5565b61056f565b61012361027e366004610fb2565b6105cc565b60006001600160e01b03198216632483248360e11b14806102a857506102a8826105fa565b92915050565b6060600080546102bd90610fe5565b80601f01602080910402602001604051908101604052809291908181526020018280546102e990610fe5565b80156103365780601f1061030b57610100808354040283529160200191610336565b820191906000526020600020905b81548152906001019060200180831161031957829003601f168201915b5050505050905090565b600061034b8261064a565b506000828152600460205260409020546001600160a01b03166102a8565b610374828233610683565b5050565b6001600160a01b0382166103a757604051633250574960e11b8152600060048201526024015b60405180910390fd5b60006103b4838333610690565b9050836001600160a01b0316816001600160a01b031614610402576040516364283d7b60e01b81526001600160a01b038086166004830152602482018490528216604482015260640161039e565b50505050565b60005b8181101561043c57600780549060006104238361101f565b919050555061043483600754610789565b60010161040b565b505050565b61043c83838360405180602001604052806000815250610557565b60006102a88261064a565b6008805461047490610fe5565b80601f01602080910402602001604051908101604052809291908181526020018280546104a090610fe5565b80156104ed5780601f106104c2576101008083540402835291602001916104ed565b820191906000526020600020905b8154815290600101906020018083116104d057829003601f168201915b505050505081565b60006001600160a01b038216610521576040516322718ad960e21b81526000600482015260240161039e565b506001600160a01b031660009081526003602052604090205490565b6060600180546102bd90610fe5565b6103743383836107a3565b610562848484610378565b6104023385858585610842565b606061057a8261064a565b5060086105868361096d565b60405180604001604052806005815260200164173539b7b760d91b8152506040516020016105b693929190611062565b6040516020818303038152906040529050919050565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b60006001600160e01b031982166380ac58cd60e01b148061062b57506001600160e01b03198216635b5e139f60e01b145b806102a857506301ffc9a760e01b6001600160e01b03198316146102a8565b6000818152600260205260408120546001600160a01b0316806102a857604051637e27328960e01b81526004810184905260240161039e565b61043c8383836001610a00565b6000828152600260205260408120546001600160a01b03908116908316156106bd576106bd818486610b06565b6001600160a01b038116156106fb576106da600085600080610a00565b6001600160a01b038116600090815260036020526040902080546000190190555b6001600160a01b0385161561072a576001600160a01b0385166000908152600360205260409020805460010190555b60008481526002602052604080822080546001600160a01b0319166001600160a01b0389811691821790925591518793918516917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4949350505050565b610374828260405180602001604052806000815250610b6a565b6001600160a01b0382166107d557604051630b61174360e31b81526001600160a01b038316600482015260240161039e565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6001600160a01b0383163b1561096657604051630a85bd0160e11b81526001600160a01b0384169063150b7a0290610884908890889087908790600401611116565b6020604051808303816000875af19250505080156108bf575060408051601f3d908101601f191682019092526108bc91810190611149565b60015b610928573d8080156108ed576040519150601f19603f3d011682016040523d82523d6000602084013e6108f2565b606091505b50805160000361092057604051633250574960e11b81526001600160a01b038516600482015260240161039e565b805181602001fd5b6001600160e01b03198116630a85bd0160e11b1461096457604051633250574960e11b81526001600160a01b038516600482015260240161039e565b505b5050505050565b6060600061097a83610b82565b600101905060008167ffffffffffffffff81111561099a5761099a610eb8565b6040519080825280601f01601f1916602001820160405280156109c4576020820181803683370190505b5090508181016020015b600019016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a85049450846109ce57509392505050565b8080610a1457506001600160a01b03821615155b15610ad6576000610a248461064a565b90506001600160a01b03831615801590610a505750826001600160a01b0316816001600160a01b031614155b8015610a635750610a6181846105cc565b155b15610a8c5760405163a9fbf51f60e01b81526001600160a01b038416600482015260240161039e565b8115610ad45783856001600160a01b0316826001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45b505b5050600090815260046020526040902080546001600160a01b0319166001600160a01b0392909216919091179055565b610b11838383610c5a565b61043c576001600160a01b038316610b3f57604051637e27328960e01b81526004810182905260240161039e565b60405163177e802f60e01b81526001600160a01b03831660048201526024810182905260440161039e565b610b748383610cc0565b61043c336000858585610842565b60008072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b8310610bc15772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef81000000008310610bed576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc100008310610c0b57662386f26fc10000830492506010015b6305f5e1008310610c23576305f5e100830492506008015b6127108310610c3757612710830492506004015b60648310610c49576064830492506002015b600a83106102a85760010192915050565b60006001600160a01b03831615801590610cb85750826001600160a01b0316846001600160a01b03161480610c945750610c9484846105cc565b80610cb857506000828152600460205260409020546001600160a01b038481169116145b949350505050565b6001600160a01b038216610cea57604051633250574960e11b81526000600482015260240161039e565b6000610cf883836000610690565b90506001600160a01b0381161561043c576040516339e3563760e11b81526000600482015260240161039e565b6001600160e01b031981168114610d3b57600080fd5b50565b600060208284031215610d5057600080fd5b8135610d5b81610d25565b9392505050565b60005b83811015610d7d578181015183820152602001610d65565b50506000910152565b60008151808452610d9e816020860160208601610d62565b601f01601f19169290920160200192915050565b602081526000610d5b6020830184610d86565b600060208284031215610dd757600080fd5b5035919050565b80356001600160a01b0381168114610df557600080fd5b919050565b60008060408385031215610e0d57600080fd5b610e1683610dde565b946020939093013593505050565b600080600060608486031215610e3957600080fd5b610e4284610dde565b9250610e5060208501610dde565b929592945050506040919091013590565b600060208284031215610e7357600080fd5b610d5b82610dde565b60008060408385031215610e8f57600080fd5b610e9883610dde565b915060208301358015158114610ead57600080fd5b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b60008060008060808587031215610ee457600080fd5b610eed85610dde565b9350610efb60208601610dde565b925060408501359150606085013567ffffffffffffffff811115610f1e57600080fd5b8501601f81018713610f2f57600080fd5b803567ffffffffffffffff811115610f4957610f49610eb8565b604051601f8201601f19908116603f0116810167ffffffffffffffff81118282101715610f7857610f78610eb8565b604052818152828201602001891015610f9057600080fd5b8160208401602083013760006020838301015280935050505092959194509250565b60008060408385031215610fc557600080fd5b610fce83610dde565b9150610fdc60208401610dde565b90509250929050565b600181811c90821680610ff957607f821691505b60208210810361101957634e487b7160e01b600052602260045260246000fd5b50919050565b60006001820161103f57634e487b7160e01b600052601160045260246000fd5b5060010190565b60008151611058818560208601610d62565b9290920192915050565b6000808554818160011c9050600182168061107e57607f821691505b60208210810361109c57634e487b7160e01b84526022600452602484fd5b8080156110b057600181146110c5576110f5565b60ff19841687528215158302870194506110f5565b60008a81526020902060005b848110156110ed578154898201526001909101906020016110d1565b505082870194505b5050505061110c6111068287611046565b85611046565b9695505050505050565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061110c90830184610d86565b60006020828403121561115b57600080fd5b8151610d5b81610d2556fea2646970667358221220f9584514a0621ee813b83ccec2ad2f4fefb2c1b0fc9e90144dfd46c40b1cb25664736f6c634300081c0033";

type ChonkSocietyConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ChonkSocietyConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ChonkSociety__factory extends ContractFactory {
  constructor(...args: ChonkSocietyConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _baseURI: string,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_baseURI, overrides || {});
  }
  override deploy(
    _baseURI: string,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_baseURI, overrides || {}) as Promise<
      ChonkSociety & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ChonkSociety__factory {
    return super.connect(runner) as ChonkSociety__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ChonkSocietyInterface {
    return new Interface(_abi) as ChonkSocietyInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ChonkSociety {
    return new Contract(address, _abi, runner) as unknown as ChonkSociety;
  }
}
