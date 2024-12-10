import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";

const PostsContainer = styled.div`
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

      a {
        text-decoration: none;
        color: #333;
      }
    }
  }
`;

export default function Posts() {
    const { topicId } = useParams();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/api/v1/topics/${topicId}/posts`)
            .then((res) => res.json())
            .then((data) => setPosts(data))
            .catch((err) => console.error(err));
    }, [topicId]);

    return (
        <PostsContainer>
            <h2>Posts in Topic</h2>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <Link to={`/topics/${topicId}/posts/${post.id}`}>
                            <h3>{post.title}</h3>
                            <p>{post.body}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </PostsContainer>
    );
}