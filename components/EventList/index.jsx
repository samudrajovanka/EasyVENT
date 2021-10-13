/* eslint-disable react/forbid-prop-types */
import CardEvent from '@components/CardEvent';
import PropTypes from 'prop-types';
import uuid from 'react-uuid';

export default function EventList({ events, noHeader }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <CardEvent key={uuid()} event={event} noHeader={noHeader} />
      ))}
    </div>
  );
}

EventList.propTypes = {
  events: PropTypes.array.isRequired,
};
