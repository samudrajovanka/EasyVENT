import Button from '@components/Button';
import LabelInput from '@components/LabelInput';
import LayoutEdit from '@components/LayoutEdit';
import { getSession } from 'next-auth/client';
import { useState } from 'react';

export default function EditPasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit clicked');
  };

  return (
    <LayoutEdit>
      <form className="flex flex-col gap-6" onSubmit={(e) => handleSubmit(e)}>
        <LabelInput
          label="Old Password"
          id="old_password"
          type="password"
          required
          placeholder="Your old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <LabelInput
          label="New Password"
          id="new_password"
          type="password"
          required
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <LabelInput
          label="Confirm New Password"
          id="new_password_confirm"
          type="password"
          required
          placeholder="Confirm new password"
          value={newPasswordConfirm}
          onChange={(e) => setNewPasswordConfirm(e.target.value)}
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
