import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Token Bound Account", () => {
  async function deployFixture() {
    const [user1, user2, user3, treasury] = await ethers.getSigners();

    const mockERC721 = await ethers.deployContract("MockERC721");
    const tokenBoundAccount = await ethers.deployContract("TokenBoundAccount");
    const tokenBoundAccountRegistry = await ethers.deployContract("TokenBoundAccountRegistry");

    return { user1, user2, user3, treasury, mockERC721, tokenBoundAccount, tokenBoundAccountRegistry };
  }

  it("createAccount", async () => {
    const { user1, mockERC721, tokenBoundAccount, tokenBoundAccountRegistry } = await loadFixture(deployFixture);
    await mockERC721.connect(user1).mint(user1.address);
    const tx = await tokenBoundAccountRegistry.createAccount(tokenBoundAccount, 31337, mockERC721, 1, 200);
    // await expect(tx).to.changeTokenBalances(mockERC721, [tokenBoundAccount], [1]);
  });
});
