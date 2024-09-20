import axios from 'axios';

const FORTNITE_API_URL = 'https://fortniteapi.io/v2/shop';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;

export const getFortniteShop = async () => {
  try {
    const response = await axios.get(FORTNITE_API_URL, {
      headers: {
        Authorization: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Fortnite shop data:', error);
    return null;
  }
};
