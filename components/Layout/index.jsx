import Container from '@components/Container';
import Footer from '@components/Footer';
import Navbar from '@components/Navbar';
import PropTypes from 'prop-types';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />

      <main>
        <Container>
          {children}
        </Container>
      </main>

      <Footer />
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
