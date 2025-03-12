export const LENDING_POOL_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_admin",
        "type": "address"
      },
      {
        "internalType": "address[]",
        "name": "_permittedErc20s",
        "type": "address[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "EnforcedPause",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ExpectedPause",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "SafeERC20FailedOperation",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint16",
        "name": "newAdminFee",
        "type": "uint16"
      }
    ],
    "name": "AdminFeeUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "erc20Contract",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isPermitted",
        "type": "bool"
      }
    ],
    "name": "ERC20Permit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "loanId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "borrower",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "lender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "principalAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "nftCollateralId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "loanMaturityDate",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "loanLiquidationDate",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "nftCollateralContract",
        "type": "address"
      }
    ],
    "name": "LoanLiquidated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "loanId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "borrower",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "lender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "newLoanDuration",
        "type": "uint32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newMaximumRepaymentAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "renegotiationFee",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "renegotiationAdminFee",
        "type": "uint256"
      }
    ],
    "name": "LoanRenegotiated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "loanId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "borrower",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "lender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "principalAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "nftCollateralId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountPaidToLender",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "adminFee",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "interest",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "nftCollateralContract",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "erc20Denomination",
        "type": "address"
      }
    ],
    "name": "LoanRepaid",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "loanId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "borrower",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "lender",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "principalAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maximumRepaymentAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "nftCollateralId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "erc20Denomination",
            "type": "address"
          },
          {
            "internalType": "uint32",
            "name": "duration",
            "type": "uint32"
          },
          {
            "internalType": "uint16",
            "name": "adminFeeInBasisPoints",
            "type": "uint16"
          },
          {
            "internalType": "uint64",
            "name": "loanStartTime",
            "type": "uint64"
          },
          {
            "internalType": "address",
            "name": "nftCollateralContract",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "borrower",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "lender",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "useLendingPool",
            "type": "bool"
          }
        ],
        "indexed": false,
        "internalType": "struct LoanData.LoanTerms",
        "name": "loanTerms",
        "type": "tuple"
      }
    ],
    "name": "LoanStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newMaximumLoanDuration",
        "type": "uint256"
      }
    ],
    "name": "MaximumLoanDurationUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Paused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Unpaused",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "HUNDRED_PERCENT",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_loanId",
        "type": "bytes32"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "principalAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maximumRepaymentAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "nftCollateralId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "nftCollateralContract",
            "type": "address"
          },
          {
            "internalType": "uint32",
            "name": "duration",
            "type": "uint32"
          },
          {
            "internalType": "uint16",
            "name": "adminFeeInBasisPoints",
            "type": "uint16"
          },
          {
            "internalType": "address",
            "name": "erc20Denomination",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "lendingPool",
            "type": "address"
          }
        ],
        "internalType": "struct LoanData.Offer",
        "name": "_offer",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "nonce",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "expiry",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "signer",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "signature",
            "type": "bytes"
          }
        ],
        "internalType": "struct LoanData.Signature",
        "name": "_signature",
        "type": "tuple"
      }
    ],
    "name": "acceptOffer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "adminFeeInBasisPoints",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_nonce",
        "type": "uint256"
      }
    ],
    "name": "cancelLoanCommitmentBeforeLoanHasBegun",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_receiver",
        "type": "address"
      }
    ],
    "name": "drainERC20Airdrop",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_receiver",
        "type": "address"
      }
    ],
    "name": "drainERC721Airdrop",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_erc20",
        "type": "address"
      }
    ],
    "name": "getERC20Permit",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_nftContract",
        "type": "address"
      }
    ],
    "name": "getNftPermit",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_nonce",
        "type": "uint256"
      }
    ],
    "name": "getWhetherNonceHasBeenUsedForUser",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_loanId",
        "type": "bytes32"
      }
    ],
    "name": "isValidLoanId",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_loanId",
        "type": "bytes32"
      }
    ],
    "name": "liquidateOverdueLoan",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "loanIdToLoan",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "principalAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maximumRepaymentAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "nftCollateralId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "erc20Denomination",
        "type": "address"
      },
      {
        "internalType": "uint32",
        "name": "duration",
        "type": "uint32"
      },
      {
        "internalType": "uint16",
        "name": "adminFeeInBasisPoints",
        "type": "uint16"
      },
      {
        "internalType": "uint64",
        "name": "loanStartTime",
        "type": "uint64"
      },
      {
        "internalType": "address",
        "name": "nftCollateralContract",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "borrower",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "lender",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "useLendingPool",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "loanRepaidOrLiquidated",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maximumLoanDuration",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "onERC721Received",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_loanId",
        "type": "bytes32"
      }
    ],
    "name": "payBackLoan",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_loanId",
        "type": "bytes32"
      },
      {
        "internalType": "uint32",
        "name": "_newLoanDuration",
        "type": "uint32"
      },
      {
        "internalType": "uint256",
        "name": "_newMaximumRepaymentAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_renegotiationFee",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "nonce",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "expiry",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "signer",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "signature",
            "type": "bytes"
          }
        ],
        "internalType": "struct LoanData.Signature",
        "name": "_signature",
        "type": "tuple"
      }
    ],
    "name": "renegotiateLoan",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_erc20",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "_permit",
        "type": "bool"
      }
    ],
    "name": "setERC20Permit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_nftContract",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "_isPermitted",
        "type": "bool"
      }
    ],
    "name": "setNFTPermit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "_newAdminFeeInBasisPoints",
        "type": "uint16"
      }
    ],
    "name": "updateAdminFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_newMaximumLoanDuration",
        "type": "uint256"
      }
    ],
    "name": "updateMaximumLoanDuration",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];