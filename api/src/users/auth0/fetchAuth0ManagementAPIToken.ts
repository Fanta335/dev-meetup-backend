import axios from 'axios';

export const fetchAuth0ManegementAPIToken = async () => {
  const res = await axios.post(
    `${process.env.AUTH0_DOMAIN_URL}oauth/token`,
    {
      client_id: process.env.AUTH0_MANAGEMENT_API_CLIENT_ID,
      client_secret: process.env.AUTH0_MANAGEMENT_API_CLIENT_SECRET,
      audience: `${process.env.AUTH0_DOMAIN_URL}api/v2/`,
      grant_type: 'client_credentials',
    },
    { headers: { 'content-type': 'application/json' } },
  );
  return res.data.access_token as string;
};
