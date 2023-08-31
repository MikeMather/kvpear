import useAuth from '@/auth/useAuth';
import styles from './TopBar.module.scss';
import { ironSessionOptions } from '@/auth/session';
import { useRouter } from 'next/router';
import { Dropdown } from '../common/Dropdown/Dropdown';

export default function TopBar() {
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
          <div className={styles.logo_container}>
            <a href="/" className="navbar-brand mr-2">
              <img src="/logos/default.svg" alt="logo" width="230" height="180" />
            </a>
          </div>
        </section>
        {!isLoading && 
          <section className="navbar-section">
            {!user 
              ? <>
                  <a href="/auth/login" style={{ marginRight: '25px' }} className="navbar-brand">Login</a>
                  <a href="/auth/login" className="btn btn-primary">Sign up</a>
                </>
              : <Dropdown
                label="Account"
                icon="people"
                items={[
                  { label: 'Profile', action: () => router.push('/app') },
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