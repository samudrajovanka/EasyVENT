import '../styles/globals.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'tailwindcss/tailwind.css';
import Head from 'next/head';
import Layout from '@components/Layout';
import { Provider as AuthProvider } from 'next-auth/client';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider session={pageProps.session}>
      <Layout>
        <Head>
          <title>EasyVENT</title>
        </Head>

        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;
