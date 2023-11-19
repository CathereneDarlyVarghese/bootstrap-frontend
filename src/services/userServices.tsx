// UserService.ts
import axios from 'axios';
import { User } from 'types';
// import { Auth } from 'aws-amplify';

// async function inviteUser(email: string, password: string) {
//   try {
//     const { user } = await Auth.signUp({
//       username: email,
//       password,
//       attributes: {
//         email, // optional
//         // other custom attributes
//       },
//     });
//     // user.sub contains the user's sub ID
//     // Save the sub ID for future use
//   } catch (error) {
//     console.error('error signing up:', error);
//   }
// }

export const getUsers = async (accessToken: string): Promise<User[]> => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/protected/user/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const getUserByEmail = async (
  accessToken: string,
  email: string,
): Promise<User> => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/protected/user/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      params: {
        email,
      },
    },
  );
  return response.data;
};

export const createUser = async (
  accessToken: string,
  _user: Partial<User>,
): Promise<User> => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/protected/user/`,
    _user,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const updateUser = async (
  accessToken: string,
  id: string,
  _user: User,
): Promise<User> => {
  const response = await axios.put(
    `${process.env.REACT_APP_BASE_URL}/protected/user/${id}`,
    _user,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const deleteUser = async (
  accessToken: string,
  id: string,
): Promise<void> => {
  await axios.delete(`${process.env.REACT_APP_BASE_URL}/protected/user/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
};
