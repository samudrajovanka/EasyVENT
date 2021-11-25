import AuthenticationError from '@exceptions/AuthenticationError';
import ClientError from '@exceptions/ClientError';
import InvariantError from '@exceptions/InvariantError';
import connectDb from '@lib/connectDb';
import { USER_CANT_SAME_ERR_MSG } from '@constants/errorMessage';
import { INVARIANT_ERR } from '@constants/errorType';
import { clientErrRes, notAllowedErrRes, serverErrRes } from '@lib/errorResponse';
import UserFollowersService from '@servicesDb/UserFollowersService';
import UserFollowingService from '@servicesDb/UserFollowingsService';
import userValidation from '@validations/user';
import { getSession } from 'next-auth/client';

async function handler(req, res) {
  const userFollowersService = new UserFollowersService();
  const userFollowingsService = new UserFollowingService();

  let session;
  try {
    session = await getSession({ req });

    if (!session) {
      throw new AuthenticationError('No authenticated');
    }
  } catch (error) {
    if (error instanceof ClientError) {
      return res.status(error.statusCode).json(clientErrRes(error));
    }

    return res.status(500).json(serverErrRes(error));
  }

  switch (req.method) {
    case 'PUT':
      try {
        const { username: usernameToFollow } = req.body;
        const { username } = req.query;

        // check if username same
        if (username === usernameToFollow) {
          throw new InvariantError(USER_CANT_SAME_ERR_MSG, INVARIANT_ERR);
        }

        // validate payload
        userValidation.validateUserFollowPayload(req.body);

        await userFollowingsService.addFollowing({ username, followingUsername: usernameToFollow });
        await userFollowersService.addFollower({
          username: usernameToFollow,
          followerUsername: username,
        });

        return res.status(200).json({
          success: true,
          message: `You are now following ${usernameToFollow}`,
        });
      } catch (error) {
        if (error instanceof ClientError) {
          return res.status(error.statusCode).json(clientErrRes(error));
        }

        return res.status(500).json(serverErrRes(error));
      }
    case 'DELETE':
      try {
        const { username: usernameToUnfollow } = req.body;
        const { username } = req.query;

        // check if username same
        if (username === usernameToUnfollow) {
          throw new InvariantError(USER_CANT_SAME_ERR_MSG, INVARIANT_ERR);
        }

        // validate payload
        userValidation.validateUserFollowPayload(req.body);

        await userFollowingsService.removeFollowing({
          username,
          followingUsername: usernameToUnfollow,
        });
        await userFollowersService.removeFollower({
          username: usernameToUnfollow,
          followerUsername: username,
        });

        return res.status(200).json({
          success: true,
          message: `You are no longer following ${usernameToUnfollow}`,
        });
      } catch (error) {
        if (error instanceof ClientError) {
          return res.status(error.statusCode).json(clientErrRes(error));
        }

        return res.status(500).json(serverErrRes(error));
      }
    default:
      return res.status(400).json(notAllowedErrRes());
  }
}

export default connectDb(handler);
