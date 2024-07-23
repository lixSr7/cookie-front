import axios from "axios";

const deleteMessage = async (
  messageId: string,
  chatId: string,
  token: string,
) => {
  try {
    const response = await axios.delete(
      `https://rest-api-cookie-u-c-p.onrender.com/api/chat/messages/${chatId}/messages/${messageId}`,
      {
        headers: {
          "x-access-token": token,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};

export default deleteMessage;
