import { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import { getOrders } from '@src/api/order.api';
import Table from '@src/components/common/table';
import Form from './form';
import styles from './styles.module.scss';

export default function LoanRequests() {
  const [isLoading, setIsLoading] = useState(true);
  const [orderList, setOrderList] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);

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
            action={{ text: 'View', handle: setSelectedLoan }}
          />
          <Table title="Previous Loan Requests" />
        </>
      )}
    </div>
  );
}
