import { LinkButton } from "@/components/common/LinkButton";
import styles from './Cta.module.scss';
import { ccn } from "@/styles/styleUtils";

export default function Cta() {
  return (
    <div className={ccn("container", styles.container)}>
      <h1>Get Started in 30 Seconds</h1>
      <p>Unlock the power of effortless rapid prototyping, efficient data storage, feature flagging, and more. The best part? No credit card is required to get started. Join our community of innovators and take the first step towards simplified data storage.</p>
      <LinkButton href="/auth/signup" className="btn btn-primary btn-lg">
        Try for Free
        <i className="icon icon-arrow-right ml-2"></i>
      </LinkButton>
    </div>
  )
}