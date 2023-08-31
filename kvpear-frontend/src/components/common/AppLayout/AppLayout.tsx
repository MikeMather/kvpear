import { PropsWithChildren } from "react";
import styles from './appLayout.module.scss';
import TopBar from "@/components/TopBar/TopBar";
import { useRouter } from "next/router";
import Link from "next/link";

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
                <Link href="/app">Dashboard</Link>
              </li>
              <li className={`nav-item ${isActiveRoute('app/buckets')}`}>
                <Link href="/app/buckets">Buckets</Link>
              </li>
              <li className="nav-item">
                <Link href="#">Development</Link>
                <ul className="nav">
                  <li className={`nav-item ${isActiveRoute('docs')}`}>
                    <Link href="#">Documentation</Link>
                  </li>
                  <li className={`nav-item ${isActiveRoute('sandbox')}`}>
                    <Link href="#">Sandbox</Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link href="#">Usage</Link>
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