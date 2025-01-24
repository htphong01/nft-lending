import { expect } from "chai";
import { ethers } from "hardhat";
import { parseEther } from "ethers/lib/utils";
import { constants } from "ethers";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const ItemStatus = {
  OPENING: 0,
  SOLD: 1,
  CLOSED: 2,
};

let FEE_PERCENTAGE = 10;

describe.only("NFTMarketplace", function () {
  let nft: Contract;
  let paymentToken: Contract;
  let marketplace: Contract;
  let liquidateNFTPool: Contract;
  let deployer: SignerWithAddress;
  let feeReceiver: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let loan: SignerWithAddress;
  let treasury: SignerWithAddress;

  beforeEach(async function () {
    [deployer, feeReceiver, user1, user2, loan, treasury] = await ethers.getSigners();

    const ChonkSociety = await ethers.getContractFactory("ChonkSociety");
    const WXENE = await ethers.getContractFactory("WXENE");
    const LiquidateNFTPool = await ethers.getContractFactory("LiquidateNFTPool");
    const Marketplace = await ethers.getContractFactory("Marketplace");

    // To deploy our contracts
    nft = await ChonkSociety.deploy("base test uri");
    paymentToken = await WXENE.deploy();
    liquidateNFTPool = await LiquidateNFTPool.deploy(deployer.address);
    marketplace = await Marketplace.deploy(paymentToken.address, feeReceiver.address, FEE_PERCENTAGE);

    await liquidateNFTPool.setLoanPool(loan.address);
    await liquidateNFTPool.setMarketplace(marketplace.address);
    await marketplace.setLiquidateNFTPool(liquidateNFTPool.address);

    // mint NFTs to users
    await nft.connect(user1).mint(user1.address, 1);
    await nft.connect(user1).setApprovalForAll(marketplace.address, true);

    await nft.connect(loan).mint(loan.address, 1);
    await nft.connect(loan).setApprovalForAll(liquidateNFTPool.address, true);
  });

  describe("Deployment", function () {
    it("should initialized successfully", async () => {
      expect(await marketplace.owner()).to.equal(deployer.address);
      expect(await marketplace.isAdmin(deployer.address)).to.be.true;
      expect(await marketplace.isAdmin(user1.address)).to.be.false;
      expect(await marketplace.feePercent()).to.equal(FEE_PERCENTAGE);
    });
  });

  describe("setLiquidateNFTPool", function () {
    it("should throw error when not admin", async () => {
      await expect(marketplace.connect(user1).setLiquidateNFTPool(user1.address)).to.revertedWith(
        "Ownable: caller is not an admin"
      );
    });

    it("should throw error when address is invalid", async () => {
      await expect(marketplace.setLiquidateNFTPool(constants.AddressZero)).to.revertedWith("Invalid address");
    });

    it("should successfully", async () => {
      await marketplace.setLiquidateNFTPool(liquidateNFTPool.address);
      expect(await marketplace.liquidateNFTPool()).to.equal(liquidateNFTPool.address);
    });
  });

  describe("setWXENE", function () {
    it("should throw error when not admin", async () => {
      await expect(marketplace.connect(user1).setWXENE(user1.address)).to.revertedWith(
        "Ownable: caller is not an admin"
      );
    });

    it("should throw error when address is invalid", async () => {
      await expect(marketplace.setWXENE(constants.AddressZero)).to.revertedWith("Invalid address");
    });

    it("should successfully", async () => {
      await marketplace.setWXENE(paymentToken.address);
      expect(await marketplace.wXENE()).to.equal(paymentToken.address);
    });
  });

  describe("setFeeReceiver", function () {
    it("should throw error when not admin", async () => {
      await expect(marketplace.connect(user1).setFeeReceiver(user1.address)).to.revertedWith(
        "Ownable: caller is not an admin"
      );
    });

    it("should throw error when address is invalid", async () => {
      await expect(marketplace.setFeeReceiver(constants.AddressZero)).to.revertedWith("Invalid address");
    });

    it("should successfully", async () => {
      await marketplace.setFeeReceiver(user1.address);
      expect(await marketplace.feeReceiver()).to.equal(user1.address);
    });
  });

  describe("setFeePercent", function () {
    it("should throw error when not admin", async () => {
      await expect(marketplace.connect(user1).setFeePercent(20)).to.revertedWith("Ownable: caller is not an admin");
    });

    it("should throw error when fee percent is greater than 10000", async () => {
      await expect(marketplace.setFeePercent(10001)).to.revertedWith("Invalid fee percent");
    });

    it("should successfully", async () => {
      await marketplace.setFeePercent(20);
      expect(await marketplace.feePercent()).to.equal(20);
    });
  });

  describe("makeItem", function () {
    it("should throw error when price is zero", async () => {
      await expect(marketplace.connect(user1).makeItem(nft.address, 1, constants.Zero)).to.revertedWith(
        "Price must be greater than zero"
      );
    });

    it("should throw error when nft address is invalid", async () => {
      await expect(marketplace.connect(user1).makeItem(constants.AddressZero, 1, constants.One)).to.revertedWith(
        "Invalid address"
      );
    });

    it("should throw error balance is zero", async () => {
      await expect(marketplace.connect(user2).makeItem(nft.address, 1, constants.One)).to.revertedWith(
        "ERC721: transfer from incorrect owner"
      );
    });

    it("should successfully", async () => {
      await marketplace.connect(user1).makeItem(nft.address, 1, constants.One);

      const marketItem = await marketplace.items(1);
      expect(marketItem.itemId).to.equal(1);
      expect(marketItem.nft).to.equal(nft.address);
      expect(marketItem.tokenId).to.equal(1);
      expect(marketItem.price).to.equal(constants.One);
      expect(marketItem.seller).to.equal(user1.address);
      expect(marketItem.status).to.equal(ItemStatus.OPENING);

      const nftOwner = await nft.ownerOf(1);
      expect(nftOwner).to.equal(marketplace.address);
    });
  });

  describe("liquidate", function () {
    it("should throw error when caller is not liquidateNFTPool", async () => {
      await expect(marketplace.connect(user1).liquidate(nft.address, 1, constants.One)).to.revertedWith(
        "caller is not liquidateNFTPool"
      );
    });

    it("should throw error when price is zero", async () => {
      await marketplace.setLiquidateNFTPool(user1.address);
      await expect(marketplace.connect(user1).liquidate(nft.address, 1, constants.Zero)).to.revertedWith(
        "Price must be greater than zero"
      );
    });

    it("should throw error when nft address is invalid", async () => {
      await marketplace.setLiquidateNFTPool(user1.address);
      await expect(marketplace.connect(user1).liquidate(constants.AddressZero, 1, constants.One)).to.revertedWith(
        "Invalid address"
      );
    });

    it("should successfully", async () => {
      await marketplace.setLiquidateNFTPool(user1.address);
      await marketplace.connect(user1).liquidate(nft.address, 1, constants.One);

      const marketItem = await marketplace.items(1);
      expect(marketItem.itemId).to.equal(1);
      expect(marketItem.nft).to.equal(nft.address);
      expect(marketItem.tokenId).to.equal(1);
      expect(marketItem.price).to.equal(constants.One);
      expect(marketItem.seller).to.equal(user1.address);
      expect(marketItem.status).to.equal(ItemStatus.OPENING);
    });
  });

  describe.only("purchaseItem", async function () {
    it("should throw error when item is not exist", async () => {
      await expect(marketplace.connect(user2).purchaseItems([1])).to.revertedWith("item is not exist");
    });

    it("should throw error when item is not opening", async () => {
      await marketplace.connect(user1).makeItem(nft.address, 1, constants.One);
      await marketplace.connect(user1).closeItem(1);

      await expect(marketplace.connect(user2).purchaseItems([1])).to.revertedWith("item is not opening");
    });

    it("should throw error when not enough balance", async () => {
      await marketplace.connect(user1).makeItem(nft.address, 1, constants.One);

      await expect(marketplace.connect(user2).purchaseItems([1])).to.revertedWith("not enough balance");
    });

    it("should successfully", async () => {
      const PermittedNFTs = await ethers.getContractFactory("PermittedNFTs");
      const LoanChecksAndCalculations = await ethers.getContractFactory("LoanChecksAndCalculations");
      const NFTfiSigningUtils = await ethers.getContractFactory("NFTfiSigningUtils");
      const LendingPool = await ethers.getContractFactory("LendingPoolV3");

      let loanChecksAndCalculations = await LoanChecksAndCalculations.deploy();
      await loanChecksAndCalculations.deployed();

      let nftfiSigningUtils = await NFTfiSigningUtils.deploy();
      await nftfiSigningUtils.deployed();

      const DirectLoanFixedOffer = await ethers.getContractFactory("DirectLoanFixedOffer", {
        libraries: {
          LoanChecksAndCalculations: loanChecksAndCalculations.address,
          NFTfiSigningUtils: nftfiSigningUtils.address,
        },
      });

      const lendingPool = await LendingPool.deploy(paymentToken.address, treasury.address, "10000000000000000000", 0);
      await lendingPool.deployed();

      const permittedNFTs = await PermittedNFTs.deploy(deployer.address);
      await permittedNFTs.deployed();

      const directLoanFixedOffer = await DirectLoanFixedOffer.deploy(
        deployer.address,
        lendingPool.address,
        liquidateNFTPool.address,
        permittedNFTs.address,
        [paymentToken.address]
      );
      await directLoanFixedOffer.deployed();

      await liquidateNFTPool.setLoanPool(directLoanFixedOffer.address);

      // // user 1 make item
      // await marketplace.connect(user1).makeItem(nft.address, 1, constants.One);

      // // loan liquidate item
      // const loanId = "0xebe4fe30af161bb8b26d55867c264d98c256cbfe364c00ea2cb779d1233d67f1";
      // await liquidateNFTPool.connect(loan).liquidateNFT(loanId, nft.address, 2, paymentToken.address, constants.One);

      // expect(await nft.ownerOf(1)).to.equal(marketplace.address);
      // expect(await nft.ownerOf(2)).to.equal(marketplace.address);
      // expect(await marketplace.itemCount()).to.equal(2);

      // await marketplace.connect(user2).purchaseItems([1, 2], { value: constants.Two });

      // const marketItem = await marketplace.items(1);
      // expect(marketItem.status).to.equal(ItemStatus.SOLD);
    });
  });

  //   describe("Purchasing marketplace items in cart", function () {
  //     let price = 1;
  //     const itemIds = [1, 2, 3, 4, 5];
  //     const payable = parseEther(price.toString()).mul(itemIds.length);
  //     const fee = marketFee(payable, feePercent);
  //     beforeEach(async function () {
  //       // addr1 mints an nft
  //       await nft.connect(addr1).mint(addr1.address);
  //       await nft.connect(addr1).mint(addr1.address);
  //       await nft.connect(addr1).mint(addr1.address);
  //       await nft.connect(addr1).mint(addr1.address);
  //       await nft.connect(addr1).mint(addr1.address);
  //       // addr1 approves marketplace to spend tokens
  //       await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
  //       // addr1 makes their nft a marketplace item.
  //       await Promise.all(
  //         itemIds.map(async (id) => {
  //           await marketplace.connect(addr1).makeItem(nft.address, id, parseEther(price.toString()));
  //         })
  //       );
  //     });
  //     it("Should update item as sold, pay seller, transfer NFT to buyer, charge fees and emit a Bought event", async function () {
  //       const sellerInitialEthBal = await addr1.getBalance();
  //       const feeAccountInitialEthBal = await deployer.getBalance();

  //       // addr 2 purchases item.
  //       await marketplace.connect(addr2).purchaseItems(itemIds, { value: payable.add(1) });

  //       const sellerFinalEthBal = await addr1.getBalance();
  //       const feeAccountFinalEthBal = await deployer.getBalance();
  //       // Item should be marked as sold
  //       expect((await marketplace.items(1)).status).to.equal(ItemStatus.SOLD);
  //       expect((await marketplace.items(2)).status).to.equal(ItemStatus.SOLD);
  //       expect((await marketplace.items(3)).status).to.equal(ItemStatus.SOLD);
  //       expect((await marketplace.items(4)).status).to.equal(ItemStatus.SOLD);
  //       expect((await marketplace.items(5)).status).to.equal(ItemStatus.SOLD);

  //       // Seller should receive payment for the price of the NFT sold.
  //       expect(sellerFinalEthBal).to.equal(sellerInitialEthBal.add(payable.sub(fee)));
  //       // feeAccount should receive fee
  //       expect(feeAccountFinalEthBal).to.equal(feeAccountInitialEthBal.add(fee).add(1));
  //       // The buyer should now own the nft
  //       expect(await nft.ownerOf(1)).to.equal(addr2.address);
  //       expect(await nft.ownerOf(2)).to.equal(addr2.address);
  //       expect(await nft.ownerOf(3)).to.equal(addr2.address);
  //       expect(await nft.ownerOf(4)).to.equal(addr2.address);
  //       expect(await nft.ownerOf(5)).to.equal(addr2.address);
  //     });

  //     it("Should fail for invalid item ids, sold items and when not enough ether is paid", async function () {
  //       // fails for invalid item ids
  //       await expect(
  //         marketplace.connect(addr2).purchaseItems([6], { value: parseEther(price.toString()) })
  //       ).to.be.revertedWith("item doesn't exist");
  //       await expect(
  //         marketplace.connect(addr2).purchaseItems([0], { value: parseEther(price.toString()) })
  //       ).to.be.revertedWith("item doesn't exist");
  //       // Fails when not enough ether is paid with the transaction.
  //       await expect(marketplace.connect(addr2).purchaseItems(itemIds, { value: payable.sub(1) })).to.be.revertedWith(
  //         "not enough ether to paid"
  //       );
  //       // addr2 purchases item 1
  //       await marketplace.connect(addr2).purchaseItems(itemIds, { value: payable });
  //       // addr3 tries purchasing item 1 after its been sold
  //       const addr3 = addrs[0];
  //       await expect(marketplace.connect(addr3).purchaseItems(itemIds, { value: payable })).to.be.revertedWith(
  //         "item already sold"
  //       );
  //     });
  //   });

  //   describe("Purchasing items from seller and loan", () => {
  //     let price = 1;
  //     const itemIds = [1, 2, 3, 4];
  //     beforeEach(async function () {
  //       // addr1 mints an nft
  //       await nft.connect(addr1).mint(addr1.address);
  //       await nft.connect(addr1).mint(addr1.address);
  //       // loan mints an nft
  //       await nft.connect(loan).mint(loan.address);
  //       await nft.connect(loan).mint(loan.address);
  //       // addr1 approves marketplace to spend tokens
  //       await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
  //       // loan approves liquidateNFTPool to spend tokens
  //       await nft.connect(loan).setApprovalForAll(liquidateNFTPool.address, true);
  //       // addr1 makes their nft a marketplace item.
  //       await marketplace.connect(addr1).makeItem(nft.address, 1, parseEther(price.toString()));
  //       await marketplace.connect(addr1).makeItem(nft.address, 2, parseEther(price.toString()));
  //       // loan makes their nft a liquidateNFTPool item.
  //       await liquidateNFTPool
  //         .connect(loan)
  //         .liquidateNFT(
  //           ethers.utils.formatBytes32String("1"),
  //           nft.address,
  //           3,
  //           wXENE.address,
  //           parseEther(price.toString())
  //         );
  //       await liquidateNFTPool
  //         .connect(loan)
  //         .liquidateNFT(
  //           ethers.utils.formatBytes32String("2"),
  //           nft.address,
  //           4,
  //           wXENE.address,
  //           parseEther(price.toString())
  //         );
  //     });

  //     /**
  //      * Seller: pool, addr1
  //      * addr1 => Items [1, 2] | 1 XENE/item | marketFee is 10%
  //      * pool  => Items [3, 4] | 1 XENE/item |
  //      * Calculate:
  //      * addr2 => purchaseItems([1, 2, 3, 4]) => | addr2:     -4 XENE                         | => transfer nft 1 to addr2
  //      *                                         | marketFee: (2 XENE * 10) / 100 = +0.2 XENE  |    transfer nft 2 to addr2
  //      *                                         | addr1:      2 XENE - 0.2 XENE   = +1.8 XENE  |    transfer nft 3 to addr2
  //      *                                         | loan:      +2 wXENE                        |    transfer nft 4 to addr2
  //      */
  //     it("addr2: -4XENE, marketplace: +0.2XENE, add1: +1.8XENE, loan: +2wXENE", async () => {
  //       expect(await wXENE.balanceOf(loan.address)).to.eq(0);

  //       await expect(() =>
  //         marketplace.connect(addr2).purchaseItems(itemIds, { value: parseEther("4") })
  //       ).to.changeEtherBalances(
  //         [addr1, addr2, deployer, loan],
  //         [parseEther("1.8"), parseEther("-4"), parseEther("0.2"), 0]
  //       );

  //       expect(await wXENE.balanceOf(loan.address)).to.eq(parseEther("2"));

  //       expect(await nft.ownerOf(1)).to.equal(addr2.address);
  //       expect(await nft.ownerOf(2)).to.equal(addr2.address);
  //       expect(await nft.ownerOf(3)).to.equal(addr2.address);
  //       expect(await nft.ownerOf(4)).to.equal(addr2.address);
  //     });
  //   });
});

function marketFee(itemPrice, marketPercent) {
  return itemPrice.mul(marketPercent).div(100);
}
