// Loading env configs for deploying and public contract source
require("dotenv").config();

// Solidity compile
import "solidity-coverage";

import "hardhat-contract-sizer";

// Using hardhat-ethers plugin for deploying
// See here: https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html
//           https://hardhat.org/guides/deploying.html
import "@nomiclabs/hardhat-ethers";

// Testing plugins with Waffle
// See here: https://hardhat.org/guides/waffle-testing.html
import "@nomiclabs/hardhat-waffle";

// This plugin runs solhint on the project's sources and prints the report
// See here: https://hardhat.org/plugins/nomiclabs-hardhat-solhint.html
import "@nomiclabs/hardhat-solhint";

// Verify and public source code on etherscan
import "@nomiclabs/hardhat-etherscan";

import "@openzeppelin/hardhat-upgrades";

// Report gas
// import "hardhat-gas-reporter");

// This plugin adds ways to ignore Solidity warnings
import "hardhat-ignore-warnings";
import { HardhatUserConfig } from "hardhat/types";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      accounts: { count: 100 },
      allowUnlimitedContractSize: false,
      blockGasLimit: 500e9,
    },
    cvc_testnet: {
      url: process.env.CVC_RPC,
      accounts: [process.env.SYSTEM_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHER_API_KEY,
      bsc: process.env.BINANCE_API_KEY,
      polygon: process.env.POLYGON_API_KEY,
      goerli: process.env.STAGING_ETHER_API_KEY,
      bscTestnet: process.env.STAGING_BINANCE_API_KEY,
      polygonMumbai: process.env.STAGING_POLYGON_API_KEY,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    deploy: "deploy",
    deployments: "deployments",
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: false,
    strict: true,
  },
  mocha: {
    timeout: 200000,
    useColors: true,
    reporter: "mocha-multi-reporters",
    reporterOptions: {
      configFile: "./mocha-report.json",
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    token: "BNB",
    gasPrice: 30,
    coinmarketcap: process.env.COIN_MARKET_API,
  },
  exposed: { prefix: "$" },
};

module.exports = config;
