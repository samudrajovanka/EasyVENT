import Button from '@components/Button';
import EventList from '@components/EventList';
import Pagination from '@components/Pagination';
import Title from '@components/Title';
import fetchData from '@lib/fetchData';
import { useRouter } from 'next/dist/client/router';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { fetchApi } from '@lib/fetchingData';
import { getSession, useSession } from 'next-auth/client';

export default function ProfileUserPage({ sessionProps, user }) {
  const [pageActive, setPageActive] = useState(1);
  const router = useRouter();
  const { username } = router.query;
  const [session] = useSession();
  const [followersCount, setFollowersCount] = useState(user.followers.count);
  const [isFollow, setIsFollow] = useState(user.followers.list
    .some((follower) => follower === sessionProps.user.name));
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!username) {
      return;
    }

    setEvents(fetchData.getEventsByUsername(username, pageActive));
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

  const handleFollow = async () => {
    const response = await fetchApi(`/users/${session.user.name}/follow`, {
      method: 'PUT',
      body: {
        username,
      },
      headers: {
        accept: 'application/json',
      },
    });

    if (response.success) {
      setFollowersCount(followersCount + 1);
      setIsFollow(true);
    } else {
      console.log(response.message);
    }
  };

  const handleUnfollow = async () => {
    const response = await fetchApi(`/users/${session.user.name}/follow`, {
      method: 'DELETE',
      body: {
        username,
      },
      headers: {
        accept: 'application/json',
      },
    });

    if (response.success) {
      setFollowersCount(followersCount - 1);
      setIsFollow(false);
    } else {
      console.log(response.message);
    }
  };

  return (
    <>
      <header className="grid grid-cols-3 md:grid-cols-12 gap-2 md:gap-x-3 md:gap-y-0">
        <div className="row-span-2 sm:row-span-3 col-span-1 md:col-span-4 lg:col-span-3">
          <div className="relative w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 xl:w-44 xl:h-44 2xl:w-52 2xl:h-52 rounded-full overflow-hidden">
            <Image
              src={user.avatar}
              layout="fill"
              loading="lazy"
              alt="profile_avatar"
            />
          </div>
        </div>

        <div className="self-center col-span-3 sm:col-span-2 md:col-span-5 order-3 sm:order-none">
          <Title>{user.name}</Title>
        </div>

        <div className="self-center col-span-3 md:col-span-3 order-last md:order-none sm:mt-4 md:mt-0">
          <div className="xl:inline-block">
            {session && (
              <>
                {user.username === session.user.name && (
                  <Button typeButton="secondary" href="/profile/edit">Edit Profile</Button>
                )}
                {user.username !== session.user.name && isFollow && (
                  <Button typeButton="secondary" onClick={handleUnfollow} full>Unfollow</Button>
                )}
                {user.username !== session.user.name && !isFollow && (
                  <Button onClick={handleFollow} full>Follow</Button>
                )}
              </>
            )}

            {!session && (
              <Button href="/login">Follow</Button>
            )}
          </div>
        </div>

        <p className="col-span-2 col-span-3 md:col-span-8 lg:col-span-9 md:text-xl text-ev-dark-gray order-4 sm:order-none sm:col-span-2">{user.username}</p>

        <div className="col-span-2 row-span-2 sm:row-span-1 self-center md:self-start md:col-span-8 lg:col-span-9 order-2 sm:order-none">
          <div className="flex sm:gap-10 justify-between sm:justify-start">
            <div className="flex flex-col md:flex-row md:gap-2 items-center">
              <p>{events?.data?.events?.length}</p>
              <p>event</p>
            </div>
            <div className="flex flex-col md:flex-row md:gap-2 items-center">
              <p>{followersCount}</p>
              <p>followers</p>
            </div>
            <div className="flex flex-col md:flex-row md:gap-2 items-center">
              <p>{user.followings.count}</p>
              <p>followings</p>
            </div>
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
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { username } = context.query;

  const userResponse = await fetchApi(`/users/${username}`);

  if (!userResponse.success) {
    return {
      notFound: true,
    };
  }

  const session = await getSession({ req: context.req });

  return {
    props: {
      user: userResponse.data.user,
      sessionProps: session,
    },
  };
}
