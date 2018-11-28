import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import "./styles.css";

axios.defaults.withCredentials = true;

const { useState, useEffect } = React;


function App() {
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    const login = await axios.post("http://localhost:8000/api/login", {
      username: "test",
      password: "test"
    });
    const users = await axios.get("http://localhost:8000/api/users");
    setUsers(users.data);
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="App">
      <ol>
        {users.map(user => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ol>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
