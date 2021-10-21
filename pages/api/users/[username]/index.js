import AuthenticationError from '@exceptions/AuthenticationError';
import ClientError from '@exceptions/ClientError';
import connectDb from '@lib/connectDb';
import { clientErrRes, notAllowedErrRes, serverErrRes } from '@lib/errorResponse';
import uploadFormData from '@lib/uploadFormData';
import UserService from '@servicesDb/UserService';
import userValidation from '@validations/user';
import { getSession } from 'next-auth/client';

async function handler(req, res) {
  const userService = new UserService();

  switch (req.method) {
    case 'GET':
      try {
        const { username } = req.query;

        const user = await userService.getUserByUsername({ username });

        return res.status(200).json({
          success: true,
          data: {
            user,
          },
        });
      } catch (error) {
        if (error instanceof ClientError) {
          return res.status(error.statusCode).json(clientErrRes(error));
        }

        return res.status(500).json(serverErrRes(error));
      }
    case 'PUT':
      try {
        const session = await getSession({ req });

        if (!session) {
          throw new AuthenticationError('No authenticated');
        }

        const data = await uploadFormData(req, {
          typeFile: ['image/jpeg', 'image/jpg', 'image/png'],
        });

        const { username, name, email } = data.fields;
        const { avatar } = data.files;

        userValidation.validateUserUpdateProfilePayload({
          username, name, email, avatar,
        });

        const {
          username: usernameUser,
          'remove-avatar': removeAvatar = false,
        } = req.query;

        const user = await userService.updateUserProfile(usernameUser, {
          username, name, email, avatarFile: avatar, removeAvatar: removeAvatar === 'true',
        });

        return res.status(200).json({
          success: true,
          message: 'Profile successfull updated',
          data: {
            user,
          },
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

export const config = {
  api: {
    bodyParser: false,
  },
};
