import axios from 'axios';
import { DataToUpdate } from '../types';

export const updateUserInAuth0 = async (
  token: string,
  userSubId: string,
  dataToUpdate: DataToUpdate,
) => {
  await axios.patch(
    `${process.env.AUTH0_DOMAIN_URL}api/v2/users/${userSubId}`,
    dataToUpdate,
    {
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
        'cache-control': 'no-cache',
      },
    },
  );
};
