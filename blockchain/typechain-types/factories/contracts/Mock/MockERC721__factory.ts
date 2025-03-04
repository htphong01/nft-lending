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
  MockERC721,
  MockERC721Interface,
} from "../../../contracts/Mock/MockERC721";

const _abi = [
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
    inputs: [],
    name: "lastId",
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
        name: "_to",
        type: "address",
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
  "0x608060405234801561001057600080fd5b506040518060400160405280600a81526020017f4d6f636b455243373231000000000000000000000000000000000000000000008152506040518060400160405280600681526020017f4552433732310000000000000000000000000000000000000000000000000000815250816000908161008c91906102f4565b50806001908161009c91906102f4565b5050506103c6565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061012557607f821691505b602082108103610138576101376100de565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026101a07fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610163565b6101aa8683610163565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b60006101f16101ec6101e7846101c2565b6101cc565b6101c2565b9050919050565b6000819050919050565b61020b836101d6565b61021f610217826101f8565b848454610170565b825550505050565b600090565b610234610227565b61023f818484610202565b505050565b5b818110156102635761025860008261022c565b600181019050610245565b5050565b601f8211156102a8576102798161013e565b61028284610153565b81016020851015610291578190505b6102a561029d85610153565b830182610244565b50505b505050565b600082821c905092915050565b60006102cb600019846008026102ad565b1980831691505092915050565b60006102e483836102ba565b9150826002028217905092915050565b6102fd826100a4565b67ffffffffffffffff811115610316576103156100af565b5b610320825461010d565b61032b828285610267565b600060209050601f83116001811461035e576000841561034c578287015190505b61035685826102d8565b8655506103be565b601f19841661036c8661013e565b60005b828110156103945784890151825560018201915060208501945060208101905061036f565b868310156103b157848901516103ad601f8916826102ba565b8355505b6001600288020188555050505b505050505050565b611eb4806103d56000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c80636a62784211610097578063b88d4fde11610066578063b88d4fde14610282578063c1292cc31461029e578063c87b56dd146102bc578063e985e9c5146102ec576100f5565b80636a627842146101fc57806370a082311461021857806395d89b4114610248578063a22cb46514610266576100f5565b8063095ea7b3116100d3578063095ea7b31461017857806323b872dd1461019457806342842e0e146101b05780636352211e146101cc576100f5565b806301ffc9a7146100fa57806306fdde031461012a578063081812fc14610148575b600080fd5b610114600480360381019061010f9190611687565b61031c565b60405161012191906116cf565b60405180910390f35b6101326103fe565b60405161013f919061177a565b60405180910390f35b610162600480360381019061015d91906117d2565b610490565b60405161016f9190611840565b60405180910390f35b610192600480360381019061018d9190611887565b6104ac565b005b6101ae60048036038101906101a991906118c7565b6104c2565b005b6101ca60048036038101906101c591906118c7565b6105c4565b005b6101e660048036038101906101e191906117d2565b6105e4565b6040516101f39190611840565b60405180910390f35b6102166004803603810190610211919061191a565b6105f6565b005b610232600480360381019061022d919061191a565b610653565b60405161023f9190611956565b60405180910390f35b61025061070d565b60405161025d919061177a565b60405180910390f35b610280600480360381019061027b919061199d565b61079f565b005b61029c60048036038101906102979190611b12565b6107b5565b005b6102a66107da565b6040516102b39190611956565b60405180910390f35b6102d660048036038101906102d191906117d2565b6107e0565b6040516102e3919061177a565b60405180910390f35b61030660048036038101906103019190611b95565b610849565b60405161031391906116cf565b60405180910390f35b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806103e757507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b806103f757506103f6826108dd565b5b9050919050565b60606000805461040d90611c04565b80601f016020809104026020016040519081016040528092919081815260200182805461043990611c04565b80156104865780601f1061045b57610100808354040283529160200191610486565b820191906000526020600020905b81548152906001019060200180831161046957829003601f168201915b5050505050905090565b600061049b82610947565b506104a5826109cf565b9050919050565b6104be82826104b9610a0c565b610a14565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036105345760006040517f64a0ae9200000000000000000000000000000000000000000000000000000000815260040161052b9190611840565b60405180910390fd5b60006105488383610543610a0c565b610a26565b90508373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146105be578382826040517f64283d7b0000000000000000000000000000000000000000000000000000000081526004016105b593929190611c35565b60405180910390fd5b50505050565b6105df838383604051806020016040528060008152506107b5565b505050565b60006105ef82610947565b9050919050565b61060a6765b286c5d42a3dc160c01b610c40565b61061e67fff549fb906d4d3960c01b610c40565b61063267c475bb0cca580a6860c01b610c40565b6106508160066000815461064590611c9b565b919050819055610c43565b50565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036106c65760006040517f89c62b640000000000000000000000000000000000000000000000000000000081526004016106bd9190611840565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60606001805461071c90611c04565b80601f016020809104026020016040519081016040528092919081815260200182805461074890611c04565b80156107955780601f1061076a57610100808354040283529160200191610795565b820191906000526020600020905b81548152906001019060200180831161077857829003601f168201915b5050505050905090565b6107b16107aa610a0c565b8383610d3c565b5050565b6107c08484846104c2565b6107d46107cb610a0c565b85858585610eab565b50505050565b60065481565b60606107eb82610947565b5060006107f661105c565b905060008151116108165760405180602001604052806000815250610841565b8061082084611073565b604051602001610831929190611d1f565b6040516020818303038152906040525b915050919050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b60008061095383611141565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036109c657826040517f7e2732890000000000000000000000000000000000000000000000000000000081526004016109bd9190611956565b60405180910390fd5b80915050919050565b60006004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b600033905090565b610a21838383600161117e565b505050565b600080610a3284611141565b9050600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614610a7457610a73818486611343565b5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610b0557610ab660008560008061117e565b6001600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055505b600073ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1614610b88576001600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b846002600086815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550838573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4809150509392505050565b50565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610cb55760006040517f64a0ae92000000000000000000000000000000000000000000000000000000008152600401610cac9190611840565b60405180910390fd5b6000610cc383836000610a26565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610d375760006040517f73c6ac6e000000000000000000000000000000000000000000000000000000008152600401610d2e9190611840565b60405180910390fd5b505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610dad57816040517f5b08ba18000000000000000000000000000000000000000000000000000000008152600401610da49190611840565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051610e9e91906116cf565b60405180910390a3505050565b60008373ffffffffffffffffffffffffffffffffffffffff163b1115611055578273ffffffffffffffffffffffffffffffffffffffff1663150b7a02868685856040518563ffffffff1660e01b8152600401610f0a9493929190611d98565b6020604051808303816000875af1925050508015610f4657506040513d601f19601f82011682018060405250810190610f439190611df9565b60015b610fca573d8060008114610f76576040519150601f19603f3d011682016040523d82523d6000602084013e610f7b565b606091505b506000815103610fc257836040517f64a0ae92000000000000000000000000000000000000000000000000000000008152600401610fb99190611840565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161461105357836040517f64a0ae9200000000000000000000000000000000000000000000000000000000815260040161104a9190611840565b60405180910390fd5b505b5050505050565b606060405180602001604052806000815250905090565b60606000600161108284611407565b01905060008167ffffffffffffffff8111156110a1576110a06119e7565b5b6040519080825280601f01601f1916602001820160405280156110d35781602001600182028036833780820191505090505b509050600082602001820190505b600115611136578080600190039150507f3031323334353637383961626364656600000000000000000000000000000000600a86061a8153600a858161112a57611129611e26565b5b049450600085036110e1575b819350505050919050565b60006002600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b80806111b75750600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614155b156112eb5760006111c784610947565b9050600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415801561123257508273ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614155b801561124557506112438184610849565b155b1561128757826040517fa9fbf51f00000000000000000000000000000000000000000000000000000000815260040161127e9190611840565b60405180910390fd5b81156112e957838573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45b505b836004600085815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050565b61134e83838361155a565b61140257600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036113c357806040517f7e2732890000000000000000000000000000000000000000000000000000000081526004016113ba9190611956565b60405180910390fd5b81816040517f177e802f0000000000000000000000000000000000000000000000000000000081526004016113f9929190611e55565b60405180910390fd5b505050565b600080600090507a184f03e93ff9f4daa797ed6e38ed64bf6a1f0100000000000000008310611465577a184f03e93ff9f4daa797ed6e38ed64bf6a1f010000000000000000838161145b5761145a611e26565b5b0492506040810190505b6d04ee2d6d415b85acef810000000083106114a2576d04ee2d6d415b85acef8100000000838161149857611497611e26565b5b0492506020810190505b662386f26fc1000083106114d157662386f26fc1000083816114c7576114c6611e26565b5b0492506010810190505b6305f5e10083106114fa576305f5e10083816114f0576114ef611e26565b5b0492506008810190505b612710831061151f57612710838161151557611514611e26565b5b0492506004810190505b60648310611542576064838161153857611537611e26565b5b0492506002810190505b600a8310611551576001810190505b80915050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415801561161257508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614806115d357506115d28484610849565b5b8061161157508273ffffffffffffffffffffffffffffffffffffffff166115f9836109cf565b73ffffffffffffffffffffffffffffffffffffffff16145b5b90509392505050565b6000604051905090565b600080fd5b600080fd5b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b6116648161162f565b811461166f57600080fd5b50565b6000813590506116818161165b565b92915050565b60006020828403121561169d5761169c611625565b5b60006116ab84828501611672565b91505092915050565b60008115159050919050565b6116c9816116b4565b82525050565b60006020820190506116e460008301846116c0565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b83811015611724578082015181840152602081019050611709565b60008484015250505050565b6000601f19601f8301169050919050565b600061174c826116ea565b61175681856116f5565b9350611766818560208601611706565b61176f81611730565b840191505092915050565b600060208201905081810360008301526117948184611741565b905092915050565b6000819050919050565b6117af8161179c565b81146117ba57600080fd5b50565b6000813590506117cc816117a6565b92915050565b6000602082840312156117e8576117e7611625565b5b60006117f6848285016117bd565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061182a826117ff565b9050919050565b61183a8161181f565b82525050565b60006020820190506118556000830184611831565b92915050565b6118648161181f565b811461186f57600080fd5b50565b6000813590506118818161185b565b92915050565b6000806040838503121561189e5761189d611625565b5b60006118ac85828601611872565b92505060206118bd858286016117bd565b9150509250929050565b6000806000606084860312156118e0576118df611625565b5b60006118ee86828701611872565b93505060206118ff86828701611872565b9250506040611910868287016117bd565b9150509250925092565b6000602082840312156119305761192f611625565b5b600061193e84828501611872565b91505092915050565b6119508161179c565b82525050565b600060208201905061196b6000830184611947565b92915050565b61197a816116b4565b811461198557600080fd5b50565b60008135905061199781611971565b92915050565b600080604083850312156119b4576119b3611625565b5b60006119c285828601611872565b92505060206119d385828601611988565b9150509250929050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b611a1f82611730565b810181811067ffffffffffffffff82111715611a3e57611a3d6119e7565b5b80604052505050565b6000611a5161161b565b9050611a5d8282611a16565b919050565b600067ffffffffffffffff821115611a7d57611a7c6119e7565b5b611a8682611730565b9050602081019050919050565b82818337600083830152505050565b6000611ab5611ab084611a62565b611a47565b905082815260208101848484011115611ad157611ad06119e2565b5b611adc848285611a93565b509392505050565b600082601f830112611af957611af86119dd565b5b8135611b09848260208601611aa2565b91505092915050565b60008060008060808587031215611b2c57611b2b611625565b5b6000611b3a87828801611872565b9450506020611b4b87828801611872565b9350506040611b5c878288016117bd565b925050606085013567ffffffffffffffff811115611b7d57611b7c61162a565b5b611b8987828801611ae4565b91505092959194509250565b60008060408385031215611bac57611bab611625565b5b6000611bba85828601611872565b9250506020611bcb85828601611872565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680611c1c57607f821691505b602082108103611c2f57611c2e611bd5565b5b50919050565b6000606082019050611c4a6000830186611831565b611c576020830185611947565b611c646040830184611831565b949350505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000611ca68261179c565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203611cd857611cd7611c6c565b5b600182019050919050565b600081905092915050565b6000611cf9826116ea565b611d038185611ce3565b9350611d13818560208601611706565b80840191505092915050565b6000611d2b8285611cee565b9150611d378284611cee565b91508190509392505050565b600081519050919050565b600082825260208201905092915050565b6000611d6a82611d43565b611d748185611d4e565b9350611d84818560208601611706565b611d8d81611730565b840191505092915050565b6000608082019050611dad6000830187611831565b611dba6020830186611831565b611dc76040830185611947565b8181036060830152611dd98184611d5f565b905095945050505050565b600081519050611df38161165b565b92915050565b600060208284031215611e0f57611e0e611625565b5b6000611e1d84828501611de4565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6000604082019050611e6a6000830185611831565b611e776020830184611947565b939250505056fea26469706673582212209034f7fee64ff17613a6f3ebb5962f679ae415267fa3946dbf02252f9c9f7a9164736f6c634300081c0033";

type MockERC721ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockERC721ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockERC721__factory extends ContractFactory {
  constructor(...args: MockERC721ConstructorParams) {
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
      MockERC721 & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): MockERC721__factory {
    return super.connect(runner) as MockERC721__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockERC721Interface {
    return new Interface(_abi) as MockERC721Interface;
  }
  static connect(address: string, runner?: ContractRunner | null): MockERC721 {
    return new Contract(address, _abi, runner) as unknown as MockERC721;
  }
}
