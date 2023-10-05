const { ethers } = require("hardhat");
const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");
const { getTimestamp, skipTime } = require("./utils")

require("dotenv").config();

const TEN_MINUTES = 600;

describe("Marketplace", () => {
    before(async () => {
        //** Get Wallets */
        [user1, user2, user3] = await ethers.getSigners();

        //** Get Contracts */
        const Marketplace = await ethers.getContractFactory("Marketplace");
        const MockERC721 = await ethers.getContractFactory("MockERC721");
        const MockERC1155 = await ethers.getContractFactory("MockERC1155");

        const marketPercent = 10 * 1e6;
        marketplace = await Marketplace.deploy(marketPercent);
        myERC721 = await MockERC721.deploy();
        myERC1155 = await MockERC1155.deploy();

        expect(await marketplace.verifier()).to.eq(user1.address);
        expect(await marketplace.feeAccount()).to.eq(user1.address);
        expect(await marketplace.feePercent()).to.eq(marketPercent);

        // Offer Time
        expTime = await getTimestamp() + TEN_MINUTES;
    });

    describe("mint", () => {
        it("mint erc721", async () => {
            await myERC721.connect(user2).mint(user2.address);
            await myERC721.connect(user2).mint(user2.address);

            expect(await myERC721.balanceOf(user2.address)).to.eq(2);
        })

        it("mint erc1155", async () => {
            await myERC1155.connect(user2).mint(user2.address, 50);
            expect(await myERC1155.balanceOf(user2.address, 1)).to.eq(50);
        })
    })

    describe("purchase", () => {
        it("make offer erc721", async () => {
            const itemId = 1;
            const nft = myERC721.address;
            const tokenId = 1;
            const totalAmount = 1;
            const price = parseEther('1');
            const seller = user2.address;
            const nonce = 1;
            offer1 = [itemId, nft, tokenId, totalAmount, price, expTime, seller, nonce];

            const messageHash = await ethers.utils.defaultAbiCoder.encode(
                ["uint256", "address", "uint256", "uint256", "uint256", "uint256", "address", "uint256"],
                [itemId, nft, tokenId, totalAmount, price, expTime, seller, nonce]
            );

            // Make offer
            const signature = await user1.signMessage(ethers.utils.arrayify(messageHash));

            // Approval all to Marketplace
            await myERC721.connect(user2).setApprovalForAll(marketplace.address, true);

            offer1.push(signature);
            expect(await marketplace.signatureUsed(signature)).to.eq(false);
        })

        it("make offer erc1155", async () => {
            const itemId = 2;
            const nft = myERC1155.address;
            const tokenId = 1;
            const totalAmount = 50;
            const price = parseEther('1');
            const seller = user2.address;
            const nonce = 2;
            offer2 = [itemId, nft, tokenId, totalAmount, price, expTime, seller, nonce];

            const messageHash = await ethers.utils.defaultAbiCoder.encode(
                ["uint256", "address", "uint256", "uint256", "uint256", "uint256", "address", "uint256"],
                [itemId, nft, tokenId, totalAmount, price, expTime, seller, nonce]
            );

            // Make offer
            const signature = await user1.signMessage(ethers.utils.arrayify(messageHash));

            // Approval all to Marketplace
            await myERC1155.connect(user2).setApprovalForAll(marketplace.address, true);

            offer2.push(signature);
            expect(await marketplace.signatureUsed(signature)).to.eq(false);
        })

        it("should return exception 'Amount exceeds balance'", async () => {
            let amount = 2;
            await expect(marketplace.connect(user3).purchaseItem(offer1, amount, { value: offer1[4] })).to.revertedWith("Amount exceeds balance");

            amount = 51;
            await expect(marketplace.connect(user3).purchaseItem(offer2, amount, { value: offer2[4].mul(amount) })).to.revertedWith("Amount exceeds balance");
        })

        it("should return exception 'The purchase price is not accurate'", async () => {
            let amount = 1;
            let priceInvalid = offer1[4].sub(1);
            await expect(marketplace.connect(user3).purchaseItem(offer1, amount, { value: priceInvalid })).to.revertedWith("The purchase price is not accurate");

            amount = 20;
            priceInvalid = offer2[4].mul(amount).sub(1);
            await expect(marketplace.connect(user3).purchaseItem(offer2, amount, { value: priceInvalid })).to.revertedWith("The purchase price is not accurate");
        })

        it("purchase item erc721 successfully", async () => {
            const amount = 1;
            const pricePay = offer1[4];
            const marketFee = getPriceToPercent(pricePay, 10);
            const sellerFee = pricePay.sub(marketFee);
            // before purchase
            expect(await myERC721.balanceOf(user3.address)).to.eq(0);
            expect(await myERC721.ownerOf(1)).to.eq(user2.address);

            // purchase
            await expect(() => marketplace.connect(user3).purchaseItem(offer1, amount, { value: offer1[4] })).to.changeEtherBalances([user1, user2, user3], [marketFee, sellerFee, pricePay.mul(-1)]);

            // after purchase
            expect(await myERC721.balanceOf(user3.address)).to.eq(1);
            expect(await myERC721.ownerOf(1)).to.eq(user3.address);
        })

        it("purchase item erc1155 successfully", async () => {
            const amount = 20;
            const pricePay = offer2[4].mul(amount);
            const marketFee = getPriceToPercent(pricePay, 10);
            const sellerFee = pricePay.sub(marketFee);

            // before purchase
            expect(await myERC1155.balanceOf(user3.address, 1)).to.eq(0);
            expect(await myERC1155.balanceOf(user2.address, 1)).to.eq(50);

            // purchase
            await expect(() => marketplace.connect(user3).purchaseItem(offer2, amount, { value: offer2[4].mul(amount) })).to.changeEtherBalances([user1, user2, user3], [marketFee, sellerFee, pricePay.mul(-1)]);

            // after purchase
            expect(await myERC1155.balanceOf(user3.address, 1)).to.eq(amount);
            expect(await myERC1155.balanceOf(user2.address, 1)).to.eq(50 - amount);
        })

        it("purchase with signature is used", async () => {
            await expect(marketplace.connect(user3).purchaseItem(offer1, 1, { value: offer1[4] })).to.revertedWith("Invalid signature");
            await expect(marketplace.connect(user3).purchaseItem(offer2, 20, { value: offer2[4].mul(20) })).to.revertedWith("Invalid signature");
        })

        it("purchase with signature sign by other user", async () => {
            const itemId = 2;
            const nft = myERC1155.address;
            const tokenId = 1;
            const totalAmount = 30;
            const price = parseEther('1');
            const seller = user2.address;
            const nonce = 3;
            let offer3 = [itemId, nft, tokenId, totalAmount, price, expTime, seller, nonce];

            const messageHash = await ethers.utils.defaultAbiCoder.encode(
                ["uint256", "address", "uint256", "uint256", "uint256", "uint256", "address", "uint256"],
                [itemId, nft, tokenId, totalAmount, price, expTime, seller, nonce]
            );

            // Make offer
            expect(await marketplace.verifier()).to.not.eq(user3.address);
            let signature = await user3.signMessage(ethers.utils.arrayify(messageHash));
            offer3.push(signature);

            // purchase
            const amount = 20;
            const pricePay = offer3[4].mul(amount);
            const marketFee = getPriceToPercent(pricePay, 10);
            const sellerFee = pricePay.sub(marketFee);

            // purchase with signature invalid
            await expect(marketplace.connect(user3).purchaseItem(offer3, amount, { value: offer3[4].mul(amount) })).to.revertedWith("Invalid signature");

            // sign with verifier
            signature = await user1.signMessage(ethers.utils.arrayify(messageHash));
            offer3[offer3.length - 1] = signature;

            await expect(() => marketplace.connect(user3).purchaseItem(offer3, amount, { value: offer2[4].mul(amount) })).to.changeEtherBalances([user1, user2, user3], [marketFee, sellerFee, pricePay.mul(-1)]);
        })

        it("should return exception 'The purchasing time has expired'", async () => {
            const itemId = 2;
            const nft = myERC1155.address;
            const tokenId = 1;
            const totalAmount = 10;
            const price = parseEther('1');
            const seller = user2.address;
            const nonce = 4;
            let offer4 = [itemId, nft, tokenId, totalAmount, price, expTime, seller, nonce];

            const messageHash = await ethers.utils.defaultAbiCoder.encode(
                ["uint256", "address", "uint256", "uint256", "uint256", "uint256", "address", "uint256"],
                [itemId, nft, tokenId, totalAmount, price, expTime, seller, nonce]
            );

            // Make offer
            const signature = await user1.signMessage(ethers.utils.arrayify(messageHash));
            offer4.push(signature);

            // purchase
            await skipTime(expTime);
            const amount = 10;
            await expect(marketplace.connect(user3).purchaseItem(offer4, amount, { value: offer4[4].mul(amount) })).to.revertedWith("The purchasing time has expired");
        })
    })
});

function getPriceToPercent(price, percent) {
    return (price.mul(percent * 1e6)).div(100 * 1e6)
}
