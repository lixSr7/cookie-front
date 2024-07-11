import axios from "axios";

const API_URI = "https://rest-api-cookie-u-c-p.onrender.com/api/posts";

export const getAllPosts = async () => {
  try {
    const response = await axios.get(API_URI);
    return response.data;
  } catch (error) {
    console.error("Error fetching all posts:", error);
    throw error;
  }
};

export const getPostById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URI}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post with id ${id}:`, error);
    throw error;
  }
};

export const createPost = async (
  content: string,
  imageFile?: File | null,
  token?: string
) => {
  const formData = new FormData();
  formData.append("content", content);
  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    const response = await axios.post(API_URI, formData, {
      headers: {
        "x-access-token": token,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const deletePost = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URI}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting post with id ${id}:`, error);
    throw error;
  }
};

export const createComment = async (
  postId: string,
  content: string,
  emoji?: string
) => {
  try {
    const commentData = {
      content,
      emoji: emoji ? emoji : "none",
    };
    // console.log(commentData);
    const response = await axios.post(
      `${API_URI}/${postId}/comments`,
      commentData,
      {
        headers: {
          "x-access-token": localStorage.getItem("token") || "",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const getAllComments = async (postId: string) => {
  try {
    const response = await axios.get(`${API_URI}/${postId}/comments`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    throw error;
  }
};

export const deleteComment = async (postId: string, id: string) => {
  try {
    const response = await axios.delete(`${API_URI}/${postId}/comments/${id}`, {
      headers: {
        "x-access-token": localStorage.getItem("token") || "",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error deleting comment with id ${id} for post ${postId}:`,
      error
    );
    throw error;
  }
};

export const getAllLikes = async (postId: string) => {
  try {
    const response = await axios.get(`${API_URI}/${postId}/likes`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching likes for post ${postId}:`, error);
    throw error;
  }
};

export const createLike = async (postId: string, user: any) => {
  try {
    const response = await axios.post(
      `${API_URI}/${postId}/likes`,
      {
        user: {
          name: user.fullname,
          nickName: user.username,
          image: user.image,
        },
      },
      {
        headers: {
          "x-access-token": localStorage.getItem("token") || "",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error creating like for post ${postId}:`, error);
    throw error;
  }
};

export const deleteLike = async (postId: string, id: string) => {
  try {
    const response = await axios.delete(`${API_URI}/${postId}/likes/${id}`, {
      headers: {
        "x-access-token": localStorage.getItem("token") || "",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error deleting like with id ${id} for post ${postId}:`,
      error
    );
    throw error;
  }
};
