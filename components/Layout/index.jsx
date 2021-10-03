import Container from '@components/Container';
import Footer from '@components/Footer';
import Navbar from '@components/Navbar';

export default function Layout({ children }) {
  return (
    <>
      <header>
        <Navbar />
      </header>

      <main className="text-ev-black">
        <Container>
          {children}
        </Container>
      </main>

      <Footer />
    </>
  );
}
