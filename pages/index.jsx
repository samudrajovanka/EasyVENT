import EventList from '@components/EventList';
import Pagination from '@components/Pagination';
<<<<<<< HEAD
import fetchData from '@lib/fetchData';
import { useState } from 'react';

export default function HomePage() {
  const [pageActive, setPageActive] = useState(1);
  const events = fetchData.getEvents(pageActive);
=======
import { fetchApi } from '@lib/fetchingData';
import sliceEvents from '@lib/sliceEvent';
import { useEffect, useState } from 'react';

export default function HomePage({ events }) {
  const [pageActive, setPageActive] = useState(1);

  const [eventsSlice, setEventsSlice] = useState(sliceEvents(pageActive, events));

  useEffect(() => {
    setEventsSlice(sliceEvents(pageActive, events));
  }, [pageActive]);
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

  return (
    <>
<<<<<<< HEAD
      {events.maxPage > 1 && (
        <div className="flex justify-center mb-10">
          <Pagination
            pageActive={pageActive}
            endPage={events.maxPage}
=======
      {eventsSlice.maxPage > 1 && (
        <div className="flex justify-center mb-10">
          <Pagination
            pageActive={pageActive}
            endPage={eventsSlice.maxPage}
>>>>>>> develop
            leftClick={handleLeftClick}
            rightClick={handleRightClick}
            pageClick={handlePageClick}
          />
        </div>
      )}
<<<<<<< HEAD
      <EventList events={events?.data?.events ?? []} />
      {events.maxPage > 1 && (
        <div className="flex justify-center mt-10">
          <Pagination
            pageActive={pageActive}
            endPage={events.maxPage}
=======
      <EventList events={eventsSlice.data.events ?? []} />
      {eventsSlice.maxPage > 1 && (
        <div className="flex justify-center mt-10">
          <Pagination
            pageActive={pageActive}
            endPage={eventsSlice.maxPage}
>>>>>>> develop
            leftClick={handleLeftClick}
            rightClick={handleRightClick}
            pageClick={handlePageClick}
          />
        </div>
      )}
    </>
  );
}

export async function getServerSideProps() {
  const response = await fetchApi('/events');

  const { events } = response.data;

  return {
    props: {
      events,
    },
  };
}
