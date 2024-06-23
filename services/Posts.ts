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
  user: any,
  content: string,
  imageFile?: File | null
) => {
  const formData = new FormData();
  formData.append("content", content);
  formData.append("userId", user.id);
  if (imageFile) {
    formData.append("image", imageFile);
  }

  let postData = {
    content: content,
  }

  try {
    const response = await axios.post(API_URI, postData, {
      headers: {
        "x-access-token": localStorage.getItem("token") || "",
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
  user: any,
  emoji?: string
) => {
  try {
    const response = await axios.post(
      `${API_URI}/${postId}/comments`,
      {
        content,
        emoji: emoji ? emoji : "none",
        user: {
          userId: user.id,
          name: user.username,
          nickName: user.fullname || user.username,
          image:
            user.image ||
            "https://www.los40.do/wp-content/uploads/2023/10/16880295953133-e1696339269651-300x300.jpeg",
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
    console.error(`Error deleting comment with id ${id} for post ${postId}:`, error);
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
    console.error(`Error deleting like with id ${id} for post ${postId}:`, error);
    throw error;
  }
};
