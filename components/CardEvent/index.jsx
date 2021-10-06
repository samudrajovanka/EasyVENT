import Badge from '@components/Badge';
import PropTypes from 'prop-types';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import rupiahFormat from '@lib/currencyFormat';
import fetchData from '@lib/fetchData';
import moment from 'moment';
import Image from 'next/image';

export default function CardEvent({ event, noHeader }) {
  const user = fetchData.getUserByUsername(event.owner);
  const dateTime = moment(event.startDateTime).format('dddd, DD MMM YYYY | HH:mm');

  return (
    <div>
      <div className="flex flex-col border border-ev-gray rounded hover:shadow-xl cursor-pointer overflow-hidden">
        {!noHeader && (
          <div className="flex items-center gap-3 p-4">
            <div className="relative h-10 w-10 rounded-full overflow-hidden">
              <Image
                src={user.avatar}
                layout="fill"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-lg">{user.name}</p>
              <p className="text-ev-dark-gray">{user.username}</p>
            </div>
          </div>
        )}

        <div className="relative w-full h-44">
          <Image
            src={event.banner}
            layout="fill"
            loading="lazy"
          />
        </div>

        <div className="p-4">
          <header className="flex flex-col gap-2">
            <h1 className="line-clamp-2 font-bold">{event.eventName}</h1>
            <div className="flex gap-3">
              <Badge>{event.fee === 0 ? 'Free' : rupiahFormat(event.fee)}</Badge>
              <Badge>{event.eventType}</Badge>
            </div>
          </header>

          <div className="flex items-center pt-5 gap-2">
            <FontAwesomeIcon icon={faCalendarAlt} />
            <p>{dateTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

CardEvent.typeProps = {
  event: PropTypes.object,
  noHeader: PropTypes.bool,
};
