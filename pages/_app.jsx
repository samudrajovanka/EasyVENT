import '../styles/globals.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'tailwindcss/tailwind.css';
import Head from 'next/head';
import Layout from '@components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Head>
        <title>EasyVENT</title>
      </Head>

      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
