import apiClient from "./apiService";

export const getCommentsByPost = async (topicId, postId) => {
	const response = await apiClient.get(`/topics/${topicId}/posts/${postId}/comments`);
	return response.data;
};

export const createComment = async (topicId, postId, data) => {
	const response = await apiClient.post(`/topics/${topicId}/posts/${postId}/comments`, data);
	return response.data;
};

export const updateComment = async (topicId, postId, commentId, data) => {
	const response = await apiClient.put(`/topics/${topicId}/posts/${postId}/comments/${commentId}`, data);
	return response.data;
};

export const deleteComment = async (topicId, postId, commentId) => {
	const response = await apiClient.delete(`/topics/${topicId}/posts/${postId}/comments/${commentId}`);
	return response.data;
};