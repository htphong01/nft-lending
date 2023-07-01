import Table from "@src/components/common/table";
import { CURRENT_LOANS } from "@src/constants/example-data";
import  styles from './styles.module.scss'

export default function Offers() {

  const handleAcceptOffer = (loan) => {
    console.log('loan', loan);
  }

  return (
    <div className={styles.container}>
      <Table title="Offers received" data={CURRENT_LOANS} action={{ text: 'Accept', handle: handleAcceptOffer }} />
    </div>
  );
}
