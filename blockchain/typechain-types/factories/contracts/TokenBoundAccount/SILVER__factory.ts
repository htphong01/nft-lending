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
  SILVER,
  SILVERInterface,
} from "../../../contracts/TokenBoundAccount/SILVER";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientAllowance",
    type: "error",
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
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientBalance",
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
    name: "ERC20InvalidApprover",
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
    name: "ERC20InvalidReceiver",
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
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSpender",
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
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
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
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Minted",
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
        indexed: false,
        internalType: "uint256",
        name: "value",
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
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
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
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
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
    name: "totalSupply",
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
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
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
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5060408051808201825260068082526529a4a62b22a960d11b602080840182905284518086019095529184529083015290600361004d8382610101565b50600461005a8282610101565b5050506101bf565b634e487b7160e01b600052604160045260246000fd5b600181811c9082168061008c57607f821691505b6020821081036100ac57634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156100fc57806000526020600020601f840160051c810160208510156100d95750805b601f840160051c820191505b818110156100f957600081556001016100e5565b50505b505050565b81516001600160401b0381111561011a5761011a610062565b61012e816101288454610078565b846100b2565b6020601f821160018114610162576000831561014a5750848201515b600019600385901b1c1916600184901b1784556100f9565b600084815260208120601f198516915b828110156101925787850151825560209485019460019092019101610172565b50848210156101b05786840151600019600387901b60f8161c191681555b50505050600190811b01905550565b6107cc806101ce6000396000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c806340c10f191161006657806340c10f191461011857806370a082311461012d57806395d89b4114610156578063a9059cbb1461015e578063dd62ed3e1461017157600080fd5b806306fdde03146100a3578063095ea7b3146100c157806318160ddd146100e457806323b872dd146100f6578063313ce56714610109575b600080fd5b6100ab6101aa565b6040516100b89190610615565b60405180910390f35b6100d46100cf36600461067f565b61023c565b60405190151581526020016100b8565b6002545b6040519081526020016100b8565b6100d46101043660046106a9565b610256565b604051601281526020016100b8565b61012b61012636600461067f565b61027a565b005b6100e861013b3660046106e6565b6001600160a01b031660009081526020819052604090205490565b6100ab6102ca565b6100d461016c36600461067f565b6102d9565b6100e861017f366004610708565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6060600380546101b99061073b565b80601f01602080910402602001604051908101604052809291908181526020018280546101e59061073b565b80156102325780601f1061020757610100808354040283529160200191610232565b820191906000526020600020905b81548152906001019060200180831161021557829003601f168201915b5050505050905090565b60003361024a8185856102e7565b60019150505b92915050565b6000336102648582856102f9565b61026f85858561037d565b506001949350505050565b61028482826103dc565b604080516001600160a01b0384168152602081018390527f30385c845b448a36257a6a1716e6ad2e1bc2cbe333cde1e69fe849ad6511adfe910160405180910390a15050565b6060600480546101b99061073b565b60003361024a81858561037d565b6102f48383836001610416565b505050565b6001600160a01b03838116600090815260016020908152604080832093861683529290522054600019811015610377578181101561036857604051637dc7a0d960e11b81526001600160a01b038416600482015260248101829052604481018390526064015b60405180910390fd5b61037784848484036000610416565b50505050565b6001600160a01b0383166103a757604051634b637e8f60e11b81526000600482015260240161035f565b6001600160a01b0382166103d15760405163ec442f0560e01b81526000600482015260240161035f565b6102f48383836104eb565b6001600160a01b0382166104065760405163ec442f0560e01b81526000600482015260240161035f565b610412600083836104eb565b5050565b6001600160a01b0384166104405760405163e602df0560e01b81526000600482015260240161035f565b6001600160a01b03831661046a57604051634a1406b160e11b81526000600482015260240161035f565b6001600160a01b038085166000908152600160209081526040808320938716835292905220829055801561037757826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040516104dd91815260200190565b60405180910390a350505050565b6001600160a01b03831661051657806002600082825461050b9190610775565b909155506105889050565b6001600160a01b038316600090815260208190526040902054818110156105695760405163391434e360e21b81526001600160a01b0385166004820152602481018290526044810183905260640161035f565b6001600160a01b03841660009081526020819052604090209082900390555b6001600160a01b0382166105a4576002805482900390556105c3565b6001600160a01b03821660009081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161060891815260200190565b60405180910390a3505050565b602081526000825180602084015260005b818110156106435760208186018101516040868401015201610626565b506000604082850101526040601f19601f83011684010191505092915050565b80356001600160a01b038116811461067a57600080fd5b919050565b6000806040838503121561069257600080fd5b61069b83610663565b946020939093013593505050565b6000806000606084860312156106be57600080fd5b6106c784610663565b92506106d560208501610663565b929592945050506040919091013590565b6000602082840312156106f857600080fd5b61070182610663565b9392505050565b6000806040838503121561071b57600080fd5b61072483610663565b915061073260208401610663565b90509250929050565b600181811c9082168061074f57607f821691505b60208210810361076f57634e487b7160e01b600052602260045260246000fd5b50919050565b8082018082111561025057634e487b7160e01b600052601160045260246000fdfea2646970667358221220e592e87c7220552a03c6aec4aea4be31d291c5823dd4415dd783f365bbf341ed64736f6c634300081c0033";

type SILVERConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SILVERConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SILVER__factory extends ContractFactory {
  constructor(...args: SILVERConstructorParams) {
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
      SILVER & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): SILVER__factory {
    return super.connect(runner) as SILVER__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SILVERInterface {
    return new Interface(_abi) as SILVERInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): SILVER {
    return new Contract(address, _abi, runner) as unknown as SILVER;
  }
}
