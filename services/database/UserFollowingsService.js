/* eslint-disable import/no-cycle */
import InvariantError from '@exceptions/InvariantError';
import NotFoundError from '@exceptions/NotFoundError';
import {
  USER_ALREADY_FOLLOWING_ERR_MSG,
  USER_FOLLOWING_NOT_FOUND_ERR_MSG,
  USER_TO_FOLLOWING_NOT_FOUND_ERR_MSG,
  USER_TO_UNFOLLOWING_NOT_FOUND_ERR_MSG,
} from '@constants/errorMessage';
import { NOT_FOUND_ERR } from '@constants/errorType';
import UserFollowings from '@models/UserFollowingsModel';
import UserService from './UserService';

class UserFollowingsService {
  async createFollowing({ username }) {
    const dateNow = Date.now();

    const newUserFollowing = new UserFollowings({
      username,
      following: [],
      created_at: dateNow,
      updated_at: dateNow,
    });

    const userFollowing = await newUserFollowing.save();

    return userFollowing._id;
  }

  async getUserFollowings({ username }) {
    const userFollowing = await UserFollowings.findOne({ username });

    if (!userFollowing) {
      throw new NotFoundError(USER_FOLLOWING_NOT_FOUND_ERR_MSG, NOT_FOUND_ERR);
    }

    return userFollowing;
  }

  async addFollowing({ username, followingUsername }) {
    const userFollowing = await UserFollowings.findOne({ username });

    if (!userFollowing) {
      throw new NotFoundError(USER_FOLLOWING_NOT_FOUND_ERR_MSG, NOT_FOUND_ERR);
    }

    // check if user exist
    const isUserFollowingExist = await new UserService().checkExistUser('username', followingUsername);

    if (!isUserFollowingExist) {
      throw new NotFoundError(USER_TO_FOLLOWING_NOT_FOUND_ERR_MSG, NOT_FOUND_ERR);
    }

    // check if user already following
    const isFollowing = userFollowing.followings
      .some((following) => following === followingUsername);

    if (isFollowing) {
      throw new InvariantError(USER_ALREADY_FOLLOWING_ERR_MSG);
    }

    const newFollowing = [...userFollowing.followings, followingUsername];

    userFollowing.followings = newFollowing;
    userFollowing.updatedAt = Date.now();

    await userFollowing.save();

    return userFollowing;
  }

  async removeFollowing({ username, followingUsername }) {
    const userFollowing = await UserFollowings.findOne({ username });

    if (!userFollowing) {
      throw new NotFoundError(USER_FOLLOWING_NOT_FOUND_ERR_MSG, NOT_FOUND_ERR);
    }

    // check if user exist
    const isUserFollowingExist = await new UserService().checkExistUser('username', followingUsername);

    if (!isUserFollowingExist) {
      throw new NotFoundError(USER_TO_UNFOLLOWING_NOT_FOUND_ERR_MSG, NOT_FOUND_ERR);
    }

    const newFollowing = userFollowing.followings.filter(
      (following) => following !== followingUsername,
    );

    userFollowing.followings = newFollowing;
    userFollowing.updatedAt = Date.now();

    await userFollowing.save();

    return userFollowing;
  }
}

export default UserFollowingsService;
