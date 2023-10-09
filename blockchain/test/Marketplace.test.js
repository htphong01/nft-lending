const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");

const ItemStatus = {
    OPENING: 0,
    SOLD: 1,
    CLOSED: 2
}

describe("NFTMarketplace", function () {

    let NFT;
    let nft;
    let Marketplace;
    let marketplace
    let deployer;
    let addr1;
    let addr2;
    let addrs;
    let feePercent = 10;

    beforeEach(async function () {
        // Get the ContractFactories and Signers here.
        NFT = await ethers.getContractFactory("MockERC721");
        Marketplace = await ethers.getContractFactory("Marketplace");
        [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();

        // To deploy our contracts
        nft = await NFT.deploy();
        marketplace = await Marketplace.deploy(feePercent);
    });

    describe("Deployment", function () {

        it("Should track name and symbol of the nft collection", async function () {
            // This test expects the owner variable stored in the contract to be equal
            // to our Signer's owner.
            const nftName = "MockERC721"
            const nftSymbol = "ERC721"
            expect(await nft.name()).to.equal(nftName);
            expect(await nft.symbol()).to.equal(nftSymbol);
        });

        it("Should track feeAccount and feePercent of the marketplace", async function () {
            expect(await marketplace.feeAccount()).to.equal(deployer.address);
            expect(await marketplace.feePercent()).to.equal(feePercent);
        });
    });

    describe("Minting NFTs", function () {

        it("Should track each minted NFT", async function () {
            // addr1 mints an nft
            await nft.connect(addr1).mint(addr1.address)
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            // addr2 mints an nft
            await nft.connect(addr2).mint(addr2.address)
            expect(await nft.balanceOf(addr2.address)).to.equal(1);
        });
    })

    describe("Making marketplace items", function () {
        let price = 1
        let result
        beforeEach(async function () {
            // addr1 mints an nft
            await nft.connect(addr1).mint(addr1.address)
            // addr1 approves marketplace to spend nft
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true)
        })


        it("Should track newly created item, transfer NFT from seller to marketplace and emit Offered event", async function () {
            // addr1 offers their nft at a price of 1 ether
            await expect(marketplace.connect(addr1).makeItem(nft.address, 1, parseEther(price.toString())))
                .to.emit(marketplace, "Offered")
                .withArgs(
                    1,
                    nft.address,
                    1,
                    parseEther(price.toString()),
                    addr1.address
                )
            // Owner of NFT should now be the marketplace
            expect(await nft.ownerOf(1)).to.equal(marketplace.address);
            // Item count should now equal 1
            expect(await marketplace.itemCount()).to.equal(1)
            // Get item from items mapping then check fields to ensure they are correct
            const item = await marketplace.items(1)
            expect(item.itemId).to.equal(1)
            expect(item.nft).to.equal(nft.address)
            expect(item.tokenId).to.equal(1)
            expect(item.price).to.equal(parseEther(price.toString()))
            expect(item.status).to.equal(ItemStatus.OPENING)
        });

        it("Should fail if price is set to zero", async function () {
            await expect(
                marketplace.connect(addr1).makeItem(nft.address, 1, 0)
            ).to.be.revertedWith("Price must be greater than zero");
        });

    });
    describe("Purchasing marketplace items", function () {
        let price = 1
        let fee = marketFee(parseEther(price.toString()), feePercent);
        let totalPriceInWei
        beforeEach(async function () {
            // addr1 mints an nft
            await nft.connect(addr1).mint(addr1.address)
            // addr1 approves marketplace to spend tokens
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true)
            // addr1 makes their nft a marketplace item.
            await marketplace.connect(addr1).makeItem(nft.address, 1, parseEther(price.toString()))
        })
        it("Should update item as sold, pay seller, transfer NFT to buyer, charge fees and emit a Bought event", async function () {
            const sellerInitalEthBal = await addr1.getBalance()
            const feeAccountInitialEthBal = await deployer.getBalance()
            // addr 2 purchases item.
            await expect(marketplace.connect(addr2).purchaseItem(1, { value: parseEther(price.toString()) }))
                .to.emit(marketplace, "Bought")
                .withArgs(
                    1,
                    nft.address,
                    1,
                    parseEther(price.toString()),
                    addr1.address,
                    addr2.address
                )
            const sellerFinalEthBal = await addr1.getBalance()
            const feeAccountFinalEthBal = await deployer.getBalance()
            // Item should be marked as sold
            expect((await marketplace.items(1)).status).to.equal(ItemStatus.SOLD)
            // Seller should receive payment for the price of the NFT sold.
            expect(sellerFinalEthBal).to.equal(sellerInitalEthBal.add(parseEther(price.toString()).sub(fee)))
            // feeAccount should receive fee
            expect(feeAccountFinalEthBal).to.equal(feeAccountInitialEthBal.add(fee))
            // The buyer should now own the nft
            expect(await nft.ownerOf(1)).to.equal(addr2.address);
        })

        it("Should fail for invalid item ids, sold items and when not enough ether is paid", async function () {
            // fails for invalid item ids
            await expect(
                marketplace.connect(addr2).purchaseItem(2, { value: totalPriceInWei })
            ).to.be.revertedWith("item doesn't exist");
            await expect(
                marketplace.connect(addr2).purchaseItem(0, { value: totalPriceInWei })
            ).to.be.revertedWith("item doesn't exist");
            // Fails when not enough ether is paid with the transaction. 
            await expect(
                marketplace.connect(addr2).purchaseItem(1, { value: parseEther(price.toString()).sub(1) })
            ).to.be.revertedWith("invalid value to pay");
            // addr2 purchases item 1
            await marketplace.connect(addr2).purchaseItem(1, { value: parseEther(price.toString()) })
            // addr3 tries purchasing item 1 after its been sold 
            const addr3 = addrs[0]
            await expect(
                marketplace.connect(addr3).purchaseItem(1, { value: parseEther(price.toString()) })
            ).to.be.revertedWith("item already sold");
        });
    })
})

function marketFee(itemPrice, marketPercent) {
    return itemPrice.mul(marketPercent).div(100);
}