import axios from "axios";
import { toast } from "sonner";

const API_URI = "https://cookie-rest-api-8fnl.onrender.com/api/posts";

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
