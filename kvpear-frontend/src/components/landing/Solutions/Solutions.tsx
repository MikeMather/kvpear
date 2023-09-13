import { LinkButton } from '@/components/common/LinkButton';
import styles from './Solutions.module.scss';
import { ccn } from '@/styles/styleUtils';
import Image from 'next/image';

export default function Solutions() {

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h1>Features and Solutions</h1>
      </div>
      <div className={ccn("columns", styles.columns)}>
        <div className="column col-3 col-md-6 col-sm-12">
          <i className={ccn("gg-code-slash gg-2x", styles.icon)}></i>
          <h2>Rapid Prototyping</h2>
          <p>Quickly build and deploy prototypes with a simple API.</p>
          <LinkButton href="/docs" className="btn btn-primary">
            Get Started <i className="icon icon-arrow-right"></i>
          </LinkButton>
        </div>
        <div className="column col-3 col-md-6 col-sm-12">
          <i className={ccn("gg-flag gg-2x", styles.icon)}></i>
          <h2>Feature Flagging</h2>
          <p>Launch features with confidence by testing in production.</p>
          <LinkButton href="/docs" className="btn btn-primary">
            View Guide<i className="icon icon-arrow-right"></i>
          </LinkButton>
        </div>
        <div className="column col-3 col-md-6 col-sm-12">
          <i className={ccn("gg-remote gg-2x", styles.icon)}></i>
          <h2>Remote Configuration</h2>
          <p>Update configuration values without having to redeploy.</p>
          <LinkButton href="/docs" className="btn btn-primary">
            View Guide<i className="icon icon-arrow-right"></i>
          </LinkButton>
        </div>
        <div className="column col-3 col-md-6 col-sm-12">
          <i className={ccn("gg-database gg-2x", styles.icon)}></i>
          <h2>Form Submissions</h2>
          <p>Collect form submissions, no backend required.</p>
          <LinkButton href="/docs" className="btn btn-primary">
            View Guide<i className="icon icon-arrow-right"></i>
          </LinkButton>
        </div>
      </div>
    </div>
  )
}