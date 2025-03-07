import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Token Bound Account", () => {
  async function deployFixture() {
    const [user1, user2, user3, treasury] = await ethers.getSigners();

    const mockERC721 = await ethers.deployContract("ChonkSociety", ["test uri"]);
    const tokenBoundAccount = await ethers.deployContract("TokenBoundAccount");
    const tokenBoundAccountRegistry = await ethers.deployContract("TokenBoundAccountRegistry");
    const wXENE = await ethers.deployContract("WXENE");

    return { user1, user2, user3, treasury, mockERC721, wXENE, tokenBoundAccount, tokenBoundAccountRegistry };
  }

  it("createAccount", async () => {
    const { user1, user2, mockERC721, tokenBoundAccount, tokenBoundAccountRegistry, wXENE } = await loadFixture(
      deployFixture
    );
    await mockERC721.connect(user1).mint(user1.address, 1);

    await tokenBoundAccountRegistry.createAccount(tokenBoundAccount, 31337, mockERC721, 1, 1);

    const account = await tokenBoundAccountRegistry.account(tokenBoundAccount, 31337, mockERC721, 1, 1);

    await expect(wXENE.mintTo(account, { value: ethers.parseEther("1") })).to.changeTokenBalances(
      wXENE,
      [account],
      [ethers.parseEther("1")]
    );
    await mockERC721.mint(user2, 1);
    await mockERC721.connect(user2).transferFrom(user2, account, 2);
    expect(await mockERC721.ownerOf(2)).to.equal(account);

    // Transfer account
    await mockERC721.connect(user1).transferFrom(user1, user2, 1);
    expect(await wXENE.balanceOf(account)).to.equal(ethers.parseEther("1"));
    expect(await mockERC721.ownerOf(2)).to.equal(account);
  });
});
