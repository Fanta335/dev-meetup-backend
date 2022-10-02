import axios from 'axios';

export const deleteUserInAuth0 = async (token: string, userSubId: string) => {
  const res = await axios.delete(
    `${process.env.AUTH0_DOMAIN_URL}api/v2/users/${userSubId}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );
  console.log('res ', res.data);
};
