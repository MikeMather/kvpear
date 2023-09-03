import { ccn } from '@/styles/styleUtils';
import styles from './EndpointLabel.module.scss';

export default function EndpointLabel({ method, path }: { method: string, path: string }) {

  const colorMap: {[key: string]: string} = {
    GET: styles.get,
    POST: styles.post,
    DELETE: styles.delete,
  }

  return (
    <div className={styles.container}>
      <span className={ccn(styles.method, colorMap[method])}>{method}</span>
      <span className={styles.path}>{path}</span>
    </div>
  )
}