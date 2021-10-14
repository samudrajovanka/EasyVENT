import InvariantError from '@exceptions/InvariantError';
import { EXIST_DATA_ERR, TOKEN_INVALID_ERR, VALIDATION_ERR } from '@lib/constantErrorType';
import User from '@models/UserModel';
import bcrypt from 'bcrypt';
import sendEmail from '@lib/sendEmail';
import { createToken, decodedToken } from '@lib/tokenManager';
import { EMAIL_EXIST_ERR_MSG, TOKEN_INVALID_ERR_MSG, USERNAME_EXIST_ERR_MSG } from '@lib/constantErrorMessage';
import UserFollowersService from './UserFollowersService';
import UserFollowingService from './UserFollowingService';

class UserService {
  async createUser({
    name, email, username, password, confirmPassword,
  }) {
    // check email is unique
    await this.checkExistUser('email', email, EMAIL_EXIST_ERR_MSG);

    // check username is unique
    await this.checkExistUser('username', username, USERNAME_EXIST_ERR_MSG);

    // check password and confirmPassword is same
    if (password !== confirmPassword) {
      throw new InvariantError('Confirm password do not match', VALIDATION_ERR);
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create token jwt
    const token = createToken({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      username: username.toLowerCase().trim(),
      password: hashedPassword,
    }, { expiresIn: '5m' });

    // send email to user
    const messageEmail = `
      <center>
        <h1>Welcome to EasyVENT</h1>
        <p>Please click the link below to verify your email address and complete your registration.</p>
        <a href="${process.env.HOME_URL}/verify/${token}" style="padding: 8px 12px; color: white; background-color: #3d91ff; border-radius: 3px; display: inline-block; width: 50%; text-align: center;">Verify Email</a>
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
      const decoded = await decodedToken(token);

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

      const userFollowingService = new UserFollowingService();
      userFollowingService.createFollowing({ username });

      return user._id;
    } catch (error) {
      throw new InvariantError(TOKEN_INVALID_ERR_MSG, TOKEN_INVALID_ERR);
    }
  }

  async checkExistUser(condition, value, messageError) {
    const user = await User.findOne({ [condition]: value });

    if (user) {
      throw new InvariantError(messageError, EXIST_DATA_ERR);
    }

    return false;
  }
}

export default UserService;
