import Table from '@src/components/common/offer-table';
import styles from './styles.module.scss';

export default function Loans() {
  const handleOpenCurrentLoan = (loan) => {
    console.log('loan', loan);
  };

  return (
    <div className={styles.container}>
      <Table
        title="Current Loans as Borrower"
        data={[]}
        action={{ text: 'Repay', handle: handleOpenCurrentLoan }}
      />
      <Table title="Previous Loans as Borrower" />
    </div>
  );
}
