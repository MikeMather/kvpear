import { PropsWithChildren, useEffect, useState } from "react";
import styles from './appLayout.module.scss';
import TopBar from "@/components/TopBar/TopBar";
import { useRouter } from "next/router";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

export default function AppLayout({ children }: PropsWithChildren<{}>) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const activeRoute = router.pathname.split('/')[1];

  const isActiveRoute = (route: string) => {
    return activeRoute === route ? 'active' : '';
  }

  useEffect(() => {
    setSidebarOpen(false);
  }, [router.pathname])

  return (
    <div className={styles.app_container}>
      <TopBar onMenuOpen={() => setSidebarOpen(true)} />
      <Toaster 
        position="top-center"
        toastOptions={{
          className: 'toast',
          style: {
            background: '#fff',
            color: '#303742',
            border: 'none',
            borderRadius: '4px'
          }
        }}
      />
      <div className={`${styles.app_layout} container`}>
        <div className="columns">
          <div className={`${styles.sidebar} column col-3 ${sidebarOpen && styles.open}`}>
            <button className="btn btn-link btn-lg" onClick={() => setSidebarOpen(false)}>
              <i className="icon icon-cross"></i>
            </button>
            <ul className="nav">
              <li>
                <Link href="/" className="navbar-brand">
                  <img src="/logos/cover.png" alt="logo" width="180" height="70" />
                </Link>
              </li>
              <li className={`nav-item ${isActiveRoute('buckets')}`}>
                <Link href="/buckets">Buckets</Link>
              </li>
              <li className={`nav-item ${isActiveRoute('api-keys')}`}>
                <Link href="/api-keys">API Keys</Link>
              </li>
              <li className={`nav-item ${isActiveRoute('docs')}`}>
               <Link href="/docs">Documentation</Link>
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