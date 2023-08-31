import { PropsWithChildren } from "react";
import styles from './appLayout.module.scss';
import TopBar from "@/components/TopBar/TopBar";
import { useRouter } from "next/router";

export default function AppLayout({ children }: PropsWithChildren<{}>) {

  const router = useRouter();
  const activeRoute = router.pathname.split('/')[1];

  const isActiveRoute = (route: string) => {
    return activeRoute === route ? 'active' : '';
  }

  return (
    <div className={styles.app_container}>
      <TopBar />
      <div className={`${styles.app_layout} container`}>
        <div className="columns">
          <div className={`${styles.sidebar} column col-3`}>
            <ul className="nav">
              <li className={`nav-item ${isActiveRoute('app')}`}>
                <a href="/app">Dashboard</a>
              </li>
              <li className={`nav-item ${isActiveRoute('app/buckets')}`}>
                <a href="/app/buckets">Buckets</a>
              </li>
              <li className="nav-item">
                <a href="#">Development</a>
                <ul className="nav">
                  <li className={`nav-item ${isActiveRoute('docs')}`}>
                    <a href="#">Documentation</a>
                  </li>
                  <li className={`nav-item ${isActiveRoute('sandbox')}`}>
                    <a href="#">Sandbox</a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a href="#">Usage</a>
              </li>
            </ul>
          </div>
          <div className={`${styles.main_content} column col-9`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}