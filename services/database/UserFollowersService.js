import UserFollowers from '@models/UserFollowersModel';

class UserFollowersService {
  async createFollowers({ username }) {
    const dateNow = Date.now();

    const newUserFollowers = new UserFollowers({
      username,
      followers: [],
      created_at: dateNow,
      updated_at: dateNow,
    });

    const userFollowers = await newUserFollowers.save();

    return userFollowers._id;
  }
}

export default UserFollowersService;
