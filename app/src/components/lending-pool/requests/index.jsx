import { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getStakedByUser } from '@src/utils/contracts/lending-pool';
import { getOrders } from '@src/api/order.api';
import { OrderStatus } from '@src/constants/enum';
import Table from '@src/components/common/table';
import Form from './form';
import styles from './styles.module.scss';

export default function LoanRequests() {
  const navigate = useNavigate();

  const account = useSelector((state) => state.account);

  const [isLoading, setIsLoading] = useState(true);
  const [orderList, setOrderList] = useState({
    current: [],
    previous: [],
  });
  const [selectedLoan, setSelectedLoan] = useState(null);

  const fetchOrders = async () => {
    try {
      const [orderList1, orderList2] = await Promise.all([
        getOrders({ lender: 'pool', status: OrderStatus.OPENING }),
        getOrders({
          lender: 'pool',
          status: `${OrderStatus.CANCELLED},${OrderStatus.REPAID},${OrderStatus.LIQUIDATED}`,
        }),
      ]);

      setOrderList({
        current: orderList1.data,
        previous: orderList2.data,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (account.address) {
      getStakedByUser(account.address).then((balance) => {
        if (balance == 0) navigate('/lending-pool');
      });
    }
  }, [account.address]);

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
            data={orderList.current}
            action={{ text: 'View', handle: setSelectedLoan }}
          />
          <Table title="Previous Loan Requests" data={[]} />
        </>
      )}
    </div>
  );
}
