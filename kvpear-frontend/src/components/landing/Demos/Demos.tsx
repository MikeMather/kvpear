import { ccn } from '@/styles/styleUtils';
import styles from './Demos.module.scss';
import Image from 'next/image';

export default function Demos() {

  return (
    <div>
      <div className={ccn("columns", styles.columns)}>
        <div className="column col-5 col-md-12 col-sm-12">
          <h2>Your Data at your Fingertips</h2>
          <p>Use your dashboard to view your data, and manage your buckets. We provide a simple interface to view, add and edit data.</p>
        </div>
        <div className="column col-1 col-md-12 col-sm-12"></div>
        <div className="column col-6 col-md-12 col-sm-12">
          <div className={styles.shot}>
            <img
              loading="lazy"
              src="/screenshots/screenshot-2.jpeg" 
              alt="Screenshot of KV Pear dashboard" 
              width={600} 
            />
          </div>
        </div>
      </div>
      <div className={ccn("columns", styles.columns)}>
        <div className="column col-6 col-md-12 col-sm-12">
          <div className={styles.shot}>
            <img
              loading="lazy"
              src="/screenshots/screenshot-1.jpeg" 
              alt="Screenshot of KV Pear dashboard" 
              width={600} 
            />
          </div>
        </div>
        <div className="column col-1 col-md-12 col-sm-12"></div>
        <div className="column col-5 col-md-12 col-sm-12">
          <h2>Secure API Key Auth</h2>
          <p>Use permission-scoped API keys to access your data. Secure your buckets with fine-grained access control.</p>
        </div>
      </div>
    </div>
  )
}