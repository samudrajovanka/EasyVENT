/* eslint-disable import/no-cycle */
import InvariantError from '@exceptions/InvariantError';
import {
  EXIST_DATA_ERR,
  NOT_FOUND_ERR,
  OLD_PASSWORD_ERR,
  TOKEN_INVALID_ERR,
  USER_ACTIVE_ERR,
  VALIDATION_ERR,
} from '@constants/errorType';
import User from '@models/UserModel';
import bcrypt from 'bcrypt';
import sendEmail from '@lib/sendEmail';
import { createToken, decodeToken } from '@lib/tokenManager';
import {
  CONFIRM_PASSWORD_ERR_MSG,
  EMAIL_EXIST_ERR_MSG,
  OLD_PASSWORD_ERR_MSG,
  TOKEN_INVALID_ERR_MSG,
  TYPE_VERIFICATION_ERR_MSG,
  USERNAME_EXIST_ERR_MSG,
  USER_ACTIVE_ERR_MSG,
  USER_NOT_FOUND_ERR_MSG,
} from 'constants/errorMessage';
import NotFoundError from '@exceptions/NotFoundError';
import { mapUserData, mapUsersData } from '@lib/formatData';
import FirebaseStorageService from '@servicesStorage/FirebaseStorageService';
import UserFollowingsService from './UserFollowingsService';
import UserFollowersService from './UserFollowersService';

class UserService {
  constructor() {
    this._saltHash = 10;
  }

  async createUser({
    name, email, username, password, confirmPassword,
  }) {
    // check email is unique
    const isEmailExist = await this.checkExistUser('email', email);
    if (isEmailExist) {
      throw new InvariantError(EMAIL_EXIST_ERR_MSG, EXIST_DATA_ERR);
    }

    // check username is unique
    const isUsernameExist = await this.checkExistUser('username', username);
    if (isUsernameExist) {
      throw new InvariantError(USERNAME_EXIST_ERR_MSG, EXIST_DATA_ERR);
    }

    // check password and confirmPassword is same
    if (password !== confirmPassword) {
      throw new InvariantError(CONFIRM_PASSWORD_ERR_MSG, VALIDATION_ERR);
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, this._saltHash);

    // create token jwt
    const token = createToken({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      username: username.toLowerCase().trim(),
      password: hashedPassword,
    }, process.env.SECRET_KEY_VERIFY, { expiresIn: '5m' });

    // send email to user
    const messageEmail = `
      <center>
        <h1>Welcome to EasyVENT</h1>
        <p>Please click the link below to verify your email address and complete your registration.</p>
        <a href="${process.env.HOME_URL}/verify/${token}?type=register" style="padding: 8px 12px; color: white; background-color: #3d91ff; border-radius: 3px; display: inline-block; width: 50%; text-align: center; text-decoration: none;">Verify Email</a>
      </center>
    `;

    await sendEmail({
      to: email,
      subject: 'Verification account EasyVENT',
      message: messageEmail,
    }, true);
  }

  async verifyToken({ token, type }) {
    try {
      const decoded = await decodeToken(token, process.env.SECRET_KEY_VERIFY);

      if (type === 'register') {
        const {
          name, email, username, password,
        } = decoded;

        // check exist user
        const isExistUser = await this.checkExistUser('email', email);

        if (isExistUser) {
          throw new InvariantError(USER_ACTIVE_ERR_MSG, USER_ACTIVE_ERR);
        }

        const dateNow = new Date();

        const newUser = new User({
          name,
          email,
          username,
          password,
          avatar: {
            url: `https://avatars.dicebear.com/api/jdenticon/${+dateNow}.svg`,
          },
          created_at: dateNow,
          updated_at: dateNow,
          is_verified_email: true,
        });

        const user = await newUser.save();

        const userFollowersService = new UserFollowersService();
        userFollowersService.createFollowers({ username });

        const userFollowingService = new UserFollowingsService();
        userFollowingService.createFollowing({ username });

        return user._id;
      // eslint-disable-next-line no-else-return
      } else if (type === 'update-email') {
        const { email } = decoded;

        const user = await User.findOne({ email });

        if (!user) {
          throw new NotFoundError(USER_NOT_FOUND_ERR_MSG, NOT_FOUND_ERR);
        }

        user.is_verified_email = true;

        await user.save();

        return user._id;
      }

      throw new InvariantError(TYPE_VERIFICATION_ERR_MSG, VALIDATION_ERR);
    } catch (error) {
      if (error.type === USER_ACTIVE_ERR) {
        throw error;
      }

      throw new InvariantError(TOKEN_INVALID_ERR_MSG, TOKEN_INVALID_ERR);
    }
  }

  async getUsers() {
    const users = await User.find();

    const usersFormated = mapUsersData(users);

    return usersFormated;
  }

  async getUserByUsername({ username }) {
    const user = await User.findOne({ username });

    if (!user) {
      throw new NotFoundError('User not found', NOT_FOUND_ERR);
    }

    const userFollowersService = new UserFollowersService();
    const userFollowingsService = new UserFollowingsService();

    const followers = await userFollowersService.getUserFollowers({ username });
    const followings = await userFollowingsService.getUserFollowings({ username });

    const userFormated = mapUserData(user, followers, followings);

    return userFormated;
  }

  async updateUserProfile(usernameUser, {
    name, username, email, avatarFile, removeAvatar,
  }) {
    const user = await User.findOne({ username: usernameUser });

    if (!user) {
      throw new NotFoundError('User not found', NOT_FOUND_ERR);
    }

    // check email is unique
    if (user.email !== email) {
      const isEmailExist = await this.checkExistUser('email', email);
      if (isEmailExist) {
        throw new InvariantError(EMAIL_EXIST_ERR_MSG, EXIST_DATA_ERR);
      }

      user.is_verified_email = false;
    }

    if (user.username !== username) {
      // check username is unique
      const isUsernameExist = await this.checkExistUser('username', username);
      if (isUsernameExist) {
        throw new InvariantError(USERNAME_EXIST_ERR_MSG, EXIST_DATA_ERR);
      }
    }

    let { url, path: pathName, default: isDefault } = user.avatar;
    if (!removeAvatar) {
      if (avatarFile) {
        const firebaseStorageService = new FirebaseStorageService();

        if (isDefault) {
          // upload to storage
          ({ url, pathName } = await firebaseStorageService.uploadImage(avatarFile, 'avatar'));
          isDefault = false;
        } else {
          // delete old image
          await firebaseStorageService.deleteFile(pathName);

          // upload to storage
          ({ url, pathName } = await firebaseStorageService.uploadImage(avatarFile, 'avatar'));
        }
      }
    } else if (removeAvatar) {
      const firebaseStorageService = new FirebaseStorageService();

      // delete old image
      await firebaseStorageService.deleteFile(pathName);

      url = `https://avatars.dicebear.com/api/jdenticon/${+user.created_at}.svg`;
      pathName = null;
      isDefault = true;
    }

    user.name = name;
    user.username = username;
    user.email = email;
    user.avatar = {
      url,
      path: pathName,
      default: isDefault,
    };
    await user.save();

    return mapUserData(user);
  }

  async updateUserPassword(username, { oldPassword, newPassword, confirmNewPassword }) {
    const user = await User.findOne({ username });

    if (!user) {
      throw new NotFoundError('User not found', NOT_FOUND_ERR);
    }

    // check old password
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordCorrect) {
      throw new InvariantError(OLD_PASSWORD_ERR_MSG, OLD_PASSWORD_ERR);
    }

    // check new password and confirmNewPassword is same
    if (newPassword !== confirmNewPassword) {
      throw new InvariantError(CONFIRM_PASSWORD_ERR_MSG, VALIDATION_ERR);
    }

    // hash password
    const hashedPassword = await bcrypt.hash(newPassword, this._saltHash);

    user.password = hashedPassword;

    await user.save();

    return user;
  }

  async verifyEmail(username, { email }) {
    const user = await User.findOne({ username });

    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND_ERR_MSG, NOT_FOUND_ERR);
    }

    if (user.email !== email) {
      user.email = email;
      user.is_verified_email = false;

      await user.save();
    }

    // create token jwt
    const token = createToken({
      username: user.username,
      email: email.toLowerCase().trim(),
    }, process.env.SECRET_KEY_VERIFY, { expiresIn: '5m' });

    // send email to user
    const messageEmail = `
      <center>
        <h1>Verification Email</h1>
        <p>Please click the link below to verify your email address</p>
        <a href="${process.env.HOME_URL}/verify/${token}?type=update-email" style="padding: 8px 12px; color: white; background-color: #3d91ff; border-radius: 3px; display: inline-block; width: 50%; text-align: center; text-decoration: none;">Verify Email</a>
      </center>
    `;

    await sendEmail({
      to: email,
      subject: 'Verification email EasyVENT',
      message: messageEmail,
    }, true);
  }

  async checkExistUser(condition, value) {
    const user = await User.findOne({ [condition]: value });

    if (user) {
      return true;
    }

    return false;
  }
}

export default UserService;
