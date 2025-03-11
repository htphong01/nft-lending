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
  BigNumberish,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  Marketplace,
  MarketplaceInterface,
} from "../../../contracts/Marketplace/Marketplace";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_initialOwner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_feeReceiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_feePercent",
        type: "uint256",
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
    name: "InvalidAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidBeneficiary",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidFeePercent",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidFeeReceiver",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidLength",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidNft",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidPrice",
    type: "error",
  },
  {
    inputs: [],
    name: "NotEnougnETH",
    type: "error",
  },
  {
    inputs: [],
    name: "NotExistedItem",
    type: "error",
  },
  {
    inputs: [],
    name: "NotOpeningItem",
    type: "error",
  },
  {
    inputs: [],
    name: "NotPermittedToken",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyItemOwner",
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
    inputs: [],
    name: "TransferNativeFailed",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "itemId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
    ],
    name: "BoughtItem",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "itemId",
        type: "uint256",
      },
    ],
    name: "ClosedItem",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "itemId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "itemId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "nft",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "paymentToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            internalType: "address",
            name: "beneficiary",
            type: "address",
          },
          {
            internalType: "enum IMarketplace.ItemStatus",
            name: "status",
            type: "uint8",
          },
        ],
        indexed: false,
        internalType: "struct Marketplace.Item",
        name: "item",
        type: "tuple",
      },
    ],
    name: "MakeItem",
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
        internalType: "uint256",
        name: "oldValue",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "newValue",
        type: "uint256",
      },
    ],
    name: "SetFeePercent",
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
    name: "SetFeeReceiver",
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
        internalType: "bool",
        name: "allow",
        type: "bool",
      },
    ],
    name: "SetPaymentToken",
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
        internalType: "uint256",
        name: "_itemId",
        type: "uint256",
      },
    ],
    name: "closeItem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "feePercent",
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
    name: "feeReceiver",
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
    name: "itemCount",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "items",
    outputs: [
      {
        internalType: "uint256",
        name: "itemId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "nft",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "paymentToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        internalType: "enum IMarketplace.ItemStatus",
        name: "status",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_nft",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_paymentToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_beneficiary",
        type: "address",
      },
    ],
    name: "makeItem",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "paymentToken",
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
        internalType: "uint256",
        name: "_itemId",
        type: "uint256",
      },
    ],
    name: "purchaseItem",
    outputs: [],
    stateMutability: "payable",
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
        internalType: "uint256",
        name: "_newValue",
        type: "uint256",
      },
    ],
    name: "setFeePercent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_feeReceiver",
        type: "address",
      },
    ],
    name: "setFeeReceiver",
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
        internalType: "bool",
        name: "allow",
        type: "bool",
      },
    ],
    name: "setPaymentToken",
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
  "0x608060405234801561001057600080fd5b5060405161161a38038061161a83398101604081905261002f91610103565b826001600160a01b03811661005e57604051631e4fbdf760e01b81526000600482015260240160405180910390fd5b61006781610097565b506001600255600380546001600160a01b0319166001600160a01b0393909316929092179091556004555061013f565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80516001600160a01b03811681146100fe57600080fd5b919050565b60008060006060848603121561011857600080fd5b610121846100e7565b925061012f602085016100e7565b9150604084015190509250925092565b6114cc8061014e6000396000f3fe6080604052600436106101145760003560e01c80637ce3489b116100a0578063c2a5cbf111610064578063c2a5cbf11461039e578063d38ea5bf146103be578063efdcd974146103d1578063f2fde38b146103f1578063f4bc9a8a1461041157600080fd5b80637ce3489b1461028d5780637fd6f15c146102ad5780638da5cb5b146102c3578063b3f00674146102f5578063bfb231d21461031557600080fd5b8063429b62e5116100e7578063429b62e5146101e4578063430884cf146102145780634b0bddd2146102345780636bfb0d0114610254578063715018a61461027857600080fd5b8063030e2c8814610119578063150b7a021461013b57806324d7806c14610184578063352cad4c146101b4575b600080fd5b34801561012557600080fd5b50610139610134366004611063565b610431565b005b34801561014757600080fd5b5061016661015636600461112a565b630a85bd0160e11b949350505050565b6040516001600160e01b031990911681526020015b60405180910390f35b34801561019057600080fd5b506101a461019f3660046111ef565b610497565b604051901515815260200161017b565b3480156101c057600080fd5b506101a46101cf3660046111ef565b60066020526000908152604090205460ff1681565b3480156101f057600080fd5b506101a46101ff3660046111ef565b60016020526000908152604090205460ff1681565b34801561022057600080fd5b5061013961022f366004611211565b6104e8565b34801561024057600080fd5b5061013961024f366004611211565b6105a4565b34801561026057600080fd5b5061026a60055481565b60405190815260200161017b565b34801561028457600080fd5b506101396105ba565b34801561029957600080fd5b506101396102a836600461123b565b6105ce565b3480156102b957600080fd5b5061026a60045481565b3480156102cf57600080fd5b506000546001600160a01b03165b6040516001600160a01b03909116815260200161017b565b34801561030157600080fd5b506003546102dd906001600160a01b031681565b34801561032157600080fd5b5061038a61033036600461123b565b600760205260009081526040902080546001820154600283015460038401546004850154600586015460069096015494956001600160a01b039485169593949293918316929081169190811690600160a01b900460ff1688565b60405161017b98979695949392919061128c565b3480156103aa57600080fd5b506101396103b936600461123b565b610660565b6101396103cc36600461123b565b6107ac565b3480156103dd57600080fd5b506101396103ec3660046111ef565b6109e4565b3480156103fd57600080fd5b5061013961040c3660046111ef565b610a93565b34801561041d57600080fd5b5061013961042c3660046112e3565b610ace565b610439610d6d565b815160000361045b5760405163251f56a160e21b815260040160405180910390fd5b60005b82518110156104925761048a83828151811061047c5761047c61133a565b602002602001015183610d9a565b60010161045e565b505050565b6000816001600160a01b03166104b56000546001600160a01b031690565b6001600160a01b031614806104e257506001600160a01b03821660009081526001602052604090205460ff165b92915050565b6000546001600160a01b0316331480159061051357503360009081526001602052604090205460ff16155b1561054457335b60405163342e52ad60e21b81526001600160a01b0390911660048201526024015b60405180910390fd5b6001600160a01b038216600081815260066020908152604091829020805460ff191685151590811790915591519182527ffb2da8463afca3d57657a0d7cbeee4ade8c3596d1b1bca20e4795db47975910f91015b60405180910390a25050565b6105ac610d6d565b6105b68282610d9a565b5050565b6105c2610d6d565b6105cc6000610e19565b565b6000546001600160a01b031633148015906105f957503360009081526001602052604090205460ff16155b15610604573361051a565b61271081111561062757604051638a81d3b360e01b815260040160405180910390fd5b6004805490829055604051829082907fcac7ae1d1255aea95e441a82c3ad5ab3f4dd8533f5fa0b5c1cd662a965c4049090600090a35050565b60008181526007602052604081208054909103610690576040516362a64d3f60e11b815260040160405180910390fd5b60006006820154600160a01b900460ff1660028111156106b2576106b2611254565b146106d05760405163c06f3ae560e01b815260040160405180910390fd5b60058101546001600160a01b031633146106fd5760405163696fdefd60e01b815260040160405180910390fd5b60068101805460ff60a01b1916600160a11b179055600181015460028201546040516323b872dd60e01b81526001600160a01b03909216916323b872dd9161074b9130913391600401611350565b600060405180830381600087803b15801561076557600080fd5b505af1158015610779573d6000803e3d6000fd5b50506040518492507f172f7f76c8f2073cb3fecdb933dd6f203e840f86e314baf671d446242e5db17a9150600090a25050565b6107b4610e69565b600081815260076020526040812080549091036107e4576040516362a64d3f60e11b815260040160405180910390fd5b60006006820154600160a01b900460ff16600281111561080657610806611254565b146108245760405163c06f3ae560e01b815260040160405180910390fd5b60068101805460ff60a01b1916600160a01b179055600454600382015460009161271091610852919061138a565b61085c91906113a1565b9050600081836003015461087091906113c3565b60048401549091506001600160a01b03166108e257826003015434146108a957604051632646672b60e21b815260040160405180910390fd5b81156108c5576003546108c5906001600160a01b031683610e91565b60068301546108dd906001600160a01b031682610e91565b61092a565b8115610908576109083360035460048601546001600160a01b0390811692911685610f1f565b61092a33600685015460048601546001600160a01b0390811692911684610f1f565b600183015460028401546040516323b872dd60e01b81526001600160a01b03909216916323b872dd916109639130913391600401611350565b600060405180830381600087803b15801561097d57600080fd5b505af1158015610991573d6000803e3d6000fd5b5050505061099c3390565b83546040516001600160a01b0392909216917f765c0890e48b353869e7e9c09b461c1525ff227b87af46875799580299d026eb90600090a35050506109e16001600255565b50565b6000546001600160a01b03163314801590610a0f57503360009081526001602052604090205460ff16155b15610a1a573361051a565b6001600160a01b038116610a4157604051633480121760e21b815260040160405180910390fd5b600380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f1b092cca381ac00a07e1226c164f47c475d212f5e55699475a7f411811f77dd490600090a35050565b610a9b610d6d565b6001600160a01b038116610ac557604051631e4fbdf760e01b81526000600482015260240161053b565b6109e181610e19565b6001600160a01b038516610af5576040516307f903ab60e11b815260040160405180910390fd5b6001600160a01b03831660009081526006602052604090205460ff16610b2e57604051631dff075f60e01b815260040160405180910390fd5b81600003610b4e5760405162bfc92160e01b815260040160405180910390fd5b6001600160a01b038116610b7557604051631559b7d760e21b815260040160405180910390fd5b60058054906000610b85836113d6565b91905055506040518061010001604052806005548152602001866001600160a01b03168152602001858152602001838152602001846001600160a01b03168152602001610bcf3390565b6001600160a01b03908116825283166020820152604001600090526005805460009081526007602090815260409182902084518155908401516001820180546001600160a01b03199081166001600160a01b039384161790915592850151600280840191909155606086015160038401556080860151600484018054861691841691909117905560a0860151948301805485169583169590951790945560c085015160068301805494851691909216908117825560e08601519294929391926001600160a81b03199092161790600160a01b908490811115610cb357610cb3611254565b0217905550506040516323b872dd60e01b81526001600160a01b03871691506323b872dd90610cea90339030908990600401611350565b600060405180830381600087803b158015610d0457600080fd5b505af1158015610d18573d6000803e3d6000fd5b50506005546000818152600760205260409081902090519193507f7c55c43225b6c2fab27caed6de6b1309f9cf0917e4df484ad89afa318ca0d3649250610d5e916113ef565b60405180910390a25050505050565b6000546001600160a01b031633146105cc5760405163118cdaa760e01b815233600482015260240161053b565b6001600160a01b038216610dc15760405163e6c4247b60e01b815260040160405180910390fd5b6001600160a01b038216600081815260016020908152604091829020805460ff191685151590811790915591519182527f55a5194bc0174fcaf12b2978bef43911466bf63b34db8d1dd1a0d5dcd5c41bea9101610598565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6002805403610e8b57604051633ee5aeb560e01b815260040160405180910390fd5b60028055565b604080516000808252602082019092526001600160a01b038416908390604051610ebb9190611467565b60006040518083038185875af1925050503d8060008114610ef8576040519150601f19603f3d011682016040523d82523d6000602084013e610efd565b606091505b505090508061049257604051635835233d60e11b815260040160405180910390fd5b610f7984856001600160a01b03166323b872dd868686604051602401610f4793929190611350565b604051602081830303815290604052915060e01b6020820180516001600160e01b038381831617835250505050610f7f565b50505050565b600080602060008451602086016000885af180610fa2576040513d6000823e3d81fd5b50506000513d91508115610fba578060011415610fc7565b6001600160a01b0384163b155b15610f7957604051635274afe760e01b81526001600160a01b038516600482015260240161053b565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff8111828210171561102f5761102f610ff0565b604052919050565b80356001600160a01b038116811461104e57600080fd5b919050565b8035801515811461104e57600080fd5b6000806040838503121561107657600080fd5b823567ffffffffffffffff81111561108d57600080fd5b8301601f8101851361109e57600080fd5b803567ffffffffffffffff8111156110b8576110b8610ff0565b8060051b6110c860208201611006565b918252602081840181019290810190888411156110e457600080fd5b6020850194505b8385101561110d576110fc85611037565b8252602094850194909101906110eb565b809650505050505061112160208401611053565b90509250929050565b6000806000806080858703121561114057600080fd5b61114985611037565b935061115760208601611037565b925060408501359150606085013567ffffffffffffffff81111561117a57600080fd5b8501601f8101871361118b57600080fd5b803567ffffffffffffffff8111156111a5576111a5610ff0565b6111b8601f8201601f1916602001611006565b8181528860208385010111156111cd57600080fd5b8160208401602083013760006020838301015280935050505092959194509250565b60006020828403121561120157600080fd5b61120a82611037565b9392505050565b6000806040838503121561122457600080fd5b61122d83611037565b915061112160208401611053565b60006020828403121561124d57600080fd5b5035919050565b634e487b7160e01b600052602160045260246000fd5b6003811061128857634e487b7160e01b600052602160045260246000fd5b9052565b8881526001600160a01b0388811660208301526040820188905260608201879052858116608083015284811660a0830152831660c082015261010081016112d660e083018461126a565b9998505050505050505050565b600080600080600060a086880312156112fb57600080fd5b61130486611037565b94506020860135935061131960408701611037565b92506060860135915061132e60808701611037565b90509295509295909350565b634e487b7160e01b600052603260045260246000fd5b6001600160a01b039384168152919092166020820152604081019190915260600190565b634e487b7160e01b600052601160045260246000fd5b80820281158282048414176104e2576104e2611374565b6000826113be57634e487b7160e01b600052601260045260246000fd5b500490565b818103818111156104e2576104e2611374565b6000600182016113e8576113e8611374565b5060010190565b8154815260018201546001600160a01b03908116602083015260028301546040830152600383015460608301526004830154811660808301526005830154811660a080840191909152600684015491821660c0840152610100830191906114609060e085019083901c60ff1661126a565b5092915050565b6000825160005b81811015611488576020818601810151858301520161146e565b50600092019182525091905056fea26469706673582212202b27066cd53aa8177ccc08f8a1a21b6c606aaa1b15ef3de8fb36f90f86edbc7d64736f6c634300081c0033";

type MarketplaceConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MarketplaceConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Marketplace__factory extends ContractFactory {
  constructor(...args: MarketplaceConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _initialOwner: AddressLike,
    _feeReceiver: AddressLike,
    _feePercent: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      _initialOwner,
      _feeReceiver,
      _feePercent,
      overrides || {}
    );
  }
  override deploy(
    _initialOwner: AddressLike,
    _feeReceiver: AddressLike,
    _feePercent: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      _initialOwner,
      _feeReceiver,
      _feePercent,
      overrides || {}
    ) as Promise<
      Marketplace & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Marketplace__factory {
    return super.connect(runner) as Marketplace__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MarketplaceInterface {
    return new Interface(_abi) as MarketplaceInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Marketplace {
    return new Contract(address, _abi, runner) as unknown as Marketplace;
  }
}
