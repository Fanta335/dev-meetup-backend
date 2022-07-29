import axios from 'axios';

export const updateUserInAuth0 = async (
  token: string,
  userSubId: string,
  dataToUpdate: { [key: string]: string },
) => {
  const res = await axios.patch(
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
  console.log('management api res: ', res.data);
};
