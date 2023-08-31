import TopBar from "@/components/TopBar/TopBar";
import { PropsWithChildren } from "react";
import styles from '../styles/layout.module.scss';

export default function Layout({ children }: PropsWithChildren<{}>) {

  return (
    <div className={styles.main_layout}>
      <TopBar />
        <main>
          {children}
        </main>
    </div>
  )
}