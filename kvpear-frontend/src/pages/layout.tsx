import TopBar from "@/components/TopBar/TopBar";
import { PropsWithChildren, useEffect, useState } from "react";
import styles from '../styles/layout.module.scss';
import Footer from "@/components/landing/Footer/Footer";
import { ccn } from "@/styles/styleUtils";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Layout({ children, padded=true }: PropsWithChildren<{ padded?: boolean }>) {

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setSidebarOpen(false);
  }, [router.pathname])

  return (
    <div className={styles.main_layout}>
      <TopBar onMenuOpen={() => setSidebarOpen(true)} />
      <div className={ccn(styles.mobile_nav, { [`${styles.open}`]: sidebarOpen })}>
        <button className="btn btn-link btn-lg">
          <i className="icon icon-cross"></i>
        </button>
        <ul className="nav">
          <li className="nav-item">
            <Link href="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link href="/docs">Documentation</Link>
          </li>
          <li className="nav-item">
            <Link href="/">Guides</Link>
          </li>
          <li className="nav-item">
            <Link href="/auth/login">Login</Link>
          </li>
          <li className="nav-item">
            <Link href="/auth/signup">Sign up</Link>
          </li>
          <li className="nav-item">
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </div>
      <main className={ccn(styles.main_layout_content, { [styles.padded]: padded })}>
        {children}
      </main>
      <Footer />
    </div>
  )
}