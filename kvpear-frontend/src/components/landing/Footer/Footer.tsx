import Link from 'next/link';
import styles from './Footer.module.scss';
import Image from 'next/image';

export default function Footer() {

  return (
    <div className={styles.footer}>
      <div className={styles.footer_content}>
        <div className="columns container">
          <div className="column col-3">
            <Image src="/logos/default-monochrome-white.svg" width={180} height={180} />
          </div>
          <div className="column col-6">
          </div>
          <div className="column col-3 flex-col">
            <ul style={{ listStyle: 'none' }}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/docs">Documentation</Link></li>
              <li><Link href="/auth/login">Login</Link></li>
              <li><Link href="/auth/login">Sign up</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.footer_bottom}>
        <div>
          <p>© 2023 KV Pear</p>
        </div>
        <div>
          <Link href="/policies/privacy-policy">Privacy Policy</Link>
          <Link href="/policies/terms-of-service">Terms of Service</Link>
        </div>
      </div>
    </div>
  )
}