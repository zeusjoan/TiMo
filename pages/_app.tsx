import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

function AuthWrapper({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const isLoginPage = router.pathname === '/login';

  useEffect(() => {
    if (!isAuthenticated && !isLoginPage) {
      router.push('/login');
    } else if (isAuthenticated && isLoginPage) {
      router.push('/');
    }
  }, [isAuthenticated, isLoginPage, router]);

  return <Component {...pageProps} />;
}

function MyApp(props: AppProps) {
  return (
    <AuthProvider>
      <AuthWrapper {...props} />
    </AuthProvider>
  );
}

export default MyApp;
