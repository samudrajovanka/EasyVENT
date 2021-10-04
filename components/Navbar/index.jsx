import Button from '@components/Button';
import EasyventIcon from '@components/Icons/EasyventIcon';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 bg-white w-full py-3 border-b-2 border-ev-gray px-48">
      <div className="flex justify-between items-center">
        <Link href="/">
          <a>
            <EasyventIcon />
          </a>
        </Link>

        <div className="flex gap-4 items-center">
          <Link href="/">
            <a><FontAwesomeIcon icon={faHome} /></a>
          </Link>
          <Link href="/search">
            <a><FontAwesomeIcon icon={faSearch} /></a>
          </Link>
          <Button typeButton="secondary" href="/login">Login</Button>
          <Button href="/register">Register</Button>
        </div>
      </div>
    </nav>
  );
}
