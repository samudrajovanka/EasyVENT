import Badge from '@components/Badge';
import PropTypes from 'prop-types';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import rupiahFormat from '@lib/currencyFormat';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchApi } from '@lib/fetchingData';

export default function CardEvent({ event, noHeader }) {
  const [user, setUser] = useState({});

  useEffect(async () => {
    const response = await fetchApi(`/users/${event.owner}`);

    setUser(response.data.user);
  }, []);

  const dateTime = moment(event.start_time).format('dddd, DD MMM YYYY | HH:mm');

  return (
    <Link href={`/events/${event._id}`}>
      <a>
        <div className="flex flex-col border border-ev-gray rounded hover:shadow-xl cursor-pointer overflow-hidden">
          {!noHeader && (
            <div className="flex items-center gap-3 p-4">
              <div className="relative h-10 img-square-ratio rounded-full overflow-hidden">
                <Image
                  src={user?.avatar ?? '/images/blank.png'}
                  layout="fill"
                  loading="lazy"
                  objectFit="cover"
                  alt="profile_avatar"
                />
              </div>
              <div className="flex flex-col">
                <p className="sm:text-lg">{user?.name}</p>
                <p className="text-ev-dark-gray">{user?.username}</p>
              </div>
            </div>
          )}

          <div className="relative w-full img-banner-ratio">
            <Image
              src={event.banner.url}
              layout="fill"
              loading="lazy"
              objectFit="cover"
              alt="banner_card"
            />
          </div>

          <div className="p-4">
            <header className="flex flex-col gap-2">
              <h1 className="line-clamp-2 font-bold">{event.eventName}</h1>
              <div className="flex gap-3">
                <Badge>{event.fee === 0 ? 'Free' : rupiahFormat(event.fee)}</Badge>
                <Badge>{event.type}</Badge>
              </div>
            </header>

            <div className="flex items-center pt-5 gap-2">
              <FontAwesomeIcon icon={faCalendarAlt} />
              <p>{dateTime}</p>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}

CardEvent.typeProps = {
  event: PropTypes.object,
  noHeader: PropTypes.bool,
};
