import Button from '@components/Button';
import LabelInput from '@components/LabelInput';
import LayoutEdit from '@components/LayoutEdit';
import { getSession } from 'next-auth/client';
import { useState } from 'react';
import { fetchApi } from '@lib/fetchingData';
import { OLD_PASSWORD_ERR } from '@constants/errorType';
import { CONFIRM_PASSWORD_ERR_MSG } from '@constants/errorMessage';

export default function EditPasswordPage({ session }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const setErrorMessage = (field, message) => {
    setError((errorCurrent) => ({
      ...errorCurrent,
      [field]: message,
    }));
  };

  const validateFormm = () => {
    let isValid = true;

    if (oldPassword === '') {
      setErrorMessage('oldPassword', 'Password is required');
      isValid = false;
    } else {
      setErrorMessage('oldPassword', '');
      isValid = isValid && true;
    }

    if (newPassword === '') {
      setErrorMessage('newPassword', 'Password is required');
      isValid = false;
    } else if (newPassword.length < 8 || newPassword.length > 100) {
      setErrorMessage('newPassword', 'Password must be between 8 and 100 characters');
      isValid = false;
    } else {
      setErrorMessage('newPassword', '');
      isValid = isValid && true;
    }

    if (confirmNewPassword === '') {
      setErrorMessage('confirmNewPassword', 'Confirm password is required');
      isValid = false;
    } else if (confirmNewPassword !== newPassword) {
      setErrorMessage('confirmNewPassword', CONFIRM_PASSWORD_ERR_MSG);
      isValid = false;
    } else {
      setErrorMessage('confirmNewPassword', '');
      isValid = isValid && true;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateFormm();

    if (isValid) {
      const response = await fetchApi(`/users/${session.user.name}/password`, {
        method: 'PUT',
        body: {
          oldPassword,
          newPassword,
          confirmNewPassword,
        },
      });

      if (!response.success) {
        if (response.type === OLD_PASSWORD_ERR) {
          setErrorMessage('oldPassword', response.message);
        }
      } else {
        setErrorMessage('oldPassword', '');
        setErrorMessage('newPassword', '');
        setErrorMessage('confirmNewPassword', '');

        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    }
  };

  return (
    <LayoutEdit>
      <form className="flex flex-col gap-6" onSubmit={(e) => handleSubmit(e)} noValidate>
        <LabelInput
          label="Old Password"
          id="old_password"
          type="password"
          required
          placeholder="Your old password"
          value={oldPassword}
          errorMessage={error.oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <LabelInput
          label="New Password"
          id="new_password"
          type="password"
          required
          placeholder="New password"
          value={newPassword}
          errorMessage={error.newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <LabelInput
          label="Confirm New Password"
          id="new_password_confirm"
          type="password"
          required
          placeholder="Confirm new password"
          value={confirmNewPassword}
          errorMessage={error.confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        <Button type="submit">Change Password</Button>
      </form>
    </LayoutEdit>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
