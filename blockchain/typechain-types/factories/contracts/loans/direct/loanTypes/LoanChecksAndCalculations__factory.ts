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
  "0x6115c5610052600b82828239805160001a6073146045577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600436106100565760003560e01c80632ad659af1461005b578063798f14d11461008b578063e573133c146100a7578063f4ac6bfc146100c3575b600080fd5b61007560048036038101906100709190610a22565b6100f4565b6040516100829190610a71565b60405180910390f35b6100a560048036038101906100a09190610ac2565b610157565b005b6100c160048036038101906100bc9190610ac2565b610302565b005b6100dd60048036038101906100d89190610dd8565b61052c565b6040516100eb929190610e67565b60405180910390f35b600061010a67b9dffe7e77af11c160c01b6109da565b61011e67cf57e7a9ce872f5460c01b6109da565b610132670879ef671afbd29660c01b6109da565b61271061ffff1682846101459190610ebf565b61014f9190610f30565b905092915050565b61016b6722684a36f435bd3660c01b6109da565b61017f67da89c4583a0142fd60c01b6109da565b61019367170253d755fa3f5060c01b6109da565b61019c81610302565b6101b0679b834f0229cf135060c01b6109da565b6101c467fcd11a01f10e9c8f60c01b6109da565b6000803073ffffffffffffffffffffffffffffffffffffffff16630ceb3a73846040518263ffffffff1660e01b81526004016102009190610f70565b61016060405180830381865afa15801561021e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102429190611009565b5050505096505095505050505061026367fd9d6232a9574f5b60c01b6109da565b610277670b5fbcf9d93314db60c01b6109da565b61028b6750dc1993279bcc7060c01b6109da565b8163ffffffff168167ffffffffffffffff166102a791906110fd565b4211156102e9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e09061118e565b60405180910390fd5b6102fd67ed0a19ce393f072460c01b6109da565b505050565b61031667553a6f907fb7ab9a60c01b6109da565b61032a6779eb5fcfa267bb3660c01b6109da565b61033e67da876edbf5c704fd60c01b6109da565b61035267b40e72e6362d08c960c01b6109da565b3073ffffffffffffffffffffffffffffffffffffffff1663ed4a4a67826040518263ffffffff1660e01b815260040161038b9190610f70565b602060405180830381865afa1580156103a8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103cc91906111ae565b1561040c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161040390611227565b60405180910390fd5b61042067ac3297c9ad9c342960c01b6109da565b6104346705606c6a3ef5a27960c01b6109da565b61044867c38d1b71578285b460c01b6109da565b61045c67f530e5f86e0b4a9a60c01b6109da565b3073ffffffffffffffffffffffffffffffffffffffff1663bd16181b826040518263ffffffff1660e01b81526004016104959190610f70565b602060405180830381865afa1580156104b2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104d691906111ae565b610515576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161050c90611293565b60405180910390fd5b61052967a6b915834508859660c01b6109da565b50565b60008061054367ad22b568d97ccf8460c01b6109da565b61055767ac966237862ef2bb60c01b6109da565b61056b6793ad2883054107cf60c01b6109da565b61057486610302565b6105886780cab7069948f83960c01b6109da565b61059c67de3a1feeafd0d20560c01b6109da565b6105b067893731d73051368760c01b6109da565b86610100015173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610623576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161061a906112ff565b60405180910390fd5b61063767dad6b4917574427360c01b6109da565b61064b670aaacc9e5512533e60c01b6109da565b61065f67dbae0888ac82ebd760c01b6109da565b610673670bad831d6f9c80ce60c01b6109da565b8463ffffffff168760c0015167ffffffffffffffff1661069391906110fd565b4211156106d5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106cc9061136b565b60405180910390fd5b6106e967cac340f6ee5a6d7860c01b6109da565b6106fd67b56dd87da449059860c01b6109da565b61071167fd449ab38b2f010760c01b6109da565b610725672a116c9855eb7e6360c01b6109da565b3073ffffffffffffffffffffffffffffffffffffffff1663192b355d6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610770573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610794919061138b565b8563ffffffff1611156107dc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107d39061142a565b60405180910390fd5b6107f06705e63a33eb9b81f160c01b6109da565b610804674c0904d5147eccb360c01b6109da565b61081867d24c6ea025c5286660c01b6109da565b61082c6778bb006e5c23d54c60c01b6109da565b8660000151841015610873576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161086a906114bc565b60405180910390fd5b610887672fba81f8bff0974860c01b6109da565b61089b671afa14885b36898160c01b6109da565b6108af671e6553c3e6306c1060c01b6109da565b6108c3676ceea0f18c402eb860c01b6109da565b3073ffffffffffffffffffffffffffffffffffffffff1663328404b0886101200151856040518363ffffffff1660e01b81526004016109039291906114fa565b602060405180830381865afa158015610920573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061094491906111ae565b15610984576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161097b9061156f565b60405180910390fd5b610998676dae76027579fbec60c01b6109da565b6109ac67e5764eef50c224fa60c01b6109da565b6109c067261b97b32c025f6760c01b6109da565b866101000151876101200151915091509550959350505050565b50565b6000604051905090565b600080fd5b6000819050919050565b6109ff816109ec565b8114610a0a57600080fd5b50565b600081359050610a1c816109f6565b92915050565b60008060408385031215610a3957610a386109e7565b5b6000610a4785828601610a0d565b9250506020610a5885828601610a0d565b9150509250929050565b610a6b816109ec565b82525050565b6000602082019050610a866000830184610a62565b92915050565b6000819050919050565b610a9f81610a8c565b8114610aaa57600080fd5b50565b600081359050610abc81610a96565b92915050565b600060208284031215610ad857610ad76109e7565b5b6000610ae684828501610aad565b91505092915050565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b610b3d82610af4565b810181811067ffffffffffffffff82111715610b5c57610b5b610b05565b5b80604052505050565b6000610b6f6109dd565b9050610b7b8282610b34565b919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610bab82610b80565b9050919050565b610bbb81610ba0565b8114610bc657600080fd5b50565b600081359050610bd881610bb2565b92915050565b600063ffffffff82169050919050565b610bf781610bde565b8114610c0257600080fd5b50565b600081359050610c1481610bee565b92915050565b600061ffff82169050919050565b610c3181610c1a565b8114610c3c57600080fd5b50565b600081359050610c4e81610c28565b92915050565b600067ffffffffffffffff82169050919050565b610c7181610c54565b8114610c7c57600080fd5b50565b600081359050610c8e81610c68565b92915050565b60008115159050919050565b610ca981610c94565b8114610cb457600080fd5b50565b600081359050610cc681610ca0565b92915050565b60006101608284031215610ce357610ce2610aef565b5b610cee610160610b65565b90506000610cfe84828501610a0d565b6000830152506020610d1284828501610a0d565b6020830152506040610d2684828501610a0d565b6040830152506060610d3a84828501610bc9565b6060830152506080610d4e84828501610c05565b60808301525060a0610d6284828501610c3f565b60a08301525060c0610d7684828501610c7f565b60c08301525060e0610d8a84828501610bc9565b60e083015250610100610d9f84828501610bc9565b61010083015250610120610db584828501610bc9565b61012083015250610140610dcb84828501610cb7565b6101408301525092915050565b60008060008060006101e08688031215610df557610df46109e7565b5b6000610e0388828901610ccc565b955050610160610e1588828901610aad565b945050610180610e2788828901610c05565b9350506101a0610e3988828901610a0d565b9250506101c0610e4b88828901610a0d565b9150509295509295909350565b610e6181610ba0565b82525050565b6000604082019050610e7c6000830185610e58565b610e896020830184610e58565b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610eca826109ec565b9150610ed5836109ec565b9250828202610ee3816109ec565b91508282048414831517610efa57610ef9610e90565b5b5092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6000610f3b826109ec565b9150610f46836109ec565b925082610f5657610f55610f01565b5b828204905092915050565b610f6a81610a8c565b82525050565b6000602082019050610f856000830184610f61565b92915050565b600081519050610f9a816109f6565b92915050565b600081519050610faf81610bb2565b92915050565b600081519050610fc481610bee565b92915050565b600081519050610fd981610c28565b92915050565b600081519050610fee81610c68565b92915050565b60008151905061100381610ca0565b92915050565b60008060008060008060008060008060006101608c8e03121561102f5761102e6109e7565b5b600061103d8e828f01610f8b565b9b5050602061104e8e828f01610f8b565b9a5050604061105f8e828f01610f8b565b99505060606110708e828f01610fa0565b98505060806110818e828f01610fb5565b97505060a06110928e828f01610fca565b96505060c06110a38e828f01610fdf565b95505060e06110b48e828f01610fa0565b9450506101006110c68e828f01610fa0565b9350506101206110d88e828f01610fa0565b9250506101406110ea8e828f01610ff4565b9150509295989b509295989b9093969950565b6000611108826109ec565b9150611113836109ec565b925082820190508082111561112b5761112a610e90565b5b92915050565b600082825260208201905092915050565b7f4c6f616e20697320657870697265640000000000000000000000000000000000600082015250565b6000611178600f83611131565b915061118382611142565b602082019050919050565b600060208201905081810360008301526111a78161116b565b9050919050565b6000602082840312156111c4576111c36109e7565b5b60006111d284828501610ff4565b91505092915050565b7f4c6f616e20616c7265616479207265706169642f6c6971756964617465640000600082015250565b6000611211601e83611131565b915061121c826111db565b602082019050919050565b6000602082019050818103600083015261124081611204565b9050919050565b7f4e6f6e652065786973746564206c6f616e204944000000000000000000000000600082015250565b600061127d601483611131565b915061128882611247565b602082019050919050565b600060208201905081810360008301526112ac81611270565b9050919050565b7f4f6e6c7920626f72726f7765722063616e20696e697469617465000000000000600082015250565b60006112e9601a83611131565b91506112f4826112b3565b602082019050919050565b60006020820190508181036000830152611318816112dc565b9050919050565b7f4e6577206475726174696f6e20616c7265616479206578706972656400000000600082015250565b6000611355601c83611131565b91506113608261131f565b602082019050919050565b6000602082019050818103600083015261138481611348565b9050919050565b6000602082840312156113a1576113a06109e7565b5b60006113af84828501610f8b565b91505092915050565b7f4e6577206475726174696f6e2065786365656473206d6178696d756d206c6f6160008201527f6e206475726174696f6e00000000000000000000000000000000000000000000602082015250565b6000611414602a83611131565b915061141f826113b8565b604082019050919050565b6000602082019050818103600083015261144381611407565b9050919050565b7f4e6567617469766520696e7465726573742072617465206c6f616e732061726560008201527f206e6f7420616c6c6f7765640000000000000000000000000000000000000000602082015250565b60006114a6602c83611131565b91506114b18261144a565b604082019050919050565b600060208201905081810360008301526114d581611499565b9050919050565b6114e581610ba0565b82525050565b6114f4816109ec565b82525050565b600060408201905061150f60008301856114dc565b61151c60208301846114eb565b9392505050565b7f4c656e646572206e6f6e636520696e76616c6964000000000000000000000000600082015250565b6000611559601483611131565b915061156482611523565b602082019050919050565b600060208201905081810360008301526115888161154c565b905091905056fea26469706673582212208075a64de56ffa16d38ca102da12f457fe8217171f02b5e61cf0894eef5e47f164736f6c634300081c0033";

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
