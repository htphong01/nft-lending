import { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import { getOrders } from '@src/api/order.api';
import Table from '@src/components/common/table';
import Form from './form';
import { CURRENT_LOAN_REQUESTS } from '@src/constants/example-data';
import styles from './styles.module.scss';

export default function LoanRequests() {
  const [isLoading, setIsLoading] = useState(true);
  const [orderList, setOrderList] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const handleViewLoanRequest = (loan) => {
    loan.metadata = {
      image: 'https://chonksociety.s3.us-east-2.amazonaws.com/images/10.png',
      artist: 'catladyjane',
      name: 'Chonk #10',
      description:
        'Chonk Society is a collection of chubby cheeked cats wreaking havoc on the ETH blockchain. Join the Society in a mission to help pet rescues around the world. This Chonk has evolved into its final form.',
      edition: 10,
      collection: 'Chonk Society',
    };
    setSelectedLoan(loan);
  };

  useEffect(() => {
    getOrders({ lender: 'pool' })
      .then(({ data }) => {
        setOrderList(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className={styles.container}>
      {selectedLoan && <Form item={selectedLoan} onClose={setSelectedLoan} />}
      {isLoading ? (
        <div className="react-loading-item">
          <ReactLoading type="bars" color="#fff" height={100} width={120} />
        </div>
      ) : (
        <>
          <Table
            title="Current Loan Requests"
            data={orderList}
            action={{ text: 'View', handle: handleViewLoanRequest }}
          />
          <Table title="Previous Loan Requests" />
        </>
      )}
    </div>
  );
}
