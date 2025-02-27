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
import type { NonPayableOverrides } from "../../../common";
import type {
  LendingPool,
  LendingPoolInterface,
} from "../../../contracts/LendingPool/LendingPool";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_initialOwner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "AdminUnauthorizedAccount",
    type: "error",
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
    inputs: [],
    name: "InvalidAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidLength",
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
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "PermissionUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "SafeERC20FailedOperation",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Disbursed",
    type: "event",
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
        indexed: true,
        internalType: "uint256",
        name: "nftTokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "ListNftToMarket",
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
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PaidBack",
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
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "allow",
        type: "bool",
      },
    ],
    name: "SetAdmin",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldValue",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newValue",
        type: "address",
      },
    ],
    name: "SetLendingStake",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldValue",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newValue",
        type: "address",
      },
    ],
    name: "SetLoan",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldValue",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newValue",
        type: "address",
      },
    ],
    name: "SetMarketplace",
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
        name: "",
        type: "address",
      },
    ],
    name: "admins",
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
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "approveToPayRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
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
    name: "informDisburse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_principal",
        type: "uint256",
      },
    ],
    name: "informPayBack",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "isAdmin",
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
    name: "lendingStake",
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
        name: "_nftContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_nftTokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "listNftToMarket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "loan",
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
    name: "marketplace",
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
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
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
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "uint256",
        name: "_nftTokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
    ],
    name: "rescueNft",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
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
    name: "rescueToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_allow",
        type: "bool",
      },
    ],
    name: "setAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_users",
        type: "address[]",
      },
      {
        internalType: "bool",
        name: "_allow",
        type: "bool",
      },
    ],
    name: "setAdmins",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_lendingStake",
        type: "address",
      },
    ],
    name: "setLendingStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_loan",
        type: "address",
      },
    ],
    name: "setLoan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_marketplace",
        type: "address",
      },
    ],
    name: "setMarketplace",
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
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_marketItemId",
        type: "uint256",
      },
    ],
    name: "withdrawNftFromMarket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161138238038061138283398101604081905261002f916100cd565b806001600160a01b03811661005e57604051631e4fbdf760e01b81526000600482015260240160405180910390fd5b6100678161007d565b50506002805460ff1916905560016003556100fd565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000602082840312156100df57600080fd5b81516001600160a01b03811681146100f657600080fd5b9392505050565b6112768061010c6000396000f3fe608060405234801561001057600080fd5b50600436106101585760003560e01c806371f3cd0d116100c3578063b5d10df91161007c578063b5d10df9146102e7578063baecd77f146102fa578063c85396bf1461030d578063d285b7b414610320578063e5711e8b14610333578063f2fde38b1461034657600080fd5b806371f3cd0d1461026e57806373ad6c2d146102815780638456cb5914610294578063885ef2901461029c5780638da5cb5b146102af578063abc8c7af146102d457600080fd5b8063429b62e511610115578063429b62e5146101ff57806345f34952146102225780634b0bddd2146102355780635c975abb14610248578063633a645d14610253578063715018a61461026657600080fd5b8063030e2c881461015d578063087f010e14610172578063150b7a021461018557806324d7806c146101c15780633f4ba83a146101e457806341f7b092146101ec575b600080fd5b61017061016b366004610f01565b610359565b005b610170610180366004610fcd565b6103bf565b6101a3610193366004610ff1565b630a85bd0160e11b949350505050565b6040516001600160e01b031990911681526020015b60405180910390f35b6101d46101cf366004610fcd565b610440565b60405190151581526020016101b8565b610170610491565b6101706101fa366004610fcd565b6104ab565b6101d461020d366004610fcd565b60016020526000908152604090205460ff1681565b6101706102303660046110ba565b61052c565b6101706102433660046110ef565b6106f4565b60025460ff166101d4565b610170610261366004611128565b61070a565b610170610774565b61017061027c36600461116a565b610786565b61017061028f366004610fcd565b610845565b6101706108c6565b6101706102aa366004611196565b6108de565b6000546001600160a01b03165b6040516001600160a01b0390911681526020016101b8565b6006546102bc906001600160a01b031681565b6005546102bc906001600160a01b031681565b6101706103083660046111af565b61097d565b61017061031b36600461116a565b610a77565b6004546102bc906001600160a01b031681565b6101706103413660046111af565b610afa565b610170610354366004610fcd565b610b3d565b610361610b7b565b81516000036103835760405163251f56a160e21b815260040160405180910390fd5b60005b82518110156103ba576103b28382815181106103a4576103a46111f0565b602002602001015183610ba8565b600101610386565b505050565b6103c7610b7b565b6001600160a01b0381166103ee5760405163e6c4247b60e01b815260040160405180910390fd5b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f4cef211b36a7ba1e9f8e51e9570b3cf4ed7cb4ae4f0aa087b09ce4b567b59aa490600090a35050565b6000816001600160a01b031661045e6000546001600160a01b031690565b6001600160a01b0316148061048b57506001600160a01b03821660009081526001602052604090205460ff165b92915050565b610499610b7b565b6104a1610c2e565b6104a9610c51565b565b6104b3610b7b565b6001600160a01b0381166104da5760405163e6c4247b60e01b815260040160405180910390fd5b600480546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f2868942214ddba6cd1a9accf5649fef678605050ad1c3c01b33c361dcb4e9c6290600090a35050565b610534610ca3565b6000546001600160a01b0316331480159061055f57503360009081526001602052604090205460ff16155b1561059057335b60405163342e52ad60e21b81526001600160a01b0390911660048201526024015b60405180910390fd5b60065460405163095ea7b360e01b81526001600160a01b039182166004820152602481018490529084169063095ea7b390604401600060405180830381600087803b1580156105de57600080fd5b505af11580156105f2573d6000803e3d6000fd5b505060065460055460408051635b0cb9c560e11b815290516001600160a01b03938416955063f4bc9a8a945088938893169163b619738a9160048083019260209291908290030181865afa15801561064e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106729190611206565b60055460405160e086901b6001600160e01b03191681526001600160a01b039485166004820152602481019390935290831660448301526064820186905291909116608482015260a4015b600060405180830381600087803b1580156106d757600080fd5b505af11580156106eb573d6000803e3d6000fd5b50505050505050565b6106fc610b7b565b6107068282610ba8565b5050565b610712610b7b565b6001600160a01b0381166107395760405163e6c4247b60e01b815260040160405180910390fd5b6040516323b872dd60e01b81523060048201526001600160a01b038281166024830152604482018490528416906323b872dd906064016106bd565b61077c610b7b565b6104a96000610cc7565b61078e610ca3565b6005546001600160a01b03163381146107c857335b604051637e6f22d960e01b81526001600160a01b039091166004820152602401610587565b60055460405163095ea7b360e01b81526001600160a01b039182166004820152602481018490529084169063095ea7b3906044016020604051808303816000875af115801561081b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061083f9190611223565b50505050565b61084d610b7b565b6001600160a01b0381166108745760405163e6c4247b60e01b815260040160405180910390fd5b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f22122696dd612fc8f6a7ed06a9e60a22e7fbae0cb347b5f47ab0a148cb8b2d6090600090a35050565b6108ce610b7b565b6108d6610ca3565b6104a9610d17565b6108e6610ca3565b6000546001600160a01b0316331480159061091157503360009081526001602052604090205460ff16155b1561091c5733610566565b60065460405163c2a5cbf160e01b8152600481018390526001600160a01b039091169063c2a5cbf190602401600060405180830381600087803b15801561096257600080fd5b505af1158015610976573d6000803e3d6000fd5b5050505050565b610985610d54565b61098d610ca3565b6004546001600160a01b03163381146109a657336107a3565b600554604051632dd67e5560e21b8152600481018490526001600160a01b039091169063b759f95490602401600060405180830381600087803b1580156109ec57600080fd5b505af1158015610a00573d6000803e3d6000fd5b5050600554610a1f92506001600160a01b038781169250168585610d7e565b826001600160a01b0316846001600160a01b03167fd1fdb060ebcebbe0f64716e26e573d67fd29e5ec9229ba5da5d1c361f6ef980884604051610a6491815260200190565b60405180910390a3506103ba6001600355565b610a7f610ca3565b6004546001600160a01b0316338114610a9857336107a3565b600554610ab2906001600160a01b03858116911684610de5565b826001600160a01b03167f86752b2eca38ca0c907c0f8fbbaa11559477b8e72e307c8bdc26b7c7b495789283604051610aed91815260200190565b60405180910390a2505050565b610b02610b7b565b6001600160a01b038216610b295760405163e6c4247b60e01b815260040160405180910390fd5b6103ba6001600160a01b0384168383610de5565b610b45610b7b565b6001600160a01b038116610b6f57604051631e4fbdf760e01b815260006004820152602401610587565b610b7881610cc7565b50565b6000546001600160a01b031633146104a95760405163118cdaa760e01b8152336004820152602401610587565b6001600160a01b038216610bcf5760405163e6c4247b60e01b815260040160405180910390fd5b6001600160a01b038216600081815260016020908152604091829020805460ff191685151590811790915591519182527f55a5194bc0174fcaf12b2978bef43911466bf63b34db8d1dd1a0d5dcd5c41bea910160405180910390a25050565b60025460ff166104a957604051638dfc202b60e01b815260040160405180910390fd5b610c59610c2e565b6002805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b60025460ff16156104a95760405163d93c066560e01b815260040160405180910390fd5b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b610d1f610ca3565b6002805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258610c863390565b600260035403610d7757604051633ee5aeb560e01b815260040160405180910390fd5b6002600355565b6040516001600160a01b03848116602483015283811660448301526064820183905261083f9186918216906323b872dd906084015b604051602081830303815290604052915060e01b6020820180516001600160e01b038381831617835250505050610e16565b6040516001600160a01b038381166024830152604482018390526103ba91859182169063a9059cbb90606401610db3565b600080602060008451602086016000885af180610e39576040513d6000823e3d81fd5b50506000513d91508115610e51578060011415610e5e565b6001600160a01b0384163b155b1561083f57604051635274afe760e01b81526001600160a01b0385166004820152602401610587565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff81118282101715610ec657610ec6610e87565b604052919050565b6001600160a01b0381168114610b7857600080fd5b8015158114610b7857600080fd5b8035610efc81610ee3565b919050565b60008060408385031215610f1457600080fd5b823567ffffffffffffffff811115610f2b57600080fd5b8301601f81018513610f3c57600080fd5b803567ffffffffffffffff811115610f5657610f56610e87565b8060051b610f6660208201610e9d565b91825260208184018101929081019088841115610f8257600080fd5b6020850194505b83851015610fb05784359250610f9e83610ece565b82825260209485019490910190610f89565b8096505050505050610fc460208401610ef1565b90509250929050565b600060208284031215610fdf57600080fd5b8135610fea81610ece565b9392505050565b6000806000806080858703121561100757600080fd5b843561101281610ece565b9350602085013561102281610ece565b925060408501359150606085013567ffffffffffffffff81111561104557600080fd5b8501601f8101871361105657600080fd5b803567ffffffffffffffff81111561107057611070610e87565b611083601f8201601f1916602001610e9d565b81815288602083850101111561109857600080fd5b8160208401602083013760006020838301015280935050505092959194509250565b6000806000606084860312156110cf57600080fd5b83356110da81610ece565b95602085013595506040909401359392505050565b6000806040838503121561110257600080fd5b823561110d81610ece565b9150602083013561111d81610ee3565b809150509250929050565b60008060006060848603121561113d57600080fd5b833561114881610ece565b925060208401359150604084013561115f81610ece565b809150509250925092565b6000806040838503121561117d57600080fd5b823561118881610ece565b946020939093013593505050565b6000602082840312156111a857600080fd5b5035919050565b6000806000606084860312156111c457600080fd5b83356111cf81610ece565b925060208401356111df81610ece565b929592945050506040919091013590565b634e487b7160e01b600052603260045260246000fd5b60006020828403121561121857600080fd5b8151610fea81610ece565b60006020828403121561123557600080fd5b8151610fea81610ee356fea26469706673582212206952032d5a420d8afe2eb78690d6cabec8f8597e2e3f46e0d1bc106ca0c9367464736f6c634300081c0033";

type LendingPoolConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: LendingPoolConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class LendingPool__factory extends ContractFactory {
  constructor(...args: LendingPoolConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _initialOwner: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_initialOwner, overrides || {});
  }
  override deploy(
    _initialOwner: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_initialOwner, overrides || {}) as Promise<
      LendingPool & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): LendingPool__factory {
    return super.connect(runner) as LendingPool__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): LendingPoolInterface {
    return new Interface(_abi) as LendingPoolInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): LendingPool {
    return new Contract(address, _abi, runner) as unknown as LendingPool;
  }
}
