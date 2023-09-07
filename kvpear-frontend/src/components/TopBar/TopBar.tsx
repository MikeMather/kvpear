import useAuth from '@/auth/useAuth';
import styles from './TopBar.module.scss';
import { ironSessionOptions } from '@/auth/session';
import { useRouter } from 'next/router';
import { Dropdown } from '../common/Dropdown/Dropdown';
import Link from 'next/link';
import { LinkButton } from '../common/LinkButton';

export default function TopBar({ onMenuOpen }: { onMenuOpen: () => void }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const logout = () => {
    const cookieName = ironSessionOptions.cookieName;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    router.push('/');
  }

  return (
    <div className={styles.topbar}>
      <header className="navbar">
        <section className="navbar-section">
          <button className={`btn btn-link ${styles.menu_button}`} onClick={onMenuOpen}>
            <i className="icon icon-menu"></i>
          </button>
          <div className={styles.logo_container}>
            <Link href="/" className="navbar-brand mr-2">
              <img src="/logos/cover.png" alt="logo" width="180" height="70" />
            </Link>
          </div>
          {!isLoading && !user?.email && <div className={styles.nav_items}>
            <LinkButton href="/docs" className="btn btn-link btn-lg">Documentation</LinkButton>
            <LinkButton href="/guides" className="btn btn-link btn-lg">Guides</LinkButton>
            <LinkButton href="/guides" className="btn btn-link btn-lg">Pricing</LinkButton>
            <LinkButton href="/contact" className="btn btn-link btn-lg">Contact</LinkButton>
          </div>}
        </section>
        {!isLoading && 
          <section className="navbar-section">
            {!user 
              ? <>
                  <LinkButton href="/auth/login" style={{ marginRight: '20px' }} className="btn-link btn-lg">Login</LinkButton>
                  <LinkButton className="btn-primary btn-lg" href="/auth/signup">Sign up</LinkButton>
                </>
              : <Dropdown
                label="Account"
                icon="people"
                items={[
                  { label: 'Profile', action: () => router.push('/buckets') },
                  { label: 'Logout', action: logout },
                ]}
              />
            }
          </section>
        }
      </header>
    </div>
  )
}