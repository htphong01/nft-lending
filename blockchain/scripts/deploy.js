const { ethers } = require("hardhat");
const { deployProxyAndLogger, contractFactoriesLoader } = require("../utils/deploy.utils");
const { blockTimestamp } = require('../utils/test.utils');
const fs = require("fs");
require("dotenv").config();
const env = process.env;

async function main() {
    //* Get network */
    const network = await ethers.provider.getNetwork();
    const networkName = network.chainId === 31337 ? "hardhat" : network.name;
    const blockTimeNow = await blockTimestamp();

    //* Loading accounts */
    const accounts = await ethers.getSigners();
    const addresses = accounts.map((item) => item.address);
    const deployer = addresses[0];

    //* Loading contract factories */
    const { Monkey721, Monkey1155 } = await contractFactoriesLoader();

    //* Deploy contracts */
    const underline = "=".repeat(93);
    console.log(underline);
    console.log("DEPLOYING CONTRACTS");
    console.log(underline);
    console.log("chainId   :>> ", network.chainId);
    console.log("chainName :>> ", networkName);
    console.log("deployer  :>> ", deployer);
    console.log(underline);

    const verifyArguments = {
        chainId: network.chainId,
        networkName,
        deployer,
    };

    const monkey721 = await deployProxyAndLogger(Monkey721, [
        "https://ipfs",
        "Monkey 721",
        "M721"
    ]);
    verifyArguments.monkey721 = monkey721.address;
    verifyArguments.monkey721Verify = monkey721.addressVerify;

    const monkey1155 = await deployProxyAndLogger(Monkey1155, [
        "https://ipfs",
        "Monkey 1155",
        "M1155"
    ]);
    verifyArguments.monkey1155 = monkey1155.address;
    verifyArguments.monkey1155Verify = monkey1155.addressVerify;

    console.log(underline);
    console.log("DONE");
    console.log(underline);

    const dir = `./deploy-history/${network.chainId}-${networkName}/`;
    const fileName = network.chainId === 31337 ? "hardhat" : blockTimeNow;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    await fs.writeFileSync("contracts.json", JSON.stringify(verifyArguments));
    await fs.writeFileSync(`${dir}/${fileName}.json`, JSON.stringify(verifyArguments));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
