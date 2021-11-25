const sliceEvents = (page, events) => {
  const maxList = 9;
  const startIndex = (page * maxList) - maxList;
  const endIndex = (page * maxList);
  const eventList = events.slice(startIndex, endIndex);
  return {
    page,
    maxPage: Math.ceil(events.length / maxList),
    data: {
      events: eventList,
    },
  };
};

export default sliceEvents;
