import Button from '@components/Button';
import Card from '@components/Card';
import LabelInput from '@components/LabelInput';
import Title from '@components/Title';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';
import { fetchApi } from '@lib/fetchingData';
import { EXIST_DATA_ERR, VALIDATION_ERR } from '@lib/constantErrorType';
import {
  EMAIL_EXIST_ERR_MSG,
  NAME_ALPHANUMERIC_ERR_MSG,
  USERNAME_EXIST_ERR_MSG,
  USERNAME_REGEX_ERR_MSG,
} from '@lib/constantErrorMessage';
import { isAlphanumericWithSpace, isEmail, isUsername } from '@lib/typeChecking';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({
    register: '',
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const router = useRouter();

  const setErrorMessage = (field, message) => {
    setError((errorCurrent) => ({
      ...errorCurrent,
      [field]: message,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    let isValid = true;

    if (name === '') {
      setErrorMessage('name', 'Name is required');
      isValid = false;
    } else if (!isAlphanumericWithSpace(name)) {
      setErrorMessage('name', NAME_ALPHANUMERIC_ERR_MSG);
      isValid = false;
    } else {
      setErrorMessage('name', '');
      isValid = isValid && true;
    }

    if (email === '') {
      setErrorMessage('email', 'Email is required');
      isValid = false;
    } else if (!isEmail(email)) {
      setErrorMessage('email', 'Email is invalid');
      isValid = false;
    } else {
      setErrorMessage('email', '');
      isValid = isValid && true;
    }

    if (username === '') {
      setErrorMessage('username', 'Username is required');
      isValid = false;
    } else if (!isUsername(username)) {
      setErrorMessage('username', USERNAME_REGEX_ERR_MSG);
      isValid = false;
    } else {
      setErrorMessage('username', '');
      isValid = isValid && true;
    }

    if (password === '') {
      setErrorMessage('password', 'Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setErrorMessage('password', 'Password must be at least 8 characters');
      isValid = false;
    } else {
      setErrorMessage('password', '');
      isValid = isValid && true;
    }

    if (confirmPassword === '') {
      setErrorMessage('confirmPassword', 'Confirm password is required');
      isValid = false;
    } else if (confirmPassword !== password) {
      setErrorMessage('confirmPassword', 'Confirm password must match');
      isValid = false;
    } else {
      setErrorMessage('confirmPassword', '');
      isValid = isValid && true;
    }

    if (isValid) {
      const response = await fetchApi('/auth/register', {
        method: 'POST',
        body: {
          name,
          email,
          username,
          password,
          confirmPassword,
        },
        headers: {
          accept: 'application/json',
        },
      });

      if (response.success) {
        router.replace('/login');
      } else if (!response.success) {
        if (response.type === VALIDATION_ERR) {
          if (response.message === NAME_ALPHANUMERIC_ERR_MSG) {
            setErrorMessage('name', response.message);
          } else if (response.message === USERNAME_REGEX_ERR_MSG) {
            setErrorMessage('username', response.message);
          }
        } else if (response.type === EXIST_DATA_ERR) {
          if (response.message === EMAIL_EXIST_ERR_MSG) {
            setErrorMessage('email', response.message);
          } else if (response.message === USERNAME_EXIST_ERR_MSG) {
            setErrorMessage('username', response.message);
          }
        } else {
          setErrorMessage('register', 'Something when wrong, try again!');
        }
      }
    }
  };

  return (
    <form className="flex justify-center" onSubmit={(e) => handleRegister(e)} noValidate>
      <Card width="w-full lg:w-6/12" padding="p-5 lg:p-8" gap="gap-10">
        <Title>Register</Title>

        <div className="flex flex-col gap-4">
          <LabelInput
            label="Name"
            id="name"
            required
            placeholder="Name"
            value={name}
            errorMessage={error.name}
            onChange={(e) => setName(e.target.value)}
          />
          <LabelInput
            label="Email"
            id="email"
            required
            placeholder="Email"
            type="email"
            value={email}
            errorMessage={error.email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <LabelInput
            label="Username"
            id="username"
            required
            placeholder="Username"
            value={username}
            errorMessage={error.username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <LabelInput
            label="Password"
            id="password"
            required
            placeholder="Password"
            type="password"
            value={password}
            errorMessage={error.password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <LabelInput
            label="Confirm Password"
            id="confirmPassword"
            required
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            errorMessage={error.confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          <Button type="submit" full>Register</Button>
          <div className="flex gap-1 text-sm">
            <p>Have an account?</p>
            <Link href="/login">
              <a className="text-ev-blue">Login here</a>
            </Link>
          </div>
        </div>
      </Card>
    </form>
  );
}
