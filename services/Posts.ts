import axios from "axios";

const API_URI = "https://rest-api-cookie-u-c.onrender.com/api/posts";

import { UserWithPosts } from "@/types/Post";

function logFormData(formData: any): any {
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
}

/**
 * Obtiene todas las publicaciones.
 * @returns {Promise<Object[]>} - La lista de publicaciones.
 */
export const getAllPosts = async () => {
  try {
    const response = await axios.get(API_URI);
    return response.data;
  } catch (error) {
    console.error("Error fetching all posts:", error);
    throw error;
  }
};

/**
 * Obtiene una publicación por su ID.
 * @param {string} id - El ID de la publicación.
 * @returns {Promise<Object>} - La publicación solicitada.
 */
export const getPostById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URI}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post with id ${id}:`, error);
    throw error;
  }
};

/**
 * Crea una nueva publicación.
 * @param {string} content - El contenido de la publicación.
 * @param {File|null} [imageFile=null] - El archivo de imagen (opcional).
 * @param {string} [token] - El token de autenticación (opcional).
 * @returns {Promise<Object>} - La publicación creada.
 */
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

/**
 * Elimina una publicación por su ID.
 * @param {string} id - El ID de la publicación.
 * @returns {Promise<Object>} - La respuesta del servidor.
 */
export const deletePost = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URI}/${id}`, {
      headers: {
        "x-access-token": localStorage.getItem("token") || "",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting post with id ${id}:`, error);
    throw error;
  }
};

/**
 * Crea un comentario en un post específico.
 *
 * @param {string} postId - ID del post en el que se creará el comentario.
 * @param {string} content - Contenido del comentario.
 * @param {File | undefined} image - Archivo de imagen (opcional).
 * @param {string} emoji - Emoji seleccionado (opcional).
 * @returns {Promise<any>} - Respuesta de la API.
 * @throws {Error} - Lanza un error si la creación del comentario falla.
 */
export const createComment = async (
  postId: string,
  content: string,
  emoji?: string,
  image?: File
) => {
  try {
    const formData = new FormData();
    formData.append("content", content);
    formData.append("emoji", emoji ? emoji : "none");

    if (image) {
      formData.append("image", image); // Añadir la imagen si está disponible
    }

    const data = logFormData(formData);
    console.log(data);

    const response = await axios.post(
      `${API_URI}/${postId}/comments`,
      formData,
      {
        headers: {
          "x-access-token": localStorage.getItem("token") || "",
          "Content-Type": "multipart/form-data", // Especificar multipart/form-data
        },
      }
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};
/**
 * Obtiene todos los comentarios de una publicación.
 * @param {string} postId - El ID de la publicación.
 * @returns {Promise<Object[]>} - La lista de comentarios.
 */
export const getAllComments = async (postId: string) => {
  try {
    const response = await axios.get(`${API_URI}/${postId}/comments`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    throw error;
  }
};

/**
 * Elimina un comentario por su ID.
 * @param {string} postId - El ID de la publicación.
 * @param {string} id - El ID del comentario.
 * @returns {Promise<Object>} - La respuesta del servidor.
 */
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

/**
 * Obtiene todos los likes de una publicación.
 * @param {string} postId - El ID de la publicación.
 * @returns {Promise<Object[]>} - La lista de likes.
 */
export const getAllLikes = async (postId: string) => {
  try {
    const response = await axios.get(`${API_URI}/${postId}/likes`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching likes for post ${postId}:`, error);
    throw error;
  }
};

/**
 * Crea un nuevo like en una publicación.
 * @param {string} postId - El ID de la publicación.
 * @returns {Promise<Object>} - La respuesta del servidor.
 */
export const createLike = async (postId: string) => {
  try {
    const token = localStorage.getItem("token") || "";
    const response = await axios.post(`${API_URI}/${postId}/likes`, null, {
      headers: {
        "x-access-token": token,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error creating like for post ${postId}:`, error);
    throw error;
  }
};

/**
 * Elimina un like en una publicación.
 * @param {string} postId - El ID de la publicación.
 * @param {string} id - El ID del like.
 * @returns {Promise<Object>} - La respuesta del servidor.
 */
export const deleteLike = async (postId: string, id: string) => {
  try {
    const token = localStorage.getItem("token") || "";
    const response = await axios.delete(`${API_URI}/${postId}/likes/${id}`, {
      headers: {
        "x-access-token": token,
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

/**
 * Guarda una publicación.
 * @param {string} postId - El ID de la publicación.
 * @returns {Promise<Object>} - La respuesta del servidor.
 */
export const savePost = async (postId: string) => {
  try {
    const token = localStorage.getItem("token") || "";
    const response = await axios.post(`${API_URI}/save/${postId}`, null, {
      headers: {
        "x-access-token": token,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error saving post ${postId}:`, error);
    throw error;
  }
};

/**
 * Elimina una publicación guardada.
 * @param {string} postId - El ID de la publicación.
 * @returns {Promise<Object>} - La respuesta del servidor.
 */
export const unsavePost = async (postId: string) => {
  try {
    const token = localStorage.getItem("token") || "";
    const response = await axios.delete(`${API_URI}/save/${postId}`, {
      headers: {
        "x-access-token": token,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error unsave post ${postId}:`, error);
    throw error;
  }
};

/**
 * Obtiene todas las publicaciones guardadas.
 * @returns {Promise<Object[]>} - La lista de publicaciones guardadas.
 */
export const getSavedPosts = async () => {
  try {
    const response = await axios.get(`${API_URI}/save`, {
      headers: {
        "x-access-token": localStorage.getItem("token") || "",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    throw error;
  }
};

/**
 * Obtiene las estadísticas de la plataforma.
 * @returns {Promise<Object>} - Las estadísticas de la plataforma.
 */
export const getStatsPlatform = async () => {
  try {
    const response = await axios.get(`${API_URI}/stats-platform`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stats platform:", error);
    throw error;
  }
};
/**
 * @method getAllUsersWithPosts
 * @description Obtiene todos los usuarios con sus publicaciones. Incluye detalles de la publicación como comentarios.
 * @returns {Promise<UserWithPosts[]>} - La lista de usuarios con sus publicaciones.
 **/

export const getAllUsersWithPosts = async (): Promise<UserWithPosts[]> => {
  try {
    const response = await axios.get(`${API_URI}/users-with-posts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users with posts:", error);
    throw error;
  }
};

/**
 * @method getRecommendedPosts
 * @description Obtiene publicaciones recomendadas basadas en likes, comentarios y si son creadas por amigos o personas que el usuario sigue.
 * @returns {Promise<Object[]>} - La lista de publicaciones recomendadas.
 */

export const getRecommendedPosts = async (): Promise<object[]> => {
  try {
    const response = await axios.get(`${API_URI}/recommended/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recommended posts:", error);
    throw error;
  }
};

/**
 * @method getPostAnalytics
 * @description Obtiene datos para generar gráficos específicos sobre los posts de un usuario.
 * @returns {Promise<Object[]>} - La lista de datos para generar gráficos.
 */

export const getPostAnalytics = async (userId: string): Promise<object[]> => {
  try {
    const response = await axios.get(`${API_URI}/analytics/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post analytics:", error);
    throw error;
  }
};

/**
 * @method reportPost
 * @description Reporta una publicación para que sea revisada por un administrador.
 * @returns {Promise<Object>} - La respuesta del servidor.
 */

export const reportPost = async (postId: string, reason: string) => {
  try {
    const token = localStorage.getItem("token") || "";
    const response = await axios.post(
      `${API_URI}/reports/${postId}`,
      { reason },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error reporting post ${postId}:`, error);
    throw error;
  }
};

/**
 * @method getPlatformAnalytics
 * @description Obtiene datos analíticos de toda la plataforma sobre las publicaciones.
 * @returns {Promise<Object>} - La respuesta del servidor.
 */

export const getPlatformAnalytics = async () => {
  try {
    const response = await axios.get(`${API_URI}/analytics`);
    return response.data;
  } catch (error) {
    console.error("Error fetching platform analytics:", error);
    throw error;
  }
};

/**
 * Reposte una publicación.
 * @param {string} postId - ID de la publicación que se va a repostear.
 * @param {string} [content] - Contenido adicional para el repost (opcional).
 * @returns {Promise<Object>} - La respuesta del servidor con el mensaje de éxito y el post repostado.
 */
export const repostPost = async (postId: string, content?: string) => {
  try {
    const token = localStorage.getItem("token") || "";

    const response = await axios.post(
      `${API_URI}/repost/${postId}`,
      { customContent: content },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error reposting post ${postId}:`, error);
    throw error;
  }
};

/**
 * Obtiene todas las publicaciones reportadas.
 * @returns {Promise<Object[]>} - La lista de publicaciones reportadas.
 * @throws {Error} - Si ocurre un error durante la solicitud.
 */
export const getReportedPosts = async () => {
  try {
    const response = await axios.get(`${API_URI}/reports`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reported posts:", error);
    throw error;
  }
};
