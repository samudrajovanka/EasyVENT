/* eslint-disable import/no-cycle */
import InvariantError from '@exceptions/InvariantError';
import {
  EXIST_DATA_ERR,
  NOT_FOUND_ERR,
  TOKEN_INVALID_ERR,
  VALIDATION_ERR,
} from '@lib/constantErrorType';
import User from '@models/UserModel';
import bcrypt from 'bcrypt';
import sendEmail from '@lib/sendEmail';
import { createToken, decodeToken } from '@lib/tokenManager';
import {
  CONFIRM_PASSWORD_ERR_MSG,
  EMAIL_EXIST_ERR_MSG,
  TOKEN_INVALID_ERR_MSG,
  USERNAME_EXIST_ERR_MSG,
} from '@lib/constantErrorMessage';
import NotFoundError from '@exceptions/NotFoundError';
import { mapUserData } from '@lib/formatData';
import UserFollowingsService from './UserFollowingsService';
import UserFollowersService from './UserFollowersService';

class UserService {
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
    const hashedPassword = await bcrypt.hash(password, 10);

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
        <a href="${process.env.HOME_URL}/verify/${token}" style="padding: 8px 12px; color: white; background-color: #3d91ff; border-radius: 3px; display: inline-block; width: 50%; text-align: center; text-decoration: none;">Verify Email</a>
      </center>
    `;

    await sendEmail({
      to: email,
      subject: 'Verification email EasyVENT',
      message: messageEmail,
    }, true);
  }

  async verifyEmail({ token }) {
    try {
      const decoded = await decodeToken(token, process.env.SECRET_KEY_VERIFY);

      const {
        name, email, username, password,
      } = decoded;

      const dateNow = new Date();

      const newUser = new User({
        name,
        email,
        username,
        password,
        avatar: {
          url: `https://avatars.dicebear.com/api/jdenticon/${username}.svg`,
        },
        created_at: dateNow,
        updated_at: dateNow,
      });

      const user = await newUser.save();

      const userFollowersService = new UserFollowersService();
      userFollowersService.createFollowers({ username });

      const userFollowingService = new UserFollowingsService();
      userFollowingService.createFollowing({ username });

      return user._id;
    } catch (error) {
      throw new InvariantError(TOKEN_INVALID_ERR_MSG, TOKEN_INVALID_ERR);
    }
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

  async checkExistUser(condition, value) {
    const user = await User.findOne({ [condition]: value });

    if (user) {
      return true;
    }

    return false;
  }
}

export default UserService;