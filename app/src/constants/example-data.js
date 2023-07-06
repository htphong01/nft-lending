import axios from 'axios';

export const CURRENT_LOANS = [
  {
    creator: '0xc8429c05315ae47ffc0789a201e5f53e93d591d4',
    nftAddress: '0xF31a2E258BeC65A46fb54cd808294Ce215070150',
    nftTokenId: 7,
    offer: '12000000000000000000',
    duration: '15',
    rate: 2028,
    doesBorrowUser: true,
    signature:
      '0xd7d5efa7ac63cfe4293b929d6240870cbb0cc67d5c86611dcbb2720b99fe7ffb5b7bd5027a9668eaabbaecad01e3fd4c35cb555bea2825adcabfcbd4b1066a671b',
    metadata: {
      name: 'Chonk #7',
      description:
        'Chonk Society is a collection of chubby cheeked cats wreaking havoc on the ETH blockchain. Join the Society in a mission to help pet rescues around the world.',
      image: 'https://chonksociety.s3.us-east-2.amazonaws.com/images/7.png',
      edition: 7,
      artist: 'catladyjane',
      collection: 'Chonk Society',
      attributes: [
        {
          trait_type: 'background',
          value: 'fall',
        },
        {
          trait_type: 'color',
          value: 'gray tabby',
        },
        {
          trait_type: 'white paws',
          value: 'all',
        },
        {
          trait_type: 'blush',
          value: 'shy (pink)',
        },
        {
          trait_type: 'eyes',
          value: 'annoyed',
        },
        {
          trait_type: 'eyebrows',
          value: 'calm',
        },
        {
          trait_type: 'body',
          value: 'collar with bell (mint)',
        },
        {
          trait_type: 'mouth',
          value: 'normal',
        },
        {
          trait_type: 'hat',
          value: 'egg',
        },
        {
          trait_type: 'wings',
          value: 'none',
        },
        {
          trait_type: 'eyewear',
          value: 'none',
        },
        {
          trait_type: 'face',
          value: 'none',
        },
        {
          trait_type: 'evolved',
          value: 'no',
        },
      ],
    },
    floorPrice: 13200000000000002000,
    hash: '8983efa58ff392b13afc82ce5a2a6bfbfa2622ef8cf096f11216eccef9bee441',
    status: 0,
    createdAt: 1688531171535,
  },
  {
    creator: '0xc8429c05315ae47ffc0789a201e5f53e93d591d4',
    nftAddress: '0xF31a2E258BeC65A46fb54cd808294Ce215070150',
    nftTokenId: 3,
    offer: '15000000000000000000',
    duration: '30',
    rate: 811,
    doesBorrowUser: true,
    signature:
      '0x75ef479471ba4e9206e1d64ffa6f956f6e67956ff886fce1ca17e7f3a3ffec2c52a876898321ce5057af4e924bf72cff61b5fc596c8774894e7e2347dbf47e8f1c',
    metadata: {
      name: 'Chonk #3',
      description:
        'Chonk Society is a collection of chubby cheeked cats wreaking havoc on the ETH blockchain. Join the Society in a mission to help pet rescues around the world. This Chonk has evolved into its final form.',
      image: 'https://chonksociety.s3.us-east-2.amazonaws.com/images/3.png',
      edition: 3,
      artist: 'catladyjane',
      collection: 'Chonk Society',
      attributes: [
        {
          trait_type: 'background',
          value: 'stars (holo)',
        },
        {
          trait_type: 'color',
          value: 'black and white',
        },
        {
          trait_type: 'white paws',
          value: 'none',
        },
        {
          trait_type: 'blush',
          value: 'normal (red)',
        },
        {
          trait_type: 'eyes',
          value: 'closed',
        },
        {
          trait_type: 'eyebrows',
          value: 'small',
        },
        {
          trait_type: 'body',
          value: 'none',
        },
        {
          trait_type: 'mouth',
          value: 'surprised',
        },
        {
          trait_type: 'hat',
          value: 'ninja',
        },
        {
          trait_type: 'wings',
          value: 'angel (white)',
        },
        {
          trait_type: 'eyewear',
          value: 'none',
        },
        {
          trait_type: 'face',
          value: 'none',
        },
        {
          trait_type: 'evolved',
          value: 'yes',
        },
      ],
    },
    floorPrice: 16500000000000002000,
    hash: '8edd1cacff5d777bfde913610c79e701defb59a894f8aa5e67bccc84982d85da',
    status: 0,
    createdAt: 1688531118034,
  },
  {
    creator: '0xc8429c05315ae47ffc0789a201e5f53e93d591d4',
    nftAddress: '0xF31a2E258BeC65A46fb54cd808294Ce215070150',
    nftTokenId: 1,
    offer: '10000000000000000000',
    duration: '60',
    rate: 3042,
    doesBorrowUser: true,
    signature:
      '0x37be57873e744b22c4fc63c5cf9935e22f69ab05b8827d76ec3e032cf6e555f04d5a1763b0983eba5ae9ba2c7bdaf0d5367a97f4af43cfa6b1bf041fc8d783c41b',
    metadata: {
      name: 'Chonk #1',
      description:
        'Chonk Society is a collection of chubby cheeked cats wreaking havoc on the ETH blockchain. Join the Society in a mission to help pet rescues around the world. This Chonk has evolved into its final form.',
      image: 'https://chonksociety.s3.us-east-2.amazonaws.com/images/1.png',
      edition: 1,
      artist: 'catladyjane',
      collection: 'Chonk Society',
      attributes: [
        {
          trait_type: 'background',
          value: 'sherbet',
        },
        {
          trait_type: 'color',
          value: 'gray',
        },
        {
          trait_type: 'white paws',
          value: 'none',
        },
        {
          trait_type: 'blush',
          value: 'normal (red)',
        },
        {
          trait_type: 'eyes',
          value: 'wink (left)',
        },
        {
          trait_type: 'eyebrows',
          value: 'small',
        },
        {
          trait_type: 'body',
          value: 'scarf (white)',
        },
        {
          trait_type: 'mouth',
          value: 'normal',
        },
        {
          trait_type: 'hat',
          value: 'hair (white)',
        },
        {
          trait_type: 'wings',
          value: 'none',
        },
        {
          trait_type: 'eyewear',
          value: 'round glasses',
        },
        {
          trait_type: 'face',
          value: 'earring',
        },
        {
          trait_type: 'evolved',
          value: 'yes',
        },
      ],
    },
    floorPrice: 11000000000000000000,
    hash: 'd9f30a1ccae0648ea4730878f3075c468f38250a4d7d3c7f653b224aea0c1151',
    status: 0,
    createdAt: 1688531080895,
  },
];

export const PREVIOUS_LOANS = [
  {
    creator: '0xc8429c05315ae47ffc0789a201e5f53e93d591d4',
    nftAddress: '0xF31a2E258BeC65A46fb54cd808294Ce215070150',
    nftTokenId: 7,
    offer: '12000000000000000000',
    duration: '15',
    rate: 2028,
    doesBorrowUser: true,
    signature:
      '0xd7d5efa7ac63cfe4293b929d6240870cbb0cc67d5c86611dcbb2720b99fe7ffb5b7bd5027a9668eaabbaecad01e3fd4c35cb555bea2825adcabfcbd4b1066a671b',
    metadata: {
      name: 'Chonk #7',
      description:
        'Chonk Society is a collection of chubby cheeked cats wreaking havoc on the ETH blockchain. Join the Society in a mission to help pet rescues around the world.',
      image: 'https://chonksociety.s3.us-east-2.amazonaws.com/images/7.png',
      edition: 7,
      artist: 'catladyjane',
      collection: 'Chonk Society',
      attributes: [
        {
          trait_type: 'background',
          value: 'fall',
        },
        {
          trait_type: 'color',
          value: 'gray tabby',
        },
        {
          trait_type: 'white paws',
          value: 'all',
        },
        {
          trait_type: 'blush',
          value: 'shy (pink)',
        },
        {
          trait_type: 'eyes',
          value: 'annoyed',
        },
        {
          trait_type: 'eyebrows',
          value: 'calm',
        },
        {
          trait_type: 'body',
          value: 'collar with bell (mint)',
        },
        {
          trait_type: 'mouth',
          value: 'normal',
        },
        {
          trait_type: 'hat',
          value: 'egg',
        },
        {
          trait_type: 'wings',
          value: 'none',
        },
        {
          trait_type: 'eyewear',
          value: 'none',
        },
        {
          trait_type: 'face',
          value: 'none',
        },
        {
          trait_type: 'evolved',
          value: 'no',
        },
      ],
    },
    floorPrice: 13200000000000002000,
    hash: '8983efa58ff392b13afc82ce5a2a6bfbfa2622ef8cf096f11216eccef9bee441',
    status: 0,
    createdAt: 1688531171535,
  },
  {
    creator: '0xc8429c05315ae47ffc0789a201e5f53e93d591d4',
    nftAddress: '0xF31a2E258BeC65A46fb54cd808294Ce215070150',
    nftTokenId: 3,
    offer: '15000000000000000000',
    duration: '30',
    rate: 811,
    doesBorrowUser: true,
    signature:
      '0x75ef479471ba4e9206e1d64ffa6f956f6e67956ff886fce1ca17e7f3a3ffec2c52a876898321ce5057af4e924bf72cff61b5fc596c8774894e7e2347dbf47e8f1c',
    metadata: {
      name: 'Chonk #3',
      description:
        'Chonk Society is a collection of chubby cheeked cats wreaking havoc on the ETH blockchain. Join the Society in a mission to help pet rescues around the world. This Chonk has evolved into its final form.',
      image: 'https://chonksociety.s3.us-east-2.amazonaws.com/images/3.png',
      edition: 3,
      artist: 'catladyjane',
      collection: 'Chonk Society',
      attributes: [
        {
          trait_type: 'background',
          value: 'stars (holo)',
        },
        {
          trait_type: 'color',
          value: 'black and white',
        },
        {
          trait_type: 'white paws',
          value: 'none',
        },
        {
          trait_type: 'blush',
          value: 'normal (red)',
        },
        {
          trait_type: 'eyes',
          value: 'closed',
        },
        {
          trait_type: 'eyebrows',
          value: 'small',
        },
        {
          trait_type: 'body',
          value: 'none',
        },
        {
          trait_type: 'mouth',
          value: 'surprised',
        },
        {
          trait_type: 'hat',
          value: 'ninja',
        },
        {
          trait_type: 'wings',
          value: 'angel (white)',
        },
        {
          trait_type: 'eyewear',
          value: 'none',
        },
        {
          trait_type: 'face',
          value: 'none',
        },
        {
          trait_type: 'evolved',
          value: 'yes',
        },
      ],
    },
    floorPrice: 16500000000000002000,
    hash: '8edd1cacff5d777bfde913610c79e701defb59a894f8aa5e67bccc84982d85da',
    status: 0,
    createdAt: 1688531118034,
  },
  {
    creator: '0xc8429c05315ae47ffc0789a201e5f53e93d591d4',
    nftAddress: '0xF31a2E258BeC65A46fb54cd808294Ce215070150',
    nftTokenId: 1,
    offer: '10000000000000000000',
    duration: '60',
    rate: 3042,
    doesBorrowUser: true,
    signature:
      '0x37be57873e744b22c4fc63c5cf9935e22f69ab05b8827d76ec3e032cf6e555f04d5a1763b0983eba5ae9ba2c7bdaf0d5367a97f4af43cfa6b1bf041fc8d783c41b',
    metadata: {
      name: 'Chonk #1',
      description:
        'Chonk Society is a collection of chubby cheeked cats wreaking havoc on the ETH blockchain. Join the Society in a mission to help pet rescues around the world. This Chonk has evolved into its final form.',
      image: 'https://chonksociety.s3.us-east-2.amazonaws.com/images/1.png',
      edition: 1,
      artist: 'catladyjane',
      collection: 'Chonk Society',
      attributes: [
        {
          trait_type: 'background',
          value: 'sherbet',
        },
        {
          trait_type: 'color',
          value: 'gray',
        },
        {
          trait_type: 'white paws',
          value: 'none',
        },
        {
          trait_type: 'blush',
          value: 'normal (red)',
        },
        {
          trait_type: 'eyes',
          value: 'wink (left)',
        },
        {
          trait_type: 'eyebrows',
          value: 'small',
        },
        {
          trait_type: 'body',
          value: 'scarf (white)',
        },
        {
          trait_type: 'mouth',
          value: 'normal',
        },
        {
          trait_type: 'hat',
          value: 'hair (white)',
        },
        {
          trait_type: 'wings',
          value: 'none',
        },
        {
          trait_type: 'eyewear',
          value: 'round glasses',
        },
        {
          trait_type: 'face',
          value: 'earring',
        },
        {
          trait_type: 'evolved',
          value: 'yes',
        },
      ],
    },
    floorPrice: 11000000000000000000,
    hash: 'd9f30a1ccae0648ea4730878f3075c468f38250a4d7d3c7f653b224aea0c1151',
    status: 0,
    createdAt: 1688531080895,
  },
];

export const CURRENT_LOAN_REQUESTS = [
  {
    asset: 'Lil Pudgy',
    name: 'Lil Pudgy #1',
    status: 'Waiting',
    lender: 'Lending Pool',
    borrower: '0xAc84926f0b9df7ff3B4f4377C5536Fff89e9aF54',
    duration: '30 days',
    due: '28/7/2023',
    loanValue: '3 XCR',
    repayment: '3.5 XCR',
    apr: '125.3%',
  },
  {
    asset: 'Lil Pudgy',
    name: 'Lil Pudgy #1',
    status: 'Waiting',
    lender: 'Lending Pool',
    borrower: '0xAc84926f0b9df7ff3B4f4377C5536Fff89e9aF54',
    duration: '30 days',
    due: '28/7/2023',
    loanValue: '3 XCR',
    repayment: '3.5 XCR',
    apr: '125.3%',
  },
  {
    asset: 'Lil Pudgy',
    name: 'Lil Pudgy #1',
    status: 'Waiting',
    lender: 'Lending Pool',
    borrower: '0xAc84926f0b9df7ff3B4f4377C5536Fff89e9aF54',
    duration: '30 days',
    due: '28/7/2023',
    loanValue: '3 XCR',
    repayment: '3.5 XCR',
    apr: '125.3%',
  },
  {
    asset: 'Lil Pudgy',
    name: 'Lil Pudgy #1',
    status: 'Waiting',
    lender: 'Lending Pool',
    borrower: '0xAc84926f0b9df7ff3B4f4377C5536Fff89e9aF54',
    duration: '30 days',
    due: '28/7/2023',
    loanValue: '3 XCR',
    repayment: '3.5 XCR',
    apr: '125.3%',
  },
];

export const OFFERS_RECEIVED = [
  {
    loanValue: '3',
    interest: '0.96%',
    apr: '12.53%',
    duration: '30 days',
    lender: '0xAc84926f0b9df7ff3B4f4377C5536Fff89e9aF54',
    repayment: '3.5',
  },
  {
    loanValue: '3',
    interest: '0.96%',
    apr: '12.53%',
    duration: '30 days',
    lender: '0xAc84926f0b9df7ff3B4f4377C5536Fff89e9aF54',
    repayment: '3.5',
  },
  {
    loanValue: '3',
    interest: '0.96%',
    apr: '12.53%',
    duration: '30 days',
    lender: '0xAc84926f0b9df7ff3B4f4377C5536Fff89e9aF54',
    repayment: '3.5',
  },
  {
    loanValue: '3',
    interest: '0.96%',
    apr: '12.53%',
    duration: '30 days',
    lender: '0xAc84926f0b9df7ff3B4f4377C5536Fff89e9aF54',
    repayment: '3.5',
  },
  {
    loanValue: '3',
    interest: '0.96%',
    apr: '12.53%',
    duration: '30 days',
    lender: '0xAc84926f0b9df7ff3B4f4377C5536Fff89e9aF54',
    repayment: '3.5',
  },
  {
    loanValue: '3',
    interest: '0.96%',
    apr: '12.53%',
    duration: '30 days',
    lender: '0xAc84926f0b9df7ff3B4f4377C5536Fff89e9aF54',
    repayment: '3.5',
  },
];
