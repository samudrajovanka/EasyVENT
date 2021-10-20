/* eslint-disable jsx-a11y/label-has-associated-control */
import Button from '@components/Button';
import LabelInput from '@components/LabelInput';
import LayoutEdit from '@components/LayoutEdit';
import { NAME_ALPHANUMERIC_ERR_MSG, USERNAME_REGEX_ERR_MSG } from '@constants/errorMessage';
import { fetchApi } from '@lib/fetchingData';
import { isAlphanumericWithSpace, isEmail, isUsername } from '@lib/typeChecking';
import { getSession } from 'next-auth/client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function EditPage({ user }) {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);
  const inputAvatarRef = useRef(null);
  const [disbledBtn, setDisbledBtn] = useState(true);
  const [error, setError] = useState({
    name: '',
    username: '',
    email: '',
  });

  const setErrorMessage = (field, message) => {
    setError((errorCurrent) => ({
      ...errorCurrent,
      [field]: message,
    }));
  };

  useEffect(() => {
    if (name !== user.name || username !== user.username
      || email !== user.email || avatar !== user.avatar) {
      setDisbledBtn(false);
    } else {
      setDisbledBtn(true);
    }
  }, [avatar, name, username, email]);

  const validateForm = () => {
    let isValid = true;

    if (name === '') {
      setErrorMessage('name', 'Name is required');
      isValid = false;
    } else if (!isAlphanumericWithSpace(name)) {
      setErrorMessage('name', NAME_ALPHANUMERIC_ERR_MSG);
      isValid = false;
    } else if (name.length < 3 || name.length > 20) {
      setErrorMessage('name', 'Name must be between 3 and 20 characters');
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
    } else if (username.length < 3 || username.length > 20) {
      setErrorMessage('username', 'Username must be between 3 and 20 characters');
      isValid = false;
    } else {
      setErrorMessage('username', '');
      isValid = isValid && true;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    console.log('Clicked submit');

    if (isValid) {
      let avatarBody = null;
      let isRemoveAvatar = false;
      if (!avatar.includes('https://avatars.dicebear.com')) {
        // eslint-disable-next-line prefer-destructuring
        avatarBody = inputAvatarRef.current.files[0];
      } else if (avatar !== user.avatar) {
        isRemoveAvatar = true;
      } else {
        avatarBody = undefined;
      }

      const response = await fetchApi(`/users/${user.username}?remove-avatar=${isRemoveAvatar}`, {
        method: 'PUT',
        headers: {
          'content-type': undefined,
        },
        body: {
          name,
          username,
          email,
          avatar: avatarBody,
        },
      });

      if (response.success) {
        console.log('Success');
      } else {
        console.log('Error');
      }
    }
  };

  const handleConfirmEmail = async () => {
    console.log('Verif email click');
  };

  const handleChangeAvatar = () => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(inputAvatarRef.current.files[0]);
  };

  const handleRemoveAvatar = () => {
    setAvatar(`https://avatars.dicebear.com/api/jdenticon/${user.username}.svg`);
    inputAvatarRef.current.value = '';
  };

  const handleCancelAvatar = () => {
    setAvatar(user.avatar);
    inputAvatarRef.current.value = '';
  };

  return (
    <LayoutEdit>
      <form className="flex flex-col gap-6" onSubmit={(e) => handleSubmit(e)} noValidate>
        <div className="flex justify-center items-center flex-col gap-1">
          <div className="relative w-20 lg:w-32 2xl:w-44 img-square-ratio rounded-full overflow-hidden">
            <Image
              src={avatar}
              layout="fill"
              loading="lazy"
              objectFit="cover"
              alt="profile_avatar"
            />
          </div>
          <div className="flex flex-col gap-1 mt-1">
            <label htmlFor="avatar" className="text-ev-blue cursor-pointer">Change photo profile</label>
            <input
              type="file"
              id="avatar"
              className="hidden"
              accept="image/png, image/jpeg, image/jpg"
              ref={inputAvatarRef}
              onChange={handleChangeAvatar}
            />

            {!avatar.includes('https://avatars.dicebear.com') && (
              <>
                <button className="text-ev-red" onClick={handleRemoveAvatar}>Remove avatar</button>

                {avatar !== user.avatar && (
                  <button className="text-yellow-400" onClick={handleCancelAvatar}>Cancel</button>
                )}
              </>
            )}
          </div>
        </div>

        <LabelInput
          label="Name"
          id="name"
          required
          placeholder="Your name"
          value={name}
          errorMessage={error.name}
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
            errorMessage={error.email}
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
          errorMessage={error.username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button type="submit" disabled={disbledBtn}>Update Profile</Button>
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
