/* eslint-disable import/no-cycle */
import NotFoundError from '@exceptions/NotFoundError';
import {
  USER_FOLLOWER_NOT_FOUND_ERR_MSG,
  USER_TO_FOLLOWER_NOT_FOUND_ERR_MSG,
} from '@constants/errorMessage';
import { NOT_FOUND_ERR } from '@constants/errorType';
import UserFollowers from '@models/UserFollowersModel';
import UserService from './UserService';

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

  async getUserFollowers({ username }) {
    const userFollowers = await UserFollowers.findOne({ username });

    if (!userFollowers) {
      throw new NotFoundError(USER_FOLLOWER_NOT_FOUND_ERR_MSG, NOT_FOUND_ERR);
    }

    return userFollowers;
  }

  async addFollower({ username, followerUsername }) {
    const userFollowers = await UserFollowers.findOne({ username });

    if (!userFollowers) {
      throw new NotFoundError(USER_FOLLOWER_NOT_FOUND_ERR_MSG, NOT_FOUND_ERR);
    }

    // check if user exist
    const isUserFollowingExist = await new UserService().checkExistUser('username', followerUsername);

    if (!isUserFollowingExist) {
      throw new NotFoundError(USER_TO_FOLLOWER_NOT_FOUND_ERR_MSG, NOT_FOUND_ERR);
    }

    const newFollowers = [...userFollowers.followers, followerUsername];

    userFollowers.followers = newFollowers;
    userFollowers.updated_at = Date.now();

    await userFollowers.save();

    return userFollowers;
  }

  async removeFollower({ username, followerUsername }) {
    const userFollowers = await UserFollowers.findOne({ username });

    if (!userFollowers) {
      throw new NotFoundError(USER_FOLLOWER_NOT_FOUND_ERR_MSG, NOT_FOUND_ERR);
    }

    // check if user exist
    const isUserFollowingExist = await new UserService().checkExistUser('username', followerUsername);

    if (!isUserFollowingExist) {
      throw new NotFoundError(USER_TO_FOLLOWER_NOT_FOUND_ERR_MSG, NOT_FOUND_ERR);
    }

    const newFollowers = userFollowers.followers.filter(
      (follower) => follower !== followerUsername,
    );

    userFollowers.followers = newFollowers;
    userFollowers.updated_at = Date.now();

    await userFollowers.save();

    return userFollowers;
  }
}

export default UserFollowersService;
