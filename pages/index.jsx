import EventList from '@components/EventList';
import Pagination from '@components/Pagination';
import fetchData from '@lib/fetchData';
import { useState } from 'react';

export default function HomePage() {
  const [pageActive, setPageActive] = useState(1);
  const events = fetchData.getEvents(pageActive);

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
      <EventList events={events?.data?.events ?? []} />
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
  );
}
