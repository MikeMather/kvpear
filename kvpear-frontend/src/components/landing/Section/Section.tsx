import { PropsWithChildren } from "react";
import styles from './Section.module.scss';
import { ccn } from "@/styles/styleUtils";

type Props = {
  striped?: boolean
}

export default function Section({ children, striped=false }: PropsWithChildren<Props>) {
  return (
    <section className={ccn(styles.section, { [styles.striped]: striped })}>
      {children}
    </section>
  )
}