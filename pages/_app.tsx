import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

function AuthWrapper({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const isLoginPage = router.pathname === '/login';
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Inicjalizacja bazy danych poprzez API
        const response = await fetch('/api/init', {
          method: 'POST'
        });
        
        if (!response.ok) {
          console.error('Błąd inicjalizacji:', await response.text());
        }
      } catch (error) {
        console.error('Błąd podczas inicjalizacji:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      if (!isAuthenticated && !isLoginPage) {
        router.push('/login');
      } else if (isAuthenticated && isLoginPage) {
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoginPage, router, isInitialized]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-slate-600">Inicjalizacja aplikacji...</div>
      </div>
    );
  }

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
