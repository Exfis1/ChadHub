import apiClient from "./apiService";

export const getPostsByTopic = async (topicId) => {
	const response = await apiClient.get(`/topics/${topicId}/posts`);
	return response.data;
};

export const createPost = async (topicId, data) => {
	const response = await apiClient.post(`/topics/${topicId}/posts`, data);
	return response.data;
};

export const updatePost = async (topicId, postId, data) => {
	const response = await apiClient.put(`/topics/${topicId}/posts/${postId}`, data);
	return response.data;
};

export const deletePost = async (topicId, postId) => {
	const response = await apiClient.delete(`/topics/${topicId}/posts/${postId}`);
	return response.data;
};