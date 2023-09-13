import { ccn } from '@/styles/styleUtils';
import styles from './Demos.module.scss';

export default function Demos() {

  return (
    <div className={ccn("columns", styles.columns)}>
      <div className="column col-6 col-md-12 col-sm-12">
        <h2>Your Data at your Fingertips</h2>
        <p>Access and modify your data in your dashboard</p>
      </div>
      <div className="column col-6 col-md-12 col-sm-12">
      </div>
    </div>
  )
}