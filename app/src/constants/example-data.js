import axios from "axios";

export const CURRENT_LOANS = [
  {
    asset: "Lil Pudgy",
    name: "Lil Pudgy #1",
    status: "Waiting",
    lender: "0x77B6ddbA6AfB1A74979011a07d078Be28f8bF835",
    borrower: "0xAc84926f0b9df7ff3B4f4377C5536Fff89e9aF54",
    duration: "30 days",
    due: "28/7/2023",
    loanValue: "3 XCR",
    repayment: "3.5 XCR",
    apr: "125.3%",
  },
  {
    asset: "Lil Pudgy",
    name: "Lil Pudgy #1",
    status: "Waiting",
    lender: "0x77B6ddbA6AfB1A74979011a07d078Be28f8bF835",
    borrower: "0xAc84926f0b9df7ff3B4f4377C5536Fff89e9aF54",
    duration: "30 days",
    due: "28/7/2023",
    loanValue: "3 XCR",
    repayment: "3.5 XCR",
    apr: "125.3%",
  },
  {
    asset: "Lil Pudgy",
    name: "Lil Pudgy #1",
    status: "Waiting",
    lender: "0x77B6ddbA6AfB1A74979011a07d078Be28f8bF835",
    borrower: "0xAc84926f0b9df7ff3B4f4377C5536Fff89e9aF54",
    duration: "30 days",
    due: "28/7/2023",
    loanValue: "3 XCR",
    repayment: "3.5 XCR",
    apr: "125.3%",
  },
  {
    asset: "Lil Pudgy",
    name: "Lil Pudgy #1",
    status: "Waiting",
    lender: "0x77B6ddbA6AfB1A74979011a07d078Be28f8bF835",
    borrower: "0xAc84926f0b9df7ff3B4f4377C5536Fff89e9aF54",
    duration: "30 days",
    due: "28/7/2023",
    loanValue: "3 XCR",
    repayment: "3.5 XCR",
    apr: "125.3%",
  },
];

export const PREVIOUS_LOANS = [
  {
    asset: "Lil Pudgy",
    name: "Lil Pudgy #1",
    status: "Waiting",
    lender: "0x77B6ddbA6AfB1A74979011a07d078Be28f8bF835",
    borrower: "0xAc84926f0b9df7ff3B4f4377C5536Fff89e9aF54",
    duration: "30 days",
    due: "28/7/2023",
    loanValue: "3 XCR",
    repayment: "3.5 XCR",
    apr: "125.3%",
  },
  {
    asset: "Lil Pudgy",
    name: "Lil Pudgy #1",
    status: "Waiting",
    lender: "0x77B6ddbA6AfB1A74979011a07d078Be28f8bF835",
    borrower: "0xAc84926f0b9df7ff3B4f4377C5536Fff89e9aF54",
    duration: "30 days",
    due: "28/7/2023",
    loanValue: "3 XCR",
    repayment: "3.5 XCR",
    apr: "125.3%",
  },
  {
    asset: "Lil Pudgy",
    name: "Lil Pudgy #1",
    status: "Waiting",
    lender: "0x77B6ddbA6AfB1A74979011a07d078Be28f8bF835",
    borrower: "0xAc84926f0b9df7ff3B4f4377C5536Fff89e9aF54",
    duration: "30 days",
    due: "28/7/2023",
    loanValue: "3 XCR",
    repayment: "3.5 XCR",
    apr: "125.3%",
  },
  {
    asset: "Lil Pudgy",
    name: "Lil Pudgy #1",
    status: "Waiting",
    lender: "0x77B6ddbA6AfB1A74979011a07d078Be28f8bF835",
    borrower: "0xAc84926f0b9df7ff3B4f4377C5536Fff89e9aF54",
    duration: "30 days",
    due: "28/7/2023",
    loanValue: "3 XCR",
    repayment: "3.5 XCR",
    apr: "125.3%",
  },
];

export const getNFTs = async () => {
  const url = `https://polygon-mumbai.g.alchemy.com/nft/v2/RRampoJ43pj7o98Zto95wSMw3JYTI5rL/getNFTs`;

  const options = {
    method: "GET",
    url,
    params: {
      owner: "0x1F0aad64EC7c3B3F4F739Cf1fb3Aa589C975F201",
      contractAddresses: ["0x086BdECe06069016F506f90dB30261Af654B7d0a"],
      pageSize: 14
    },
    headers: {
      accept: "application/json",
      "X-API-Key":
        "weE1x8tU9IecncVSIK3t2SGLRu9edvIUuXjNAXze4WopAlXspAYAEuZju0xgJbnF",
    },
  };

  const { data } = await axios.request(options);
  return data.ownedNfts;
};
