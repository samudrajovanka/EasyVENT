import Button from '@components/Button';
import EventList from '@components/EventList';
import Pagination from '@components/Pagination';
import Title from '@components/Title';
<<<<<<< HEAD
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
    setEvents(fetchData.getEventsByUsername(username, pageActive));
    setLoading(false);
  }, [username]);
=======
import { useRouter } from 'next/dist/client/router';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { fetchApi } from '@lib/fetchingData';
import { getSession } from 'next-auth/client';
import UserContext from '@context/userContext';
import NotificationContext from '@context/notificationContext';
import sliceEvents from '@lib/sliceEvent';

export default function ProfileUserPage({ sessionProps, userProps, eventsProps }) {
  const userCtx = useContext(UserContext);
  const notificationCtx = useContext(NotificationContext);
  const [pageActive, setPageActive] = useState(1);
  const router = useRouter();
  const { username } = router.query;
  const [user, setUser] = useState(userProps);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [isFollow, setIsFollow] = useState(user.followers.list
    .some((follower) => follower === sessionProps?.user.name));
  const [events, setEvents] = useState(sliceEvents(pageActive, eventsProps));

  useEffect(() => {
    setEvents(sliceEvents(pageActive, eventsProps));
  }, [pageActive]);

  useEffect(() => {
    setUser(userProps);
  }, [userProps]);
>>>>>>> develop

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

<<<<<<< HEAD
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
=======
  const handleFollow = async () => {
    setLoadingFollow(true);
    const response = await userCtx.followUser(username);

    setLoadingFollow(false);
    if (response.success) {
      setUser((currentUser) => ({
        ...currentUser,
        followers: {
          ...currentUser.followers,
          count: currentUser.followers.count + 1,
        },
      }));
      setIsFollow(true);
    } else {
      notificationCtx.showNotification({
        message: response.message,
        status: notificationCtx.status.DANGER,
      });
    }
  };

  const handleUnfollow = async () => {
    setLoadingFollow(true);
    const response = await userCtx.unfollowUser(username);

    setLoadingFollow(false);
    if (response.success) {
      setUser((currentUser) => ({
        ...currentUser,
        followers: {
          ...currentUser.followers,
          count: currentUser.followers.count - 1,
        },
      }));
      setIsFollow(false);
    } else {
      notificationCtx.showNotification({
        message: response.message,
        status: notificationCtx.status.DANGER,
      });
    }
  };

  const toggleFollowAndUnfollow = () => {
    if (isFollow) {
      handleUnfollow();
    } else {
      handleFollow();
    }
>>>>>>> develop
  };

  return (
    <>
      <header className="grid grid-cols-3 md:grid-cols-12 gap-2 md:gap-x-3 md:gap-y-0">
        <div className="row-span-2 sm:row-span-3 col-span-1 md:col-span-4 lg:col-span-3">
<<<<<<< HEAD
          <div className={`relative w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 xl:w-44 xl:h-44 2xl:w-52 2xl:h-52 rounded-full overflow-hidden ${loading ? 'bg-ev-dark-gray' : ''}`}>
            {!loading && (
              <Image
                src={user?.avatar}
                layout="fill"
                loading="lazy"
                alt="profile_avatar"
              />
            )}
=======
          <div className="relative w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 xl:w-44 xl:h-44 2xl:w-52 2xl:h-52 rounded-full overflow-hidden">
            <Image
              src={user.avatar}
              layout="fill"
              loading="lazy"
              objectFit="cover"
              alt="profile_avatar"
            />
>>>>>>> develop
          </div>
        </div>

        <div className="self-center col-span-3 sm:col-span-2 md:col-span-5 order-3 sm:order-none">
<<<<<<< HEAD
          <Title>{user?.name ?? ''}</Title>
=======
          <Title>{user.name}</Title>
>>>>>>> develop
        </div>

        <div className="self-center col-span-3 md:col-span-3 order-last md:order-none sm:mt-4 md:mt-0">
          <div className="xl:inline-block">
<<<<<<< HEAD
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
=======
            {sessionProps && userCtx.user && (
              <>
                {user.username === userCtx.user?.username && (
                  <Button typeButton="secondary" href="/profile/edit">Edit Profile</Button>
                )}
                {user.username !== userCtx.user?.username && (
                  <Button
                    typeButton={isFollow ? 'secondary' : 'primary'}
                    onClick={toggleFollowAndUnfollow}
                    loading={loadingFollow}
                    full
                  >
                    {isFollow ? 'Unfollow' : 'Follow'}
                  </Button>
>>>>>>> develop
                )}
              </>
            )}

<<<<<<< HEAD
            {!usernameCookie && (
              <Button href="/login">Follow</Button>
=======
            {!sessionProps && !userCtx.user && (
              <Button href="/auth/login">Follow</Button>
>>>>>>> develop
            )}
          </div>
        </div>

<<<<<<< HEAD
        <p className="col-span-2 col-span-3 md:col-span-8 lg:col-span-9 md:text-xl text-ev-dark-gray order-4 sm:order-none sm:col-span-2">{username ?? ''}</p>
=======
        <p className="col-span-3 md:col-span-8 lg:col-span-9 md:text-xl text-ev-dark-gray order-4 sm:order-none sm:col-span-2">{user.username}</p>
>>>>>>> develop

        <div className="col-span-2 row-span-2 sm:row-span-1 self-center md:self-start md:col-span-8 lg:col-span-9 order-2 sm:order-none">
          <div className="flex sm:gap-10 justify-between sm:justify-start">
            <div className="flex flex-col md:flex-row md:gap-2 items-center">
              <p>{events?.data?.events?.length}</p>
              <p>event</p>
            </div>
            <div className="flex flex-col md:flex-row md:gap-2 items-center">
<<<<<<< HEAD
              <p>{user?.followers?.length}</p>
              <p>followers</p>
            </div>
            <div className="flex flex-col md:flex-row md:gap-2 items-center">
              <p>{user?.following?.length}</p>
              <p>following</p>
=======
              <p>{user.followers.count}</p>
              <p>followers</p>
            </div>
            <div className="flex flex-col md:flex-row md:gap-2 items-center">
              <p>{user.followings.count}</p>
              <p>followings</p>
>>>>>>> develop
            </div>
          </div>
        </div>
      </header>

      <div className="w-full h-0.5 bg-ev-gray my-10" />

      <div>
<<<<<<< HEAD
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

        <EventList events={events?.data?.events ?? []} noHeader />

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
=======
        {events?.data?.events?.length > 0 && (
          <>
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

            <EventList events={events?.data?.events ?? []} noHeader />

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
          </>
        )}

        {events?.data?.events.length === 0 && (
          <p className="text-xl text-center mb-0 sm:mb-16 lg:mb-52">No events here</p>
>>>>>>> develop
        )}
      </div>
    </>
  );
}
<<<<<<< HEAD
=======

export async function getServerSideProps(context) {
  const { username } = context.query;

  const userResponse = await fetchApi(`/users/${username}`);

  if (!userResponse.success) {
    return {
      notFound: true,
    };
  }

  const eventResponse = await fetchApi(`/events?username=${userResponse.data.user.username}`);
  console.log(eventResponse);

  const session = await getSession({ req: context.req });

  return {
    props: {
      userProps: userResponse.data.user,
      sessionProps: session,
      eventsProps: eventResponse.data.events,
    },
  };
}
>>>>>>> develop
