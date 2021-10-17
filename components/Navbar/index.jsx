import Button from '@components/Button';
import EasyventIcon from '@components/Icons/EasyventIcon';
import { faHome, faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import Image from 'next/image';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import Dropdown from '@components/Dropdown';
import DropdownItem from '@components/DropdownItem';
import { useEffect, useRef, useState } from 'react';
import NavLink from '@components/NavLink';
import { signOut, useSession } from 'next-auth/client';

export default function Navbar() {
  const [session, loading] = useSession();
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const dropdown = useRef(null);

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

  const handleLogout = async () => {
    await signOut({ redirect: false });
  };

  const handleLogoutDropdown = async () => {
    toggleDropdown();
    await handleLogout();
  };

  return (
    <nav className={`sticky top-0 z-50 bg-white w-full py-3 border-b-2 border-ev-gray px-4 md:px-12 lg:px-24 xl:px-48 2xl:px-56 flex ${session ? 'justify-between' : 'justify-start sm:justify-between'} items-center`}>
      <Link href="/">
        <a>
          <EasyventIcon />
        </a>
      </Link>

      <div className="hidden sm:flex gap-4 items-center">
        <NavLink href="/" active>
          <FontAwesomeIcon icon={faHome} />
        </NavLink>

        <NavLink href="/search" active>
          <FontAwesomeIcon icon={faSearch} />
        </NavLink>

        {session && (
          <>
            <NavLink href="/create" active>
              <FontAwesomeIcon icon={faPlusSquare} />
            </NavLink>

            <div className="relative">
              <button
                className="relative w-10 img-square-ratio rounded-full overflow-hidden"
                onClick={toggleDropdown}
              >
                <Image
                  src={session.user.image}
                  layout="fill"
                  loading="lazy"
                  alt="profile_avatar"
                />
              </button>

              {isOpenDropdown && (
                <div ref={dropdown}>
                  <Dropdown>
                    <DropdownItem href={`/${session.user.name}`} onClick={toggleDropdown}>Profile</DropdownItem>
                    <DropdownItem onClick={handleLogoutDropdown}>Logout</DropdownItem>
                  </Dropdown>
                </div>
              )}
            </div>
          </>
        )}

        {!loading && !session && (
          <>
            <Button typeButton="secondary" href="/auth/login">Login</Button>
            <Button href="/auth/register">Register</Button>
          </>
        )}
      </div>

      {session && (
        <div onClick={handleLogout} className="sm:hidden cursor-pointer">
          <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
        </div>
      )}
    </nav>
  );
}
