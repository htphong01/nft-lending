const { ethers } = require("hardhat");
const { deployProxyAndLogger, contractFactoriesLoader } = require("../utils/deploy.utils");
const { blockTimestamp } = require('../utils/test.utils');
const fs = require("fs");
require("dotenv").config();
const env = process.env;

async function main() {
    //* Get network */
    const accounts = await ethers.getSigners();

    console.log("==========================================================================");
    console.log("ACCOUNTS:");
    console.log("==========================================================================");
    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        console.log(` Account ${i}: ${account.address}`);
    }

    //* Loading contract factory */
    const LendingPool = await ethers.getContractFactory("LendingPool");
    const WXCR = await ethers.getContractFactory("WXCR");
    const Point = await ethers.getContractFactory("Point");

    //* Deploy contracts */
    console.log("==========================================================================");
    console.log("DEPLOYING CONTRACTS");
    console.log("==========================================================================");

    // const wXCR = await WXCR.deploy();
    // await wXCR.deployed();
    // console.log("WXCR                        deployed to:>>", wXCR.address);

    const wXCR = await WXCR.attach("0x747ae7Dcf3Ea10D242bd17bA5dfA034ca6102108");

    const point = await Point.deploy();
    await point.deployed();
    console.log("Point                        deployed to:>>", point.address);

    const lendingPool = await LendingPool.deploy(wXCR.address, point.address);
    await lendingPool.deployed();
    console.log("LendingPool                     deployed to:>>", lendingPool.address);

    console.log("==========================================================================");
    console.log("VERIFY CONTRACTS");
    console.log("==========================================================================");

    // await hre
    //     .run("verify:verify", {
    //         address: wXCR.address
    //     })
    //     .catch(console.log);

    // await hre
    //     .run("verify:verify", {
    //         address: point.address
    //     })
    //     .catch(console.log);

    // await hre
    //     .run("verify:verify", {
    //         address: lendingPool.address,
    //         constructorArguments: [wXCR.address,
    //         point.address
    //         ]
    //     })
    //     .catch(console.log);

    console.log("==========================================================================");
    console.log("DONE");
    console.log("==========================================================================");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
