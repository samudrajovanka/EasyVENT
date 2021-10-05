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
  getUserByUsername: (username) => users.find((user) => {
    const usernameLowerCase = username.toString().toLowerCase();
    return user.username === usernameLowerCase;
  }),
  getUserByEmail: (email) => users.find((user) => {
    const emailLowerCase = email.toString().toLowerCase();
    return user.email === emailLowerCase;
  }),
  login: (username, password) => {
    const user = fetchData.getUserByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  },
  register: ({
    name, email, username, password, confirmPassword,
  }) => {
    let user = fetchData.getUserByEmail(email);
    if (user) {
      return {
        success: false,
        message: 'Email already exists',
        type: 'EMAIL_EXIST',
      };
    }

    user = fetchData.getUserByUsername(username);
    if (user) {
      return {
        success: false,
        message: 'Username already exists',
        type: 'USERNAME_EXIST',
      };
    }

    if (password.length < 8) {
      return {
        success: false,
        message: 'Password must be at least 8 characters',
        type: 'PASSWORD_LENGTH',
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        message: 'Confirm password do not match',
        type: 'PASSWORD_MISMATCH',
      };
    }

    const newUser = {
      id: users.length + 1,
      name,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password,
      avatar: '/images/avatar/default-avatar.jpg',
    };

    users.push(newUser);

    return {
      success: true,
      message: 'Successfully registered',
    };
  },
};

export default fetchData;
