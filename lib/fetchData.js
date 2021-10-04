import events from 'data/events';
import users from 'data/users';

const fetchData = {
  getEvents: (page = 1) => {
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
  },
  getUser: (username) => users.find((user) => user.username === username),
  login: (username, password) => {
    const user = fetchData.getUser(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  },
};

export default fetchData;
