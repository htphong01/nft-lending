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
import type { NonPayableOverrides } from "../../../../../common";
import type {
  LoanChecksAndCalculations,
  LoanChecksAndCalculationsInterface,
} from "../../../../../contracts/loans/direct/loanTypes/LoanChecksAndCalculations";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "minLoanPrincipalAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxLoanPrincipalAmount",
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
            name: "minLoanDuration",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "maxLoanDuration",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "maxInterestRateForDurationInBasisPoints",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "referralFeeInBasisPoints",
            type: "uint16",
          },
          {
            internalType: "address",
            name: "erc20Denomination",
            type: "address",
          },
        ],
        internalType: "struct LoanData.ListingTerms",
        name: "_listingTerms",
        type: "tuple",
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
    ],
    name: "bindingTermsSanityChecks",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_loanId",
        type: "bytes32",
      },
    ],
    name: "checkLoanIdValidity",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_interestDue",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_adminFeeInBasisPoints",
        type: "uint256",
      },
    ],
    name: "computeAdminFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_loanPrincipalAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_referralFeeInBasisPoints",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_referrer",
        type: "address",
      },
    ],
    name: "computeReferralFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_adminFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_revenueShareInBasisPoints",
        type: "uint256",
      },
    ],
    name: "computeRevenueShare",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_loanId",
        type: "bytes32",
      },
    ],
    name: "payBackChecks",
    outputs: [],
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
          {
            internalType: "enum LoanData.LoanStatus",
            name: "status",
            type: "LoanData.LoanStatus",
          },
        ],
        internalType: "struct LoanData.LoanTerms",
        name: "_loan",
        type: "tuple",
      },
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
        name: "_lenderNonce",
        type: "uint256",
      },
    ],
    name: "renegotiationChecks",
    outputs: [
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
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x610f48610039600b82828239805160001a607314602c57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600436106100875760003560e01c80637f5e0ed3116100655780637f5e0ed31461008c57806380880738146100da578063e573133c146100ed578063f4ac6bfc1461010057600080fd5b80632ad659af1461008c578063798f14d1146100b25780637b2392f1146100c7575b600080fd5b61009f61009a36600461093f565b610133565b6040519081526020015b60405180910390f35b6100c56100c0366004610961565b610155565b005b61009f6100d536600461099f565b6102e6565b6100c56100e8366004610b3e565b61032a565b6100c56100fb366004610961565b61050f565b61011361010e366004610c56565b6105af565b604080516001600160a01b039384168152929091166020830152016100a9565b60006127106101428385610d88565b61014c9190610d9f565b90505b92915050565b61015e8161050f565b60405163ed4a4a6760e01b815260048101829052309063ed4a4a6790602401602060405180830381865afa15801561019a573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101be9190610dcc565b156102105760405162461bcd60e51b815260206004820152601e60248201527f4c6f616e20616c7265616479207265706169642f6c697175696461746564000060448201526064015b60405180910390fd5b604051630ceb3a7360e01b81526004810182905260009081903090630ceb3a739060240161018060405180830381865afa158015610252573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102769190610dff565b50505050509650509550505050508163ffffffff168167ffffffffffffffff166102a09190610ee6565b4211156102e15760405162461bcd60e51b815260206004820152600f60248201526e131bd85b881a5cc8195e1c1a5c9959608a1b6044820152606401610207565b505050565b60008215806102fc57506001600160a01b038216155b1561030957506000610323565b6127106103168486610d88565b6103209190610d9f565b90505b9392505050565b8161010001516001600160a01b03168160c001516001600160a01b0316146103945760405162461bcd60e51b815260206004820152601960248201527f496e76616c696420657263323044656e6f6d696e6174696f6e000000000000006044820152606401610207565b81518151108015906103ab57506020820151815111155b6103f75760405162461bcd60e51b815260206004820152601760248201527f496e76616c6964207072696e636970616c416d6f756e740000000000000000006044820152606401610207565b60c08201518151600091612710916104139161ffff1690610d88565b61041d9190610d9f565b82516104299190610ee6565b905080826020015111156104985760405162461bcd60e51b815260206004820152603060248201527f6d6178496e74657265737452617465466f724475726174696f6e496e4261736960448201526f1cd41bda5b9d1cc81d9a5bdb185d195960821b6064820152608401610207565b826080015163ffffffff16826080015163ffffffff16101580156104d057508260a0015163ffffffff16826080015163ffffffff1611155b6102e15760405162461bcd60e51b815260206004820152601060248201526f24b73b30b634b210323ab930ba34b7b760811b6044820152606401610207565b60405163bd16181b60e01b815260048101829052309063bd16181b90602401602060405180830381865afa15801561054b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061056f9190610dcc565b6105ac5760405162461bcd60e51b815260206004820152600e60248201526d1a5b9d985b1a59081b1bd85b925960921b6044820152606401610207565b50565b6000806105bb8661050f565b60405163ed4a4a6760e01b815260048101879052309063ed4a4a6790602401602060405180830381865afa1580156105f7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061061b9190610dcc565b156106685760405162461bcd60e51b815260206004820152601e60248201527f4c6f616e20616c7265616479207265706169642f6c69717569646174656400006044820152606401610207565b8661010001516001600160a01b0316336001600160a01b0316146106ce5760405162461bcd60e51b815260206004820152601a60248201527f4f6e6c7920626f72726f7765722063616e20696e6974696174650000000000006044820152606401610207565b8463ffffffff168760c0015167ffffffffffffffff166106ee9190610ee6565b42111561073d5760405162461bcd60e51b815260206004820152601c60248201527f4e6577206475726174696f6e20616c72656164792065787069726564000000006044820152606401610207565b306001600160a01b031663192b355d6040518163ffffffff1660e01b8152600401602060405180830381865afa15801561077b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061079f9190610ef9565b8563ffffffff1611156108075760405162461bcd60e51b815260206004820152602a60248201527f4e6577206475726174696f6e2065786365656473206d6178696d756d206c6f616044820152693710323ab930ba34b7b760b11b6064820152608401610207565b865184101561086d5760405162461bcd60e51b815260206004820152602c60248201527f4e6567617469766520696e7465726573742072617465206c6f616e732061726560448201526b081b9bdd08185b1b1bddd95960a21b6064820152608401610207565b610120870151604051630328404b60e41b81526001600160a01b03909116600482015260248101849052309063328404b090604401602060405180830381865afa1580156108bf573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108e39190610dcc565b156109275760405162461bcd60e51b815260206004820152601460248201527313195b99195c881b9bdb98d9481a5b9d985b1a5960621b6044820152606401610207565b50506101008501516101208601519550959350505050565b6000806040838503121561095257600080fd5b50508035926020909101359150565b60006020828403121561097357600080fd5b5035919050565b6001600160a01b03811681146105ac57600080fd5b803561099a8161097a565b919050565b6000806000606084860312156109b457600080fd5b833592506020840135915060408401356109cd8161097a565b809150509250925092565b604051610100810167ffffffffffffffff81118282101715610a0a57634e487b7160e01b600052604160045260246000fd5b60405290565b604051610120810167ffffffffffffffff81118282101715610a0a57634e487b7160e01b600052604160045260246000fd5b604051610180810167ffffffffffffffff81118282101715610a0a57634e487b7160e01b600052604160045260246000fd5b63ffffffff811681146105ac57600080fd5b803561099a81610a74565b61ffff811681146105ac57600080fd5b803561099a81610a91565b60006101008284031215610abf57600080fd5b610ac76109d8565b82358152602080840135908201526040808401359082015290506060820135610aef8161097a565b6060820152610b0060808301610a86565b6080820152610b1160a08301610aa1565b60a0820152610b2260c0830161098f565b60c0820152610b3360e0830161098f565b60e082015292915050565b600080828403610220811215610b5357600080fd5b610120811215610b6257600080fd5b50610b6b610a10565b833581526020808501359082015260408085013590820152610b8f6060850161098f565b6060820152610ba060808501610a86565b6080820152610bb160a08501610a86565b60a0820152610bc260c08501610aa1565b60c0820152610bd360e08501610aa1565b60e0820152610be5610100850161098f565b6101008201529150610bfb846101208501610aac565b90509250929050565b67ffffffffffffffff811681146105ac57600080fd5b803561099a81610c04565b80151581146105ac57600080fd5b803561099a81610c25565b600381106105ac57600080fd5b803561099a81610c3e565b6000806000806000858703610200811215610c7057600080fd5b610180811215610c7f57600080fd5b50610c88610a42565b863581526020808801359082015260408088013590820152610cac6060880161098f565b6060820152610cbd60808801610a86565b6080820152610cce60a08801610aa1565b60a0820152610cdf60c08801610c1a565b60c0820152610cf060e0880161098f565b60e0820152610d02610100880161098f565b610100820152610d15610120880161098f565b610120820152610d286101408801610c33565b610140820152610d3b6101608801610c4b565b61016082015294506101808601359350610d586101a08701610a86565b949793965093946101c081013594506101e0013592915050565b634e487b7160e01b600052601160045260246000fd5b808202811582820484141761014f5761014f610d72565b600082610dbc57634e487b7160e01b600052601260045260246000fd5b500490565b805161099a81610c25565b600060208284031215610dde57600080fd5b815161032381610c25565b805161099a8161097a565b805161099a81610c3e565b6000806000806000806000806000806000806101808d8f031215610e2257600080fd5b60008d519050809c5050600060208e01519050809b5050600060408e01519050809a505060608d0151610e548161097a565b60808e0151909950610e6581610a74565b60a08e0151909850610e7681610a91565b60c08e0151909750610e8781610c04565b60e08e0151909650610e988161097a565b9450610ea76101008e01610de9565b9350610eb66101208e01610de9565b9250610ec56101408e01610dc1565b9150610ed46101608e01610df4565b90509295989b509295989b509295989b565b8082018082111561014f5761014f610d72565b600060208284031215610f0b57600080fd5b505191905056fea2646970667358221220ca9b4a095accbbc3957a6cd96bf7c239897dd1594a099fb95f6bfe80116d363964736f6c634300081c0033";

type LoanChecksAndCalculationsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: LoanChecksAndCalculationsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class LoanChecksAndCalculations__factory extends ContractFactory {
  constructor(...args: LoanChecksAndCalculationsConstructorParams) {
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
      LoanChecksAndCalculations & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): LoanChecksAndCalculations__factory {
    return super.connect(runner) as LoanChecksAndCalculations__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): LoanChecksAndCalculationsInterface {
    return new Interface(_abi) as LoanChecksAndCalculationsInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): LoanChecksAndCalculations {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as LoanChecksAndCalculations;
  }
}
