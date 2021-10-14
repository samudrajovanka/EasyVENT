import UserFollowing from '@models/UserFollowingModel';

class UserFollowingService {
  async createFollowing({ username }) {
    const dateNow = Date.now();

    const newUserFollowing = new UserFollowing({
      username,
      following: [],
      created_at: dateNow,
      updated_at: dateNow,
    });

    const userFollowing = await newUserFollowing.save();

    return userFollowing._id;
  }
}

export default UserFollowingService;
