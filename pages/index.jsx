import EventList from '@components/EventList';
import Pagination from '@components/Pagination';
import { fetchApi } from '@lib/fetchingData';
import sliceEvents from '@lib/sliceEvent';
import { useEffect, useState } from 'react';

export default function HomePage({ events }) {
  const [pageActive, setPageActive] = useState(1);

  const [eventsSlice, setEventsSlice] = useState(sliceEvents(pageActive, events));

  useEffect(() => {
    setEventsSlice(sliceEvents(pageActive, events));
  }, [pageActive]);

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
      {eventsSlice.maxPage > 1 && (
        <div className="flex justify-center mb-10">
          <Pagination
            pageActive={pageActive}
            endPage={eventsSlice.maxPage}
            leftClick={handleLeftClick}
            rightClick={handleRightClick}
            pageClick={handlePageClick}
          />
        </div>
      )}
      <EventList events={eventsSlice.data.events ?? []} />
      {eventsSlice.maxPage > 1 && (
        <div className="flex justify-center mt-10">
          <Pagination
            pageActive={pageActive}
            endPage={eventsSlice.maxPage}
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
