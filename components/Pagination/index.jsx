import PaginationBox from '@components/PaginationBox';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Pagination({
  pageActive, endPage, leftClick, rightClick, pageClick,
}) {
  const MAX = 3;
  const pages = [];
  let i = pageActive % 2 === 0 ? pageActive - 1 : pageActive;
  const constraint = pageActive % 2 === 0 ? pageActive + 1 : pageActive + MAX - 1;
  for (i; i <= constraint; i += 1) {
    pages.push(i);
  }

  return (
    <div className="flex border border-ev-gray rounded overflow-hidden">
      <PaginationBox
        onClick={leftClick}
        type="arrow"
        active={pageActive === 1}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </PaginationBox>
      {pages.map((page) => {
        if (page <= endPage) {
          return (
            <PaginationBox key={page} onClick={() => pageClick(page)} active={pageActive === page}>
              {page}
            </PaginationBox>
          );
        }

        return null;
      })}
      <PaginationBox
        onClick={rightClick}
        type="arrow"
        active={pageActive === endPage}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </PaginationBox>
    </div>
  );
}
