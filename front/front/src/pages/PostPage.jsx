import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { getCommentsByPost, createComment, updateComment, deleteComment } from "../services/commentsService";
import { getPostsByTopic } from "../services/postsService";

const PostContainer = styled.main`
  margin-top: 3rem;
  text-align: center;

  h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: white;
  }

  p {
    color: #ccc;
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }

  .comment-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 500px;
    margin: 0 auto 2rem;

    textarea {
      width: 100%;
      height: 80px;
      padding: 0.75rem;
      background-color: #333;
      border: 1px solid #555;
      color: white;
      border-radius: 5px;
      resize: none;
    }

    button {
      padding: 0.5rem 1rem;
      background-color: #28a745;
      border: none;
      border-radius: 5px;
      color: white;
      cursor: pointer;

      &:hover {
        background-color: #218838;
      }
    }
  }

  .comments-list {
    list-style: none;
    padding: 0;

    li {
      background-color: #1f1f1f;
      padding: 1rem;
      margin: 1rem auto;
      border-radius: 5px;
      max-width: 500px;
      text-align: left;

      p {
        color: #ccc;
        margin: 0;
      }

      .buttons {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 0.5rem;

        button {
          padding: 0.3rem 0.75rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;

          &.edit {
            background-color: #ffc107;
            color: white;

            &:hover {
              background-color: #e0a800;
            }
          }

          &.delete {
            background-color: #dc3545;
            color: white;

            &:hover {
              background-color: #c82333;
            }
          }
        }
      }
    }
  }
`;

export default function PostPage() {
    const { topicId, postId } = useParams();
    const [post, setPost] = useState({ title: "", body: "" });
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingComment, setEditingComment] = useState(null);

    // Fetch post and comments
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch the specific post
                const posts = await getPostsByTopic(topicId);
                const currentPost = posts.$values.find((p) => p.id === parseInt(postId));
                setPost(currentPost || {});

                // Fetch comments for the post
                const commentData = await getCommentsByPost(topicId, postId);
                setComments(commentData.$values || []);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, [topicId, postId]);

    // Create new comment
    const handleCreateComment = async () => {
        if (!newComment.trim()) return;

        try {
            const created = await createComment(topicId, postId, { content: newComment }); // Use 'content' here
            setComments([...comments, created]);
            setNewComment("");
        } catch (err) {
            console.error("Error creating comment:", err);
        }
    };

    // Update comment
    const handleUpdateComment = async (commentId) => {
        try {
            const updated = await updateComment(topicId, postId, commentId, { content: editingComment.content });
            setComments(comments.map((c) => (c.id === commentId ? updated : c)));
            setEditingComment(null);
        } catch (err) {
            console.error("Error updating comment:", err);
        }
    };

    // Delete comment
    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(topicId, postId, commentId);
            setComments(comments.filter((c) => c.id !== commentId));
        } catch (err) {
            console.error("Error deleting comment:", err);
        }
    };

    return (
        <PostContainer>
            <h2>{post.title}</h2>
            <p>{post.body}</p>

            {/* Add Comment */}
            <div className="comment-form">
                <textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button onClick={handleCreateComment}>Add Comment</button>
            </div>

            {/* Comments List */}
            <ul className="comments-list">
                {comments.map((comment) => (
                    <li key={comment.id}>
                        {editingComment?.id === comment.id ? (
                            <>
                                <textarea
                                    value={editingComment.content}
                                    onChange={(e) =>
                                        setEditingComment({ ...editingComment, content: e.target.value })
                                    }
                                ></textarea>
                                <div className="buttons">
                                    <button className="edit" onClick={() => handleUpdateComment(comment.id)}>
                                        Save
                                    </button>
                                    <button className="delete" onClick={() => setEditingComment(null)}>
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p>{comment.content}</p>
                                <div className="buttons">
                                    <button
                                        className="edit"
                                        onClick={() => setEditingComment({ id: comment.id, content: comment.content })}
                                    >
                                        Edit
                                    </button>
                                    <button className="delete" onClick={() => handleDeleteComment(comment.id)}>
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </PostContainer>
    );
}