import Button from '@components/Button';
import Card from '@components/Card';
import LabelInput from '@components/LabelInput';
import fetchData from '@lib/fetchData';
import Cookies from 'js-cookie';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({
    login: '',
    username: '',
    password: '',
  });
  const router = useRouter();

  const setErrorMessage = (field, message) => {
    setError((errorCurrent) => ({
      ...errorCurrent,
      [field]: message,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === '') {
      setErrorMessage('username', 'Username is required');
    } else {
      setErrorMessage('username', '');
    }

    if (password === '') {
      setErrorMessage('password', 'Password is required');
    } else {
      setErrorMessage('password', '');
    }

    if (username !== '' && password !== '') {
      const user = fetchData.login(username, password);

      if (user) {
        Cookies.set('login', true);
        Cookies.set('username', user.username);
        Cookies.set('avatar', user.avatar);
        setErrorMessage('login', '');
        router.replace('/');
      } else {
        setErrorMessage('login', 'Username or password invalid');
      }
    }
  };

  return (
    <form className="flex justify-center" onSubmit={(e) => handleLogin(e)} noValidate>
      <Card width="w-5/12" padding="p-8" gap="gap-10">
        <h1 className="font-bold text-2xl">Login</h1>

        <div className="flex flex-col gap-4">
          {error.login && <p className="text-ev-red">{error.login}</p>}
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
          <Button type="submit" full>Login</Button>
          <div className="flex gap-1 text-sm">
            <p>Dont&apos;t have an account?</p>
            <Link href="/register">
              <a className="text-ev-blue">Register here</a>
            </Link>
          </div>
        </div>
      </Card>
    </form>
  );
}
