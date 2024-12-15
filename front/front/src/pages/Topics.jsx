import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getTopics, createTopic, updateTopic, deleteTopic } from "../services/topicsService";

const TopicsContainer = styled.main`
  margin-top: 3rem;
  width: 100%;
  text-align: center;

  h2 {
    font-size: 3rem;
    margin-bottom: 2rem;
    color: white;
  }

  .form-container {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;

    input,
    textarea {
      width: 200px;
      padding: 0.75rem;
      border: 1px solid #555;
      border-radius: 5px;
      background-color: #333;
      color: white;
      font-size: 1rem;
    }

    textarea {
      resize: none;
      height: 50px;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 5px;
      background-color: #007bff;
      color: white;
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background-color: #0056b3;
      }
    }
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin: 1rem auto;
      background-color: #1f1f1f;
      padding: 1.5rem;
      border-radius: 8px;
      max-width: 500px;
      text-align: left;

      h3 {
        margin: 0 0 1rem;
        color: #00aced;
      }

      p {
        margin-bottom: 1rem;
        color: #ccc;
      }

      .buttons {
        display: flex;
        gap: 1rem;

        button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 5px;
          color: white;
          cursor: pointer;
          transition: background 0.3s;
        }

        .edit {
          background-color: #ffc107;

          &:hover {
            background-color: #e0a800;
          }
        }

        .delete {
          background-color: #dc3545;

          &:hover {
            background-color: #c82333;
          }
        }
      }
    }
  }
`;

export default function Topics() {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newTopic, setNewTopic] = useState({ title: "", description: "" });
    const [editingTopic, setEditingTopic] = useState(null);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const data = await getTopics();
                setTopics(data || []);
            } catch (err) {
                setError("Failed to fetch topics.");
            } finally {
                setLoading(false);
            }
        };
        fetchTopics();
    }, []);

    const handleCreate = async () => {
        try {
            const created = await createTopic(newTopic);
            setTopics([...topics, created]);
            setNewTopic({ title: "", description: "" });
        } catch (err) {
            setError("Failed to create topic.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTopic(id);
            setTopics(topics.filter((t) => t.id !== id));
        } catch (err) {
            setError("Failed to delete topic.");
        }
    };

    const handleUpdate = async (id) => {
        try {
            const updated = await updateTopic(id, editingTopic);
            setTopics(topics.map((t) => (t.id === id ? updated : t)));
            setEditingTopic(null);
        } catch (err) {
            setError("Failed to update topic.");
        }
    };

    return (
        <TopicsContainer>
            <h2>Topics</h2>
            <div className="form-container">
                <input
                    type="text"
                    placeholder="Title"
                    value={newTopic.title}
                    onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                />
                <textarea
                    placeholder="Description"
                    value={newTopic.description}
                    onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                ></textarea>
                <button onClick={handleCreate}>Create Topic</button>
            </div>

            {error && <div style={{ color: "red" }}>{error}</div>}
            <ul>
                {topics.map((topic) => (
                    <li key={topic.id}>
                        <h3>{topic.title}</h3>
                        <p>{topic.description}</p>
                        <div className="buttons">
                            <button className="edit" onClick={() => setEditingTopic(topic)}>
                                Edit
                            </button>
                            <button className="delete" onClick={() => handleDelete(topic.id)}>
                                Delete
                            </button>
                        </div>
                        {editingTopic && editingTopic.id === topic.id && (
                            <div className="form-container">
                                <input
                                    type="text"
                                    value={editingTopic.title}
                                    onChange={(e) =>
                                        setEditingTopic({ ...editingTopic, title: e.target.value })
                                    }
                                />
                                <textarea
                                    value={editingTopic.description}
                                    onChange={(e) =>
                                        setEditingTopic({ ...editingTopic, description: e.target.value })
                                    }
                                ></textarea>
                                <button onClick={() => handleUpdate(topic.id)}>Save</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </TopicsContainer>
    );
}