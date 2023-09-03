import TopBar from "@/components/TopBar/TopBar";
import { PropsWithChildren } from "react";
import styles from '../styles/layout.module.scss';
import Footer from "@/components/landing/Footer/Footer";

export default function Layout({ children }: PropsWithChildren<{}>) {

  return (
    <div className={styles.main_layout}>
      <TopBar />
      <main className={styles.main_layout_content}>
        {children}
      </main>
      <Footer />
    </div>
  )
}