import NavLink from '@components/NavLink';
import {
  faHome, faPlusSquare, faSearch, faSignInAlt, faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/dist/client/router';
import Image from 'next/image';
import { useSession } from 'next-auth/client';
import { useContext } from 'react';
import UserContext from '@context/userContext';

export default function BottomNavigation() {
  const userCtx = useContext(UserContext);
  const [session, loading] = useSession();
  const router = useRouter();

  return (
    <nav className="flex justify-between gap-5 items-center px-10 py-4 fixed bottom-0 w-screen bg-white border-t-2 border-ev-gray shadow-xl sm:hidden">
      <NavLink href="/" active={router.pathname === '/'}>
        <FontAwesomeIcon icon={faHome} size="lg" />
      </NavLink>

      <NavLink href="/search" active={router.pathname === '/search'}>
        <FontAwesomeIcon icon={faSearch} size="lg" />
      </NavLink>

      {session && userCtx.user && (
        <>
          <NavLink href="/create" active={router.pathname === '/create'}>
            <FontAwesomeIcon icon={faPlusSquare} size="lg" />
          </NavLink>

          <NavLink href={`/${userCtx.user.username}`}>
            <div className="relative w-6 img-square-ratio rounded-full overflow-hidden">
              <Image
                src={userCtx.user.avatar}
                layout="fill"
                loading="lazy"
                objectFit="cover"
                alt="profile_avatar"
              />
            </div>
          </NavLink>
        </>
      )}

      {!loading && !session && (
        <>
          <NavLink href="/auth/login" active={router.pathname === '/auth/login'}>
            <FontAwesomeIcon icon={faSignInAlt} size="lg" />
          </NavLink>

          <NavLink href="/auth/register" active={router.pathname === '/auth/register'}>
            <FontAwesomeIcon icon={faUserPlus} size="lg" />
          </NavLink>
        </>
      )}
    </nav>
  );
}
