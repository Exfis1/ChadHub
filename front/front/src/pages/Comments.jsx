import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const CommentsContainer = styled.div`
  padding: 2rem;

  ul {
    list-style-type: none;
    padding: 0;

    li {
      margin: 1rem 0;
      padding: 1rem;
      border: 1px solid #ccc;
      border-radius: 5px;
      background: #fff;
    }
  }

  form {
    margin-top: 2rem;

    input, textarea {
      width: 100%;
      margin-bottom: 1rem;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      background-color: #007bff;
      color: white;
      border-radius: 5px;
      cursor: pointer;

      &:hover {
        background-color: #0056b3;
      }
    }
  }
`;

export default function Comments() {
    const { topicId, postId } = useParams();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        fetch(`http://localhost:5000/api/v1/topics/${topicId}/posts/${postId}/comments`)
            .then((res) => res.json())
            .then((data) => setComments(data))
            .catch((err) => console.error(err));
    }, [topicId, postId]);

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:5000/api/v1/topics/${topicId}/posts/${postId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: newComment }),
        })
            .then((res) => res.json())
            .then((comment) => setComments((prev) => [...prev, comment]))
            .catch((err) => console.error(err));

        setNewComment("");
    };

    return (
        <CommentsContainer>
            <h2>Comments</h2>
            <ul>
                {comments.map((comment) => (
                    <li key={comment.id}>
                        <p>{comment.content}</p>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleCommentSubmit}>
                <textarea
                    rows="3"
                    placeholder="Add a comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button type="submit">Submit Comment</button>
            </form>
        </CommentsContainer>
    );
}