import Title from '@components/Title';
import { useEffect, useState } from 'react';
import Input from '@components/Input';
import { fetchApi } from '@lib/fetchingData';
import ProfileSearch from '@components/ProfileSearch';
import uuid from 'react-uuid';

export default function SearchPage({ users }) {
  const [searchValue, setSearchValue] = useState('');
  const [usersFilter, setUsersFilter] = useState([]);

  useEffect(() => {
    let filterUsers = null;
    if (searchValue.length > 0) {
      filterUsers = users.filter((user) => new RegExp(searchValue, 'gi').test(user.username));
    } else {
      filterUsers = [];
    }

    setUsersFilter(filterUsers);
  }, [searchValue]);

  return (
    <>
      <Title>Search Account</Title>

      <div className="min-height">
        <div className="mt-6 sm:col-span-9 flex flex-col">
          <Input
            type="text"
            placeholder="Search by username"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            id="search_input"
          />
        </div>

        <div className="mt-6">
          {usersFilter.length === 0 && (
            <p className="text-ev-dark-gray text-lg">No filtered users</p>
          )}

          {usersFilter.length > 0 && (
            <div className="flex flex-col gap-5">
              {usersFilter.map((user) => (
                <ProfileSearch key={uuid()} data={user} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const response = await fetchApi('/users');

  return {
    props: {
      users: response.data.users,
    },
  };
}
