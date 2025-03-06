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
  NFTfiSigningUtils,
  NFTfiSigningUtilsInterface,
} from "../../../contracts/utils/NFTfiSigningUtils";

const _abi = [
  {
    inputs: [],
    name: "getChainID",
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
        internalType: "bytes32",
        name: "_loanId",
        type: "bytes32",
      },
      {
        internalType: "uint32",
        name: "_newLoanDuration",
        type: "uint32",
      },
      {
        internalType: "uint256",
        name: "_newMaximumRepaymentAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_renegotiationFee",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "principalAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maximumRepaymentAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "nftCollateralId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "erc20Denomination",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "duration",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "adminFeeInBasisPoints",
            type: "uint16",
          },
          {
            internalType: "uint64",
            name: "loanStartTime",
            type: "uint64",
          },
          {
            internalType: "address",
            name: "nftCollateralContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "borrower",
            type: "address",
          },
          {
            internalType: "address",
            name: "lender",
            type: "address",
          },
          {
            internalType: "bool",
            name: "useLendingPool",
            type: "bool",
          },
        ],
        internalType: "struct LoanData.LoanTerms",
        name: "_loan",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expiry",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        internalType: "struct LoanData.Signature",
        name: "_signature",
        type: "tuple",
      },
    ],
    name: "isValidLenderRenegotiationSignature",
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
        internalType: "bytes32",
        name: "_loanId",
        type: "bytes32",
      },
      {
        internalType: "uint32",
        name: "_newLoanDuration",
        type: "uint32",
      },
      {
        internalType: "uint256",
        name: "_newMaximumRepaymentAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_renegotiationFee",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "principalAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maximumRepaymentAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "nftCollateralId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "erc20Denomination",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "duration",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "adminFeeInBasisPoints",
            type: "uint16",
          },
          {
            internalType: "uint64",
            name: "loanStartTime",
            type: "uint64",
          },
          {
            internalType: "address",
            name: "nftCollateralContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "borrower",
            type: "address",
          },
          {
            internalType: "address",
            name: "lender",
            type: "address",
          },
          {
            internalType: "bool",
            name: "useLendingPool",
            type: "bool",
          },
        ],
        internalType: "struct LoanData.LoanTerms",
        name: "_loan",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expiry",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        internalType: "struct LoanData.Signature",
        name: "_signature",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "_loanContract",
        type: "address",
      },
    ],
    name: "isValidLenderRenegotiationSignature",
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
        components: [
          {
            internalType: "uint256",
            name: "principalAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maximumRepaymentAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "nftCollateralId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "nftCollateralContract",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "duration",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "adminFeeInBasisPoints",
            type: "uint16",
          },
          {
            internalType: "address",
            name: "erc20Denomination",
            type: "address",
          },
          {
            internalType: "address",
            name: "lendingPool",
            type: "address",
          },
        ],
        internalType: "struct LoanData.Offer",
        name: "_offer",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expiry",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        internalType: "struct LoanData.Signature",
        name: "_signature",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "_loanContract",
        type: "address",
      },
    ],
    name: "isValidLenderSignature",
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
        components: [
          {
            internalType: "uint256",
            name: "principalAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maximumRepaymentAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "nftCollateralId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "nftCollateralContract",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "duration",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "adminFeeInBasisPoints",
            type: "uint16",
          },
          {
            internalType: "address",
            name: "erc20Denomination",
            type: "address",
          },
          {
            internalType: "address",
            name: "lendingPool",
            type: "address",
          },
        ],
        internalType: "struct LoanData.Offer",
        name: "_offer",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expiry",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        internalType: "struct LoanData.Signature",
        name: "_signature",
        type: "tuple",
      },
    ],
    name: "isValidLenderSignature",
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
] as const;

const _bytecode =
  "0x610f4a610039600b82828239805160001a607314602c57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600436106100615760003560e01c8063564b81ef146100665780636ab81ec014610079578063af11d6c91461009c578063bf9bbe95146100af578063eb2ac63f146100c2575b600080fd5b6040514681526020015b60405180910390f35b61008c610087366004610ada565b6100d5565b6040519015158152602001610070565b61008c6100aa366004610c39565b6102ff565b61008c6100bd366004610cb6565b61031b565b61008c6100d0366004610d46565b610510565b600082602001514211156101305760405162461bcd60e51b815260206004820152601c60248201527f4c656e646572205369676e61747572652068617320657870697265640000000060448201526064015b60405180910390fd5b6001600160a01b03821661017d5760405162461bcd60e51b81526020600482015260146024820152734c6f616e206973207a65726f206164647265737360601b6044820152606401610127565b60408301516001600160a01b0316610197575060006102f8565b60e08401516001600160a01b03161561026a5760e08401516040808501519051630935e01b60e21b81526001600160a01b0391821660048201529116906324d7806c90602401602060405180830381865afa1580156101fa573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061021e9190610d97565b61026a5760405162461bcd60e51b815260206004820152601d60248201527f5369676e6174757265207369676e6572206973206e6f742061646d696e0000006044820152606401610127565b60006102758561051d565b61027e856105d7565b84466040516020016102939493929190610dd8565b6040516020818303038152906040528051906020012090506102f484604001516102ea837f19457468657265756d205369676e6564204d6573736167653a0a3332000000006000908152601c91909152603c902090565b866060015161061a565b9150505b9392505050565b60006103108787878787873061031b565b979650505050505050565b6000826020015142111561037d5760405162461bcd60e51b815260206004820152602360248201527f52656e65676f74696174696f6e205369676e61747572652068617320657870696044820152621c995960ea1b6064820152608401610127565b6001600160a01b0382166103ca5760405162461bcd60e51b81526020600482015260146024820152734c6f616e206973207a65726f206164647265737360601b6044820152606401610127565b8361014001511561045b576101208401516040808501519051630935e01b60e21b81526001600160a01b0391821660048201529116906324d7806c90602401602060405180830381865afa158015610426573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061044a9190610d97565b61045657506000610310565b610485565b8361012001516001600160a01b031683604001516001600160a01b03161461048557506000610310565b600088888888610494886105d7565b87466040516020016104ac9796959493929190610e23565b60405160208183030381529060405280519060200120905061050384604001516102ea837f19457468657265756d205369676e6564204d6573736167653a0a3332000000006000908152601c91909152603c902090565b9998505050505050505050565b60006102f88383306100d5565b60608160c00151826000015183602001518460600151856040015186608001518760a001518860e001516040516020016105c1989796959493929190606098891b6001600160601b031990811682526014820198909852603481019690965293871b86166054860152606885019290925260e01b6001600160e01b031916608884015260f01b6001600160f01b031916608c83015290921b16608e82015260a20190565b6040516020818303038152906040529050919050565b60608160400151826000015183602001516040516020016105c19392919060609390931b6001600160601b03191683526014830191909152603482015260540190565b6000836001600160a01b03163b60000361067c5760008061063b858561068e565b509092509050600081600381111561065557610655610e8f565b1480156106735750856001600160a01b0316826001600160a01b0316145b925050506102f8565b6106878484846106db565b90506102f8565b600080600083516041036106c85760208401516040850151606086015160001a6106ba888285856107b7565b9550955095505050506106d4565b50508151600091506002905b9250925092565b6000806000856001600160a01b031685856040516024016106fd929190610ea5565b60408051601f198184030181529181526020820180516001600160e01b0316630b135d3f60e11b179052516107329190610edf565b600060405180830381855afa9150503d806000811461076d576040519150601f19603f3d011682016040523d82523d6000602084013e610772565b606091505b509150915081801561078657506020815110155b80156107ad57508051630b135d3f60e11b906107ab9083016020908101908401610efb565b145b9695505050505050565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08411156107f2575060009150600390508261087c565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa158015610846573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166108725750600092506001915082905061087c565b9250600091508190505b9450945094915050565b634e487b7160e01b600052604160045260246000fd5b604051610100810167ffffffffffffffff811182821017156108c0576108c0610886565b60405290565b6040516080810167ffffffffffffffff811182821017156108c0576108c0610886565b604051610160810167ffffffffffffffff811182821017156108c0576108c0610886565b604051601f8201601f1916810167ffffffffffffffff8111828210171561093657610936610886565b604052919050565b80356001600160a01b038116811461095557600080fd5b919050565b803563ffffffff8116811461095557600080fd5b803561ffff8116811461095557600080fd5b6000610100828403121561099357600080fd5b61099b61089c565b82358152602080840135908201526040808401359082015290506109c16060830161093e565b60608201526109d26080830161095a565b60808201526109e360a0830161096e565b60a08201526109f460c0830161093e565b60c0820152610a0560e0830161093e565b60e082015292915050565b600060808284031215610a2257600080fd5b610a2a6108c6565b82358152602080840135908201529050610a466040830161093e565b6040820152606082013567ffffffffffffffff811115610a6557600080fd5b8201601f81018413610a7657600080fd5b803567ffffffffffffffff811115610a9057610a90610886565b610aa3601f8201601f191660200161090d565b818152856020838501011115610ab857600080fd5b8160208401602083013760006020838301015280606085015250505092915050565b60008060006101408486031215610af057600080fd5b610afa8585610980565b925061010084013567ffffffffffffffff811115610b1757600080fd5b610b2386828701610a10565b925050610b33610120850161093e565b90509250925092565b803567ffffffffffffffff8116811461095557600080fd5b8015158114610b6257600080fd5b50565b803561095581610b54565b60006101608284031215610b8357600080fd5b610b8b6108e9565b8235815260208084013590820152604080840135908201529050610bb16060830161093e565b6060820152610bc26080830161095a565b6080820152610bd360a0830161096e565b60a0820152610be460c08301610b3c565b60c0820152610bf560e0830161093e565b60e0820152610c07610100830161093e565b610100820152610c1a610120830161093e565b610120820152610c2d6101408301610b65565b61014082015292915050565b6000806000806000806102008789031215610c5357600080fd5b86359550610c636020880161095a565b94506040870135935060608701359250610c808860808901610b70565b91506101e087013567ffffffffffffffff811115610c9d57600080fd5b610ca989828a01610a10565b9150509295509295509295565b6000806000806000806000610220888a031215610cd257600080fd5b87359650610ce26020890161095a565b95506040880135945060608801359350610cff8960808a01610b70565b92506101e088013567ffffffffffffffff811115610d1c57600080fd5b610d288a828b01610a10565b925050610d38610200890161093e565b905092959891949750929550565b6000806101208385031215610d5a57600080fd5b610d648484610980565b915061010083013567ffffffffffffffff811115610d8157600080fd5b610d8d85828601610a10565b9150509250929050565b600060208284031215610da957600080fd5b81516102f881610b54565b60005b83811015610dcf578181015183820152602001610db7565b50506000910152565b60008551610dea818460208a01610db4565b855190830190610dfe818360208a01610db4565b60609590951b6001600160601b03191694019384525050601482015260340192915050565b87815263ffffffff60e01b8760e01b16602082015285602482015284604482015260008451610e59816064850160208901610db4565b80830190506bffffffffffffffffffffffff198560601b1660648201528360788201526098810191505098975050505050505050565b634e487b7160e01b600052602160045260246000fd5b8281526040602082015260008251806040840152610eca816060850160208701610db4565b601f01601f1916919091016060019392505050565b60008251610ef1818460208701610db4565b9190910192915050565b600060208284031215610f0d57600080fd5b505191905056fea26469706673582212206cf135137c4982fb656a7cb366425c116cdd776006bacd65310ebf800094d11b64736f6c634300081c0033";

type NFTfiSigningUtilsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: NFTfiSigningUtilsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class NFTfiSigningUtils__factory extends ContractFactory {
  constructor(...args: NFTfiSigningUtilsConstructorParams) {
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
      NFTfiSigningUtils & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): NFTfiSigningUtils__factory {
    return super.connect(runner) as NFTfiSigningUtils__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): NFTfiSigningUtilsInterface {
    return new Interface(_abi) as NFTfiSigningUtilsInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): NFTfiSigningUtils {
    return new Contract(address, _abi, runner) as unknown as NFTfiSigningUtils;
  }
}
