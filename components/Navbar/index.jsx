import Button from '@components/Button';
import EasyventIcon from '@components/Icons/EasyventIcon';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Image from 'next/image';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import Dropdown from '@components/Dropdown';
import DropdownItem from '@components/DropdownItem';
import { useState } from 'react';
import { useRouter } from 'next/dist/client/router';

export default function Navbar() {
  const login = Cookies.get('login');
  const avatar = Cookies.get('avatar');
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('login');
    Cookies.remove('avatar');
    setIsOpenDropdown(false);
    router.replace('/');
  };

  const toggleDropdown = () => {
    setIsOpenDropdown((current) => !current);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white w-full py-3 border-b-2 border-ev-gray px-48 flex justify-between items-center">
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

        {login && (
          <>
            <Link href="/create">
              <a><FontAwesomeIcon icon={faPlusSquare} /></a>
            </Link>
            <div className="relative">
              <button
                className="relative w-10 h-10 rounded-full overflow-hidden"
                onClick={toggleDropdown}
              >
                <Image
                  src={avatar}
                  layout="fill"
                  loading="lazy"
                />
              </button>

              {isOpenDropdown && (
                <Dropdown>
                  <DropdownItem href="/profile">Profile</DropdownItem>
                  <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                </Dropdown>
              )}
            </div>
          </>
        )}

        {!login && (
          <>
            <Button typeButton="secondary" href="/login">Login</Button>
            <Button href="/register">Register</Button>
          </>
        )}
      </div>
    </nav>
  );
}
