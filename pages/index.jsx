import CardEvent from '@components/CardEvent';
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
      <div className="flex justify-center mb-10">
        <Pagination
          pageActive={pageActive}
          endPage={events.maxPage}
          leftClick={handleLeftClick}
          rightClick={handleRightClick}
          pageClick={handlePageClick}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {events.data.events.map((event) => (
          <CardEvent key={event.id} event={event} />
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <Pagination
          pageActive={pageActive}
          endPage={events.maxPage}
          leftClick={handleLeftClick}
          rightClick={handleRightClick}
          pageClick={handlePageClick}
        />
      </div>
    </>
  );
}
