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
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/dist/client/router';

export default function Navbar() {
  const [login, setLogin] = useState(false);
  const [avatar, setAvatar] = useState('/images/avatar/default-avatar.jpg');
  const [username, setUsername] = useState(Cookies.get('username'));
  const [loading, setLoading] = useState(true);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const router = useRouter();
  const dropdown = useRef(null);

  useEffect(() => {
    setLogin(Boolean(Cookies.get('login')));
    setAvatar(Cookies.get('avatar'));
    setUsername(Cookies.get('username'));
    setLoading(false);
  }, [Cookies.get('login')]);

  useEffect(() => {
    if (!isOpenDropdown) return;

    function handleClick(event) {
      if (dropdown.current && !dropdown.current.contains(event.target)) {
        setIsOpenDropdown(false);
      }
    }

    window.addEventListener('click', handleClick);

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [isOpenDropdown]);

  const toggleDropdown = () => {
    setIsOpenDropdown((current) => !current);
  };

  const handleLogout = () => {
    Cookies.remove('login');
    Cookies.remove('avatar');
    Cookies.remove('username');
    toggleDropdown();
    router.replace('/');
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

        {login && !loading && (
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
                  alt="profile_avatar"
                />
              </button>

              {isOpenDropdown && (
                <div ref={dropdown}>
                  <Dropdown>
                    <DropdownItem href={`/${username}`} onClick={toggleDropdown}>Profile</DropdownItem>
                    <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                  </Dropdown>
                </div>
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
