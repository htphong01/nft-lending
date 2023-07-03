import { useState, useEffect } from 'react';
import Header from './layout';
import MakeOffer from './make-offer';

export default function Assets() {
  const [nftData, setNftData] = useState();

  const fetchNFT = async () => {
    try {
      const nft = {
        asset: 'Lil Pudgy',
        name: 'Lil Pudgy #1',
        status: 'Waiting',
        lender: '0x77B6ddbA6AfB1A74979011a07d078Be28f8bF835',
        borrower: '0xAc84926f0b9df7ff3B4f4377C5536Fff89e9aF54',
        duration: '30 days',
        due: '28/7/2023',
        loanValue: '3 XCR',
        repayment: '3.5 XCR',
        apr: '125.3%',
        metadata: {
          image: 'https://chonksociety.s3.us-east-2.amazonaws.com/images/10.png',
          artist: 'catladyjane',
          name: 'Chonk #10',
          description:
            'Chonk Society is a collection of chubby cheeked cats wreaking havoc on the ETH blockchain. Join the Society in a mission to help pet rescues around the world. This Chonk has evolved into its final form.',
          edition: 10,
          collection: 'Chonk Society',
        },
      };
      setNftData(nft);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchNFT();
  }, []);

  if (!nftData) return <></>;

  return (
    <>
      <Header item={nftData} />
      <MakeOffer item={nftData} />
    </>
  );
}
