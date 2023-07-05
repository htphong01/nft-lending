import Table from '@src/components/common/table';
import { CURRENT_LOANS, PREVIOUS_LOANS } from '@src/constants/example-data';
import styles from './styles.module.scss';

export default function History() {
  const handleOpenCurrentLoan = (loan) => {
    console.log('loan', loan);
  };

  return (
    <div className={styles.container}>
      <Table title="Current Loans" data={[]} action={{ text: 'Repay', handle: handleOpenCurrentLoan }} />
      <Table title="Previous Loans" data={[]} />
    </div>
  );
}
