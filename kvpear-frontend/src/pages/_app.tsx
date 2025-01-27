import '@/styles/globals.css'
import "../styles/theme.scss";
import type { AppProps } from 'next/app'
import AuthProvider from '@/components/context/authContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../styles/layout.module.scss';

export default function App({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      setLoading(true)
    }

    const handleRouteChangeComplete = () => {
      setLoading(false)
    }

    router.events.on('routeChangeStart', handleRouteChange)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [router.events])



  if (loading) {
    return (
      <div className={styles.page_loader}>
        <div className="loading loading-lg"></div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
