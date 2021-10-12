import Button from '@components/Button';
import CardEvent from '@components/CardEvent';
import Pagination from '@components/Pagination';
import Title from '@components/Title';
import fetchData from '@lib/fetchData';
import Cookies from 'js-cookie';
import { useRouter } from 'next/dist/client/router';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ProfileUserPage() {
  const [pageActive, setPageActive] = useState(1);
  const router = useRouter();
  const { username } = router.query;
  const [user, setUser] = useState({});
  const [usernameCookie, setUsernameCookie] = useState(Cookies.get('username'));
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setUsernameCookie(Cookies.get('username'));
  }, [Cookies.get('login')]);

  useEffect(() => {
    if (!username) {
      return;
    }

    setUser(fetchData.getUserByUsername(username));
    console.log(user);
    setEvents(fetchData.getEventsByUsername(username, pageActive));
    setLoading(false);
  }, [username]);

  const handleLeftClick = () => {
    if (pageActive > 1) {
      setPageActive(pageActive - 1);
    }
  };

  const handleRightClick = () => {
    if (pageActive < events.maxPage) {
      setPageActive(pageActive + 1);
    }
  };

  const handlePageClick = (page) => {
    setPageActive(page);
  };

  const handleFollow = () => {
    setUser((userCurrent) => ({
      ...userCurrent,
      followers: [...userCurrent?.followers, usernameCookie],
    }));

    const loginUser = fetchData.getUserByUsername(usernameCookie);
    loginUser.following.push(user?.username);
  };

  const handleUnfollow = () => {
    setUser((userCurrent) => ({
      ...userCurrent,
      followers: userCurrent?.followers.filter((follower) => follower !== usernameCookie),
    }));

    const loginUser = fetchData.getUserByUsername(usernameCookie);
    loginUser.followers = loginUser.following.filter((following) => following !== user?.username);
  };

  return (
    <>
      <header className="flex gap-24 items-center">
        <div className={`relative w-40 h-40 rounded-full overflow-hidden ${loading ? 'bg-ev-dark-gray' : ''}`}>
          {!loading && (
            <Image
              src={user?.avatar}
              layout="fill"
              loading="lazy"
              alt="profile_avatar"
            />
          )}
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex gap-10">
              <Title>{user?.name ?? ''}</Title>
              {usernameCookie && (
                <>
                  {username === usernameCookie && (
                    <Button typeButton="secondary" href="/profile/edit">Edit Profile</Button>
                  )}
                  {username !== usernameCookie
                    && user?.followers?.some((followers) => followers === usernameCookie)
                    && (
                      <Button typeButton="secondary" onClick={handleUnfollow}>Unfollow</Button>
                    )}
                  {username !== usernameCookie
                  && !user?.followers?.some((followers) => followers === usernameCookie)
                  && (
                    <Button onClick={handleFollow}>Follow</Button>
                  )}
                </>
              )}
              {!usernameCookie && (
                <Button href="/login">Follow</Button>
              )}
            </div>
            <p className="text-xl text-ev-dark-gray">{username ?? ''}</p>
          </div>

          <div className="flex gap-10">
            <p>{events?.data?.events?.length} event</p>
            <p>{user?.followers?.length} followers</p>
            <p>{user?.following?.length} following</p>
          </div>
        </div>
      </header>

      <div className="w-full h-0.5 bg-ev-gray my-10" />

      <div>
        {events.maxPage > 1 && (
          <div className="flex justify-center mb-10">
            <Pagination
              pageActive={pageActive}
              endPage={events.maxPage}
              leftClick={handleLeftClick}
              rightClick={handleRightClick}
              pageClick={handlePageClick}
            />
          </div>
        )}
        <div className="grid grid-cols-3 gap-4">
          {events?.data?.events.map((event) => (
            <CardEvent key={event.id} event={event} noHeader />
          ))}
        </div>
        {events.maxPage > 1 && (
          <div className="flex justify-center mt-10">
            <Pagination
              pageActive={pageActive}
              endPage={events.maxPage}
              leftClick={handleLeftClick}
              rightClick={handleRightClick}
              pageClick={handlePageClick}
            />
          </div>
        )}
      </div>
    </>
  );
}
