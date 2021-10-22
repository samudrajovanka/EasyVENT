/* eslint-disable  */
import { fetchApi } from '@lib/fetchingData';
import { useSession } from 'next-auth/client';
import { createContext, useEffect, useState } from 'react';

const UserContext = createContext({
  user: {},
  setUserByUsername: (username) => {},
  updateProfile: ({ name, username, email, avatarBody, isRemoveAvatar }) => {},
  updatePassword: ({ oldPassword, newPassword, confirmNewPassword }) => {},
  updateEmail: ({ email }) => {},
  removeUser: () => {},
  followUser: (username) => {},
  unfollowUser: (username) => {},
  isLoading: true,
  isAuthenticated: false
});

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [session, loading] = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(async () => {
    if (!loading && session) {
      await setUserByUsername(session.user.name);
    } else if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

  const setUserByUsername = async (username) => {
    setIsLoading(true);

    const response = await fetchApi(`/users/${username}`);

    if (response.success) {
      setUser(response.data.user);
      setIsAuthenticated(true);
      setIsLoading(false);
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
    setIsLoading(true);
    setIsAuthenticated(false);
    setUser(null);
    setIsLoading(false);
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

  const updateEmail = async (email) => {
    const response = await fetchApi(`/users/${user?.username}/email`, {
      method: 'PUT',
      body: {
        email,
      }
    });

    if (response.success) {
      setUser((currentUser) => ({
        ...currentUser,
        email,
        isEmailVerified: false,
      }));
    }

    return response;
  }

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
    updateEmail,
    removeUser,
    followUser,
    unfollowUser,
    isLoading,
    isAuthenticated,
  };

  return (
    <UserContext.Provider value={context}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
