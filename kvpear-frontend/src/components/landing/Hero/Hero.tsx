import { ccn } from "@/styles/styleUtils";
import Image from "next/image";
import styles from './Hero.module.scss';
import { LinkButton } from "@/components/common/LinkButton";


export default function Hero() {

  return (
    <div className={ccn("container", styles.hero)}>
      <div className="columns">
        <div className={ccn('column col-sm-12 col-md-12 col-6 flex-col', styles.hero_text)}>
          <div>
            <div className={ccn(styles.icon, 's-circle')}>
              <i className="gg-database gg-2x"></i>
            </div>
            <h1>Key-Value storage, made simple.</h1>
            <p>Introducing an intuitive storage API for rapid prototyping, with a flexible pay-per-request model.</p>
            <div className={styles.ctas}>
              <LinkButton href="/auth/signup" className="btn btn-primary btn-lg">
                Get Started
              </LinkButton>
              <LinkButton href="/docs" className="btn btn-link btn-lg">
                <i className="gg-terminal"></i>
                Read the docs
              </LinkButton>
            </div>
          </div>
        </div>
        <div className={ccn("column col-6 col-md-12 col-sm-12", styles.hero_column)}>
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