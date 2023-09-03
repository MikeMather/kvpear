import { ccn } from "@/styles/styleUtils";
import Image from "next/image";
import styles from './Hero.module.scss';
import { LinkButton } from "@/components/common/LinkButton";


export default function Hero() {

  return (
    <div className={ccn("container", styles.hero)}>
      <div className="columns">
        <div className={ccn('column col-sm-12 col-md-12 col-5 flex-col', styles.hero_text)}>
          <div>
            <h1>Key-Value storage, made simple.</h1>
            <p>Unlock the power of Key-Value Storage. Manage your data effortlessly with a user-friendly interface and a flexible pay-per-request model.</p>
            <div className={styles.ctas}>
              <LinkButton className="btn btn-primary btn-lg">Get Started</LinkButton>
              <LinkButton className="btn btn-link">
                <i className="gg-terminal"></i>
                Read the docs
              </LinkButton>
            </div>
          </div>
        </div>
        <div className={ccn("column col-7 col-md-12 col-sm-12", styles.hero_column)}>
          <picture className={styles.hero_pic}>
            <source srcSet="/code-shots/example-1-sm.svg" media="(min-width: 601px)" />
            <source srcSet="/code-shots/example-1-xs.svg" media="(max-width: 600px)" />
            <img src="/code-shots/example-1.svg" alt="Example of KV Pear in use" />
          </picture>
        </div>
      </div>
    </div>
  )
}