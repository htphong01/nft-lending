require("dotenv").config();

// Solidity compile
import "solidity-coverage";

import "@nomicfoundation/hardhat-toolbox";

// Report gas
// import "hardhat-gas-reporter");

import { HardhatUserConfig } from "hardhat/types";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      accounts: { count: 100 },
      allowUnlimitedContractSize: false,
    },
    cvc_testnet: {
      url: process.env.CVC_RPC,
      accounts: [process.env.SYSTEM_PRIVATE_KEY ?? ""],
    },
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHER_API_KEY ?? "",
      bsc: process.env.BINANCE_API_KEY ?? "",
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
};

module.exports = config;
