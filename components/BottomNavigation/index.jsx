import NavLink from '@components/NavLink';
import {
  faHome, faPlusSquare, faSearch, faSignInAlt, faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie';
import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function BottomNavigation() {
  const [login, setLogin] = useState(false);
  const [avatar, setAvatar] = useState('/images/avatar/default-avatar.jpg');
  const [username, setUsername] = useState(Cookies.get('username'));
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLogin(Boolean(Cookies.get('login')));
    setAvatar(Cookies.get('avatar'));
    setUsername(Cookies.get('username'));
    setLoading(false);
  }, [Cookies.get('login')]);

  return (
    <nav className="flex justify-between gap-5 items-center px-10 py-4 fixed bottom-0 w-screen bg-white border-t-2 border-ev-gray shadow-xl sm:hidden">
      <NavLink href="/" active={router.pathname === '/'}>
        <FontAwesomeIcon icon={faHome} size="lg" />
      </NavLink>

      <NavLink href="/search" active={router.pathname === '/search'}>
        <FontAwesomeIcon icon={faSearch} size="lg" />
      </NavLink>

      {!loading && login && (
        <>
          <NavLink href="/create" active={router.pathname === '/create'}>
            <FontAwesomeIcon icon={faPlusSquare} size="lg" />
          </NavLink>

          <NavLink href={`/${username}`}>
            <div className="relative w-6 img-square-ratio rounded-full overflow-hidden">
              <Image
                src={avatar}
                layout="fill"
                loading="lazy"
                alt="profile_avatar"
              />
            </div>
          </NavLink>
        </>
      )}

      {!login && (
        <>
          <NavLink href="/login" active={router.pathname === '/login'}>
            <FontAwesomeIcon icon={faSignInAlt} size="lg" />
          </NavLink>

          <NavLink href="/register" active={router.pathname === '/register'}>
            <FontAwesomeIcon icon={faUserPlus} size="lg" />
          </NavLink>
        </>
      )}
    </nav>
  );
}
