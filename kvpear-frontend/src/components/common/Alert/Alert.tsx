import { PropsWithChildren } from "react";
import styles from './alert.module.scss';

type AlertType = 'success' | 'error' | 'warning' | 'info';

const styleMap: {[key: string]: any} = {
  success: styles.alert_success,
  error: styles.alert_danger,
  warning: styles.alert_warning,
  info: styles.alert_info,
}

const Alert = ({ type, children }: PropsWithChildren<{ type: AlertType }>) => (
  <div className={`${styles.alert} ${styleMap[type]}`}>
    {children}
  </div>
)

export default Alert;