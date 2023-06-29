import Table from "./table";
import { CURRENT_LOANS, PREVIOUS_LOANS } from "@src/constants/example-data";
import  styles from './styles.module.scss'

export default function History() {
  return (
    <div className={styles.container}>
      <Table title="Current Loans" data={CURRENT_LOANS} />
      <Table title="Previous Loans"  />
    </div>
  );
}
