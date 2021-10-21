/* eslint-disable  */
import { fetchApi } from '@lib/fetchingData';
import { useSession } from 'next-auth/client';
import { createContext, useEffect, useState } from 'react';

const UserContext = createContext({
  user: {},
  setUserByUsername: (username) => {},
  updateProfile: ({ name, username, email, avatarBody, isRemoveAvatar }) => {},
  updatePassword: ({ oldPassword, newPassword, confirmNewPassword }) => {},
  removeUser: () => {},
  followUser: (username) => {},
  unfollowUser: (username) => {},
});

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [session, loading] = useSession();

  useEffect(async () => {
    if (session) {
      setUserByUsername(session.user.name);
    }
  }, [session]);

  const setUserByUsername = async (username) => {
    const response = await fetchApi(`/users/${username}`);

    if (response.success) {
      setUser(response.data.user);
    }
    return response;
  };

  const updateProfile = async ({ name, username, email, avatarBody, isRemoveAvatar }) => {
    const response = await fetchApi(`/users/${user?.username}?remove-avatar=${isRemoveAvatar}`, {
      method: 'PUT',
      headers: {
        'content-type': undefined,
      },
      body: {
        name,
        username,
        email,
        avatar: avatarBody,
      },
    });

    if (response.success) {
      setUser((currentUser) => ({
        ...currentUser,
        ...response.data.user,
      }));
    }

    return response;
  }

  const removeUser = () => {
    setUser(null);
  }

  const updatePassword = async ({ oldPassword, newPassword, confirmNewPassword }) => {
    const response = await fetchApi(`/users/${user?.username}/password`, {
      method: 'PUT',
      body: {
        oldPassword,
        newPassword,
        confirmNewPassword,
      },
    });

    return response;
  };

  const followUser = async (username) => {
    const response = await fetchApi(`/users/${user.username}/follow`, {
      method: 'PUT',
      body: {
        username,
      },
    });

    if (response.success) {
      setUser((currentUser) => ({
        ...currentUser,
        followings: {
          count: currentUser.followings.count + 1,
          list: [...currentUser.followings.list, username],
        },
      }));
    }

    return response;
  }

  const unfollowUser = async (username) => {
    const response = await fetchApi(`/users/${user.username}/follow`, {
      method: 'DELETE',
      body: {
        username,
      },
    });

    if (response.success) {
      setUser((currentUser) => ({
        ...currentUser,
        followings: {
          count: currentUser.followings.count - 1,
          list: currentUser.followings.list.filter((following) => following !== username),
        },
      }));
    }

    return response;
  }

  const context = {
    user,
    setUserByUsername,
    updateProfile,
    updatePassword,
    removeUser,
    followUser,
    unfollowUser,
  };

  return (
    <UserContext.Provider value={context}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
