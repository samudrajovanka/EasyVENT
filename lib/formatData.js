export const mapUserData = (userData, userFollowers, userFollowings) => {
  if (userFollowers && userFollowings) {
    return {
      id: userData._id,
      username: userData.username,
      email: userData.email,
      isVerifiedEmail: userData.is_verified_email,
      name: userData.name,
      avatar: userData.avatar.url,
      followers: {
        count: userFollowers.followers.length,
        list: userFollowers.followers,
      },
      followings: {
        count: userFollowings.followings.length,
        list: userFollowings.followings,
      },
      createdAt: userData.created_at,
      updatedAt: userData.updated_at,
    };
  }

  return {
    id: userData._id,
    username: userData.username,
    email: userData.email,
    name: userData.name,
    avatar: userData.avatar.url,
    createdAt: userData.created_at,
    updatedAt: userData.updated_at,
  };
};

export const mapUsersData = (usersData) => usersData.map((userData) => ({
  id: userData._id,
  username: userData.username,
  email: userData.email,
  name: userData.name,
  avatar: userData.avatar.url,
  createdAt: userData.created_at,
  updatedAt: userData.updated_at,
}));
