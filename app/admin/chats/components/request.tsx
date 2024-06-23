import axios from 'axios';

const BASE_URL = 'https://rest-api-cookie-u-c-p.onrender.com/api';

export const getAllChatsForCharts = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/chat/charts`, {
      headers: {
        'x-access-token': token,
      },
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching chats and messages for charts:', error);
    throw error;
  }
};
