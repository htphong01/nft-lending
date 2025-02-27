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
  LendingStake,
  LendingStakeInterface,
} from "../../../contracts/LendingPool/LendingStake";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_wXENE",
        type: "address",
      },
      {
        internalType: "address",
        name: "_lendingPool",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_rewardPerBlock",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_startBlock",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AmountTooBig",
    type: "error",
  },
  {
    inputs: [],
    name: "AmountTooSmall",
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
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OnlyLendingPool",
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
    inputs: [],
    name: "RewardBalanceTooSmall",
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
    name: "UserAlreadyStaked",
    type: "error",
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
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "ClaimReward",
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
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposit",
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
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "addressLength",
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
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "getAddressByIndex",
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
    name: "getAllAddress",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lendingPool",
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
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "pendingReward",
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
    name: "poolInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "lastRewardBlock",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "accRewardPerShare",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stakedSupply",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalPendingReward",
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
        name: "_token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
    ],
    name: "rescueToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardPerBlock",
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
    name: "rewardSupply",
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
        name: "_lendingPool",
        type: "address",
      },
    ],
    name: "setLendingPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rewardPerBlock",
        type: "uint256",
      },
    ],
    name: "setRewardPerBlock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_startBlock",
        type: "uint256",
      },
    ],
    name: "setStartBlock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startBlock",
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
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "updatePool",
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
    ],
    name: "userInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "rewardDebt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "rewardPending",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "wXENE",
    outputs: [
      {
        internalType: "contract IERC20",
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
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506040516116e73803806116e783398101604081905261002f916100c5565b6000805460ff1916815560018055600680546001600160a01b039687166001600160a01b0319918216179091556007805495909616941693909317909355600955600882905560408051608081018252838152602081018390529081018290526060018190526002919091556003819055600481905560055561010d565b6001600160a01b03811681146100c257600080fd5b50565b600080600080608085870312156100db57600080fd5b84516100e6816100ad565b60208601519094506100f7816100ad565b6040860151606090960151949790965092505050565b6115cb8061011c6000396000f3fe608060405234801561001057600080fd5b506004361061014d5760003560e01c80638ae39cac116100c3578063bb872b4a1161007c578063bb872b4a146102e1578063ce10cf88146102f4578063dc88188814610307578063e3161ddd1461030f578063f35e4a6e14610317578063f40f0f521461032a57600080fd5b80638ae39cac1461026c578063a59a997314610275578063b619738a146102a0578063b6b55f25146102b3578063b759f954146102c6578063b88a802f146102d957600080fd5b806348cd4cb11161011557806348cd4cb1146101e45780635a2f3d09146101fb5780635c975abb146102315780636b0c341b14610247578063715b208b1461024f5780638456cb591461026457600080fd5b8063113aa8b1146101525780631959a002146101675780632e1a7d4d146101b65780633f4ba83a146101c95780634707d000146101d1575b600080fd5b6101656101603660046113ed565b61033d565b005b6101966101753660046113ed565b600a6020526000908152604090208054600182015460029092015490919083565b604080519384526020840192909252908201526060015b60405180910390f35b6101656101c436600461140a565b61042d565b610165610576565b6101656101df366004611423565b610609565b6101ed60085481565b6040519081526020016101ad565b6002546003546004546005546102119392919084565b6040805194855260208501939093529183015260608201526080016101ad565b60005460ff1660405190151581526020016101ad565b6101ed61076e565b6102576107c3565b6040516101ad919061145c565b6101656107d4565b6101ed60095481565b600754610288906001600160a01b031681565b6040516001600160a01b0390911681526020016101ad565b600654610288906001600160a01b031681565b6101656102c136600461140a565b610865565b6101656102d436600461140a565b610997565b610165610a4a565b6101656102ef36600461140a565b610c2c565b61028861030236600461140a565b610cb2565b6101ed610cc5565b610165610cd1565b61016561032536600461140a565b610d4f565b6101ed6103383660046113ed565b610dfb565b60075460408051638da5cb5b60e01b8152905133926001600160a01b031691638da5cb5b9160048083019260209291908290030181865afa158015610386573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103aa91906114a8565b6001600160a01b0316146103e457335b60405163118cdaa760e01b81526001600160a01b0390911660048201526024015b60405180910390fd5b6001600160a01b03811661040b5760405163e6c4247b60e01b815260040160405180910390fd5b600780546001600160a01b0319166001600160a01b0392909216919091179055565b610435610ecf565b61043d610ef9565b8060000361045e5760405163617ab12d60e11b815260040160405180910390fd5b336000908152600a60205260409020805482111561048f57604051636b2f218360e01b815260040160405180910390fd5b610497610cd1565b6002810154600182015460035483546104b59164e8d4a51000610f1d565b6104bf91906114db565b6104c991906114ee565b600282015580546104db9083906114db565b8082556003546104f1919064e8d4a51000610f1d565b60018201556004546105049083906114db565b600455805460000361051d5761051b600b33610fd9565b505b610534336006546001600160a01b03169084610fee565b60405182815233907f884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a94243649060200160405180910390a25061057360018055565b50565b60075460408051638da5cb5b60e01b8152905133926001600160a01b031691638da5cb5b9160048083019260209291908290030181865afa1580156105bf573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105e391906114a8565b6001600160a01b0316146105f757336103ba565b6105ff61104d565b610607611070565b565b60075460408051638da5cb5b60e01b8152905133926001600160a01b031691638da5cb5b9160048083019260209291908290030181865afa158015610652573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061067691906114a8565b6001600160a01b03161461068a57336103ba565b6001600160a01b0381166106b15760405163e6c4247b60e01b815260040160405180910390fd5b6040516370a0823160e01b81523060048201526000906001600160a01b038416906370a0823190602401602060405180830381865afa1580156106f8573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061071c9190611501565b6006549091506001600160a01b0390811690841603610755576004548111610745576000610752565b60045461075290826114db565b90505b6107696001600160a01b0384168383610fee565b505050565b60025460009043118015610783575060045415155b156107bc576000610799600260000154436110c2565b9050600954816107a9919061151a565b6005546107b691906114ee565b91505090565b5060055490565b60606107cf600b6110d9565b905090565b60075460408051638da5cb5b60e01b8152905133926001600160a01b031691638da5cb5b9160048083019260209291908290030181865afa15801561081d573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061084191906114a8565b6001600160a01b03161461085557336103ba565b61085d610ef9565b6106076110e6565b61086d610ef9565b8060000361088e5760405163617ab12d60e11b815260040160405180910390fd5b610896610cd1565b6108ae336006546001600160a01b0316903084611123565b336000908152600a6020526040902080541580156108ce57506002810154155b80156108dc57506001810154155b156108ee576108ec600b33611162565b505b60028101546001820154600354835461090c9164e8d4a51000610f1d565b61091691906114db565b61092091906114ee565b600282015580546109329083906114ee565b808255600354610948919064e8d4a51000610f1d565b600182015560045461095b9083906114ee565b60045560405182815233907fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c9060200160405180910390a25050565b6007546001600160a01b0316336001600160a01b0316146109cd57604051634a59ef8d60e01b81523360048201526024016103db565b60065460075460405163095ea7b360e01b81526001600160a01b0391821660048201526024810184905291169063095ea7b3906044016020604051808303816000875af1158015610a22573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a469190611531565b5050565b610a52610ecf565b610a5a610ef9565b336000908152600a60205260409020610a71610cd1565b6003548154600091610a89919064e8d4a51000610f1d565b905060008260020154836001015483610aa291906114db565b610aac91906114ee565b6006546007546040516370a0823160e01b81526001600160a01b03918216600482015292935016906370a0823190602401602060405180830381865afa158015610afa573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b1e9190611501565b811115610b3e57604051637182cb8b60e01b815260040160405180910390fd5b6000600284018190556001840183905560058054839290610b609084906114db565b90915550506007546006546040516371f3cd0d60e01b81526001600160a01b039182166004820152602481018490529116906371f3cd0d90604401600060405180830381600087803b158015610bb557600080fd5b505af1158015610bc9573d6000803e3d6000fd5b5050600754600654610beb93506001600160a01b039081169250163384611123565b60405181815233907fba8de60c3403ec381d1d484652ea1980e3c3e56359195c92525bff4ce47ad98e9060200160405180910390a250505061060760018055565b60075460408051638da5cb5b60e01b8152905133926001600160a01b031691638da5cb5b9160048083019260209291908290030181865afa158015610c75573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c9991906114a8565b6001600160a01b031614610cad57336103ba565b600955565b6000610cbf600b83611177565b92915050565b60006107cf600b611183565b6002544311610cdc57565b6004546000819003610cef575043600255565b6000610d00600260000154436110c2565b9050600060095482610d12919061151a565b600554909150610d239082906114ee565b600555610d368164e8d4a5100085610f1d565b600354610d4391906114ee565b60035550504360025550565b60075460408051638da5cb5b60e01b8152905133926001600160a01b031691638da5cb5b9160048083019260209291908290030181865afa158015610d98573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610dbc91906114a8565b6001600160a01b031614610dd057336103ba565b60045415610df15760405163db47fb1d60e01b815260040160405180910390fd5b6008819055600255565b600354600454600254600092919043118015610e1657508015155b15610e5f576000610e2c600260000154436110c2565b9050600060095482610e3e919061151a565b9050610e508164e8d4a5100085610f1d565b610e5a90856114ee565b935050505b6001600160a01b0384166000908152600a6020908152604091829020825160608101845281548082526001830154938201849052600290920154938101849052929190610eb2908664e8d4a51000610f1d565b610ebc91906114db565b610ec691906114ee565b95945050505050565b600260015403610ef257604051633ee5aeb560e01b815260040160405180910390fd5b6002600155565b60005460ff16156106075760405163d93c066560e01b815260040160405180910390fd5b6000838302816000198587098281108382030391505080600003610f5457838281610f4a57610f4a611553565b0492505050610fd2565b808411610f6b57610f6b600385150260111861118d565b6000848688096000868103871696879004966002600389028118808a02820302808a02820302808a02820302808a02820302808a02820302808a02909103029181900381900460010186841190950394909402919094039290920491909117919091029150505b9392505050565b6000610fd2836001600160a01b03841661119f565b6040516001600160a01b0383811660248301526044820183905261076991859182169063a9059cbb906064015b604051602081830303815290604052915060e01b6020820180516001600160e01b038381831617835250505050611292565b60005460ff1661060757604051638dfc202b60e01b815260040160405180910390fd5b61107861104d565b6000805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b6000818311156110d457506000610cbf565b500390565b60606000610fd283611303565b6110ee610ef9565b6000805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586110a53390565b6040516001600160a01b03848116602483015283811660448301526064820183905261115c9186918216906323b872dd9060840161101b565b50505050565b6000610fd2836001600160a01b03841661135f565b6000610fd283836113ae565b6000610cbf825490565b634e487b71600052806020526024601cfd5b600081815260018301602052604081205480156112885760006111c36001836114db565b85549091506000906111d7906001906114db565b905080821461123c5760008660000182815481106111f7576111f7611569565b906000526020600020015490508087600001848154811061121a5761121a611569565b6000918252602080832090910192909255918252600188019052604090208390555b855486908061124d5761124d61157f565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610cbf565b6000915050610cbf565b600080602060008451602086016000885af1806112b5576040513d6000823e3d81fd5b50506000513d915081156112cd5780600114156112da565b6001600160a01b0384163b155b1561115c57604051635274afe760e01b81526001600160a01b03851660048201526024016103db565b60608160000180548060200260200160405190810160405280929190818152602001828054801561135357602002820191906000526020600020905b81548152602001906001019080831161133f575b50505050509050919050565b60008181526001830160205260408120546113a657508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610cbf565b506000610cbf565b60008260000182815481106113c5576113c5611569565b9060005260206000200154905092915050565b6001600160a01b038116811461057357600080fd5b6000602082840312156113ff57600080fd5b8135610fd2816113d8565b60006020828403121561141c57600080fd5b5035919050565b6000806040838503121561143657600080fd5b8235611441816113d8565b91506020830135611451816113d8565b809150509250929050565b602080825282518282018190526000918401906040840190835b8181101561149d5783516001600160a01b0316835260209384019390920191600101611476565b509095945050505050565b6000602082840312156114ba57600080fd5b8151610fd2816113d8565b634e487b7160e01b600052601160045260246000fd5b81810381811115610cbf57610cbf6114c5565b80820180821115610cbf57610cbf6114c5565b60006020828403121561151357600080fd5b5051919050565b8082028115828204841417610cbf57610cbf6114c5565b60006020828403121561154357600080fd5b81518015158114610fd257600080fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fdfea2646970667358221220e792b193561966dfea6896d805528e2e6d77a4b9ed862fe4425d8d537ee3bbeb64736f6c634300081c0033";

type LendingStakeConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: LendingStakeConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class LendingStake__factory extends ContractFactory {
  constructor(...args: LendingStakeConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _wXENE: AddressLike,
    _lendingPool: AddressLike,
    _rewardPerBlock: BigNumberish,
    _startBlock: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      _wXENE,
      _lendingPool,
      _rewardPerBlock,
      _startBlock,
      overrides || {}
    );
  }
  override deploy(
    _wXENE: AddressLike,
    _lendingPool: AddressLike,
    _rewardPerBlock: BigNumberish,
    _startBlock: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      _wXENE,
      _lendingPool,
      _rewardPerBlock,
      _startBlock,
      overrides || {}
    ) as Promise<
      LendingStake & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): LendingStake__factory {
    return super.connect(runner) as LendingStake__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): LendingStakeInterface {
    return new Interface(_abi) as LendingStakeInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): LendingStake {
    return new Contract(address, _abi, runner) as unknown as LendingStake;
  }
}
