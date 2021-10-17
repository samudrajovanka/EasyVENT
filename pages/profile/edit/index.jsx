import Button from '@components/Button';
import LabelInput from '@components/LabelInput';
import LayoutEdit from '@components/LayoutEdit';
import { fetchApi } from '@lib/fetchingData';
import { getSession } from 'next-auth/client';
import Image from 'next/image';
import { useState } from 'react';

export default function EditPage({ user }) {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Clicked submit');
  };

  const handleConfirmEmail = async () => {
    console.log('Verif email click');
  };

  return (
    <LayoutEdit>
      <div className="flex justify-center items-center flex-col gap-1">
        <div className="relative w-20 lg:w-32 2xl:w-44 img-square-ratio rounded-full overflow-hidden">
          <Image
            src={user.avatar}
            layout="fill"
            loading="lazy"
            alt="profile_avatar"
          />
        </div>
        <p className="text-ev-blue">Change photo profile</p>
      </div>

      <form className="flex flex-col gap-6 mt-6" onSubmit={(e) => handleSubmit(e)}>
        <LabelInput
          label="Name"
          id="name"
          required
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex flex-col gap-2">
          <LabelInput
            label="Email"
            id="email"
            required
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <Button typeButton="secondary" onClick={handleConfirmEmail}>Confirm Email</Button>
          </div>
        </div>
        <LabelInput
          label="Username"
          id="username"
          required
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button type="submit">Update Profile</Button>
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

  const userResponse = await fetchApi(`/users/${session.user.name}`);

  return {
    props: {
      user: userResponse.data.user,
    },
  };
}
