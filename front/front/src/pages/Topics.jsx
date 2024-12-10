import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getTopics } from "../services/topicsService";

const TopicsContainer = styled.main`
margin-top: 3rem;
    width: 100%;
    text-align: center;

    ul {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 0;

        @media (max-width: 768px) {
            li {
                padding: 0.5rem;
                a {
                    font-size: 1rem;
                }
                p {
                    font-size: 0.8rem;
                }
            }
        }
    }

  h2 {
    font-size: 3rem;
    margin-bottom: 2rem;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin: 1rem 0;
      background-color: #1f1f1f;
      padding: 1rem;
      border-radius: 8px;
      width: 100%;
      max-width: 600px;
      text-align: left;

      a {
        font-size: 1.5rem;
        color: #00aced;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }

      p {
        margin: 0.5rem 0 0;
        color: #ccc;
      }
    }
  }

  .loader {
    font-size: 1.5rem;
    color: #ccc;
  }

  .error {
    font-size: 1.2rem;
    color: red;
  }
`;

export default function Topics() {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const data = await getTopics();
                console.log("Fetched Topics Data:", data); // Debugging API response
                setTopics(data || []); // Ensure we always set an array
            } catch (err) {
                console.error("Error fetching topics:", err);
                setError("Failed to fetch topics. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, []);

    return (
        <TopicsContainer>
            <h2>Topics</h2>
            {loading && <div className="loader">Loading topics...</div>}
            {error && <div className="error">{error}</div>}
            {!loading && !error && (
                <ul>
                    {topics.map((topic) => (
                        <li key={topic.id}>
                            <Link to={`/topics/${topic.id}`}>{topic.title}</Link>
                            <p>{topic.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </TopicsContainer>
    );
}