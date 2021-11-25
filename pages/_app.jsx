import '../styles/globals.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'tailwindcss/tailwind.css';
import Head from 'next/head';
import Layout from '@components/Layout';
import { Provider as AuthProvider } from 'next-auth/client';
import { UserContextProvider } from '@context/userContext';
import { NotificationContextProvider } from '@context/notificationContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider session={pageProps.session}>
      <UserContextProvider>
        <NotificationContextProvider>
          <Layout>
            <Head>
              <title>EasyVENT</title>
            </Head>

            <Component {...pageProps} />
          </Layout>
        </NotificationContextProvider>
      </UserContextProvider>
    </AuthProvider>
  );
}

export default MyApp;
