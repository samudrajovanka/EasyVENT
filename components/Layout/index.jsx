import BottomNavigation from '@components/BottomNavigation';
import Container from '@components/Container';
import Footer from '@components/Footer';
import Navbar from '@components/Navbar';
import Notification from '@components/Notification';
import PropTypes from 'prop-types';

export default function Layout({ children }) {
  return (
    <>
      <Notification />
      <Navbar />

      <main>
        <Container>
          {children}
        </Container>
      </main>

      <Footer />
      <BottomNavigation />
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
