import AuthenticationError from '@exceptions/AuthenticationError';
import connectDb from '@lib/connectDb';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import User from '@models/UserModel';
import bcrypt from 'bcrypt';
import { LOGIN_FAILED_ERR_MSG } from '@constants/errorMessage';
import userValidation from '@validations/user';

export default connectDb(NextAuth({
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.SECRET_KEY_LOGIN,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        userValidation.validateLoginUserPayload({
          username: credentials.username,
          password: credentials.password,
        });

        const user = await User.findOne({ username: credentials.username.toLowerCase() });

        if (!user) {
          throw new AuthenticationError(LOGIN_FAILED_ERR_MSG);
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password);

        if (!isMatch) {
          throw new AuthenticationError(LOGIN_FAILED_ERR_MSG);
        }

        return { name: user.username, email: user.email, image: user.avatar.url };
      },
    }),
  ],
  database: process.env.MONGO_URI,
}), true);
