import axios from "axios";

const deleteMessage = async (
  messageId: string,
  chatId: string,
  token: string
): Promise<void> => {
  try {
    await axios.delete(
      `https://rest-api-cookie-u-c.onrender.com/api/chat/messages/${chatId}/messages/${messageId}`,
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    console.log("Delete message sucess")
  } catch (error) {
    console.error("Failed to delete message:", error);
    throw error;
  }
};

export default deleteMessage;
