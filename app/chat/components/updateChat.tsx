import axios from "axios";

const updateChat = async (
  chatId: string,
  data: { name?: string; addUsers?: string[]; removeUsers?: string[] },
  token: string
): Promise<void> => {
  try {
    const response = await axios.put(
      `https://rest-api-cookie-u-c.onrender.com/api/chat/${chatId}`,
      data,
      {
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Update chat success:", response.data);
  } catch (error) {
    console.error("Failed to update chat:", error);
    throw error;
  }
};

export default updateChat;
