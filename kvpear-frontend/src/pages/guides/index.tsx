import Card from "@/components/common/Card/Card";
import Layout from "../layout";
import styles from './Guides.module.scss';
import { LinkButton } from "@/components/common/LinkButton";

export default function Guides() {
  return (
    <Layout>
      <h1>Guides</h1>
      <div className={styles.cards}>
        <Card
          title="Capturing Form Submissions"
          subtitle="HTML, JavaScript"
          body="Learn how to capture HTML form submissions and store them in a bucket using only a few lines of JavaScript."
          footer={<LinkButton className="btn btn-primary float-right">
            View Guide
            <i className="icon icon-arrow-right" />
          </LinkButton>}
        />
        <Card
          title="Using Feature Flags with KV Pear"
          subtitle="React, TypeScript"
          body="Learn how to use KV Pear to manage feature flags in your React application."
          footer={<LinkButton className="btn btn-primary float-right">
            View Guide
            <i className="icon icon-arrow-right" />
          </LinkButton>}
        />
        <Card
          title="Single Table Design with KV Pear"
          subtitle="TypeScript"
          body="Use KV Pear to implement a single table design for your application data"
          footer={<LinkButton className="btn btn-primary float-right">
            View Guide
            <i className="icon icon-arrow-right" />
          </LinkButton>}
        />
      </div>
    </Layout>
  )
}