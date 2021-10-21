import Button from '@components/Button';
import Card from '@components/Card';
import LabelInput from '@components/LabelInput';
import Title from '@components/Title';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { getSession, signIn } from 'next-auth/client';
import UserContext from '@context/userContext';
import NotificationContext from '@context/notificationContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [error, setError] = useState({
    username: '',
    password: '',
  });
  const router = useRouter();
  const userCtx = useContext(UserContext);
  const notificationCtx = useContext(NotificationContext);

  const setErrorMessage = (field, message) => {
    setError((errorCurrent) => ({
      ...errorCurrent,
      [field]: message,
    }));
  };

  const validateForm = () => {
    let isValid = true;

    if (username === '') {
      setErrorMessage('username', 'Username is required');
      isValid = false;
    } else {
      setErrorMessage('username', '');
      isValid = true;
    }

    if (password === '') {
      setErrorMessage('password', 'Password is required');
      isValid = false;
    } else {
      setErrorMessage('password', '');
      isValid = true;
    }

    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingLogin(true);

    const isValid = validateForm();

    if (isValid) {
      const response = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });

      setLoadingLogin(false);
      if (!response.error) {
        userCtx.setUserByUsername(username);
        router.replace('/');
      } else {
        notificationCtx.showNotification({
          message: response.error,
          status: notificationCtx.status.DANGER,
        });
      }
    } else {
      setLoadingLogin(false);
    }
  };

  return (
    <form className="flex justify-center items-center absolute top-0 left-0 h-screen w-full p-4 sm:relative sm:p-0 sm:h-auto" onSubmit={(e) => handleLogin(e)} noValidate>
      <Card width="w-full lg:w-6/12" padding="p-5 lg:p-8" gap="gap-10">
        <Title>Login</Title>

        <div className="flex flex-col gap-4">
          <LabelInput
            label="Username"
            id="username"
            required
            placeholder="Your username"
            value={username}
            errorMessage={error.username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <LabelInput
            label="Password"
            id="password"
            type="password"
            required
            placeholder="Your password"
            value={password}
            errorMessage={error.password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          <Button type="submit" full loading={loadingLogin}>Login</Button>
          <div className="flex gap-1 text-sm">
            <p>Dont&apos;t have an account?</p>
            <Link href="/auth/register">
              <a className="text-ev-blue">Register here</a>
            </Link>
          </div>
        </div>
      </Card>
    </form>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
