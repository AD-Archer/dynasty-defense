import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs"; // Import bcrypt
import "./styles/homepage.css";
import "./styles/settingspage.css";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [newUserName, setNewUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const loadUserData = () => {
      const storedUserData = localStorage.getItem("currentUser");
      return storedUserData ? JSON.parse(storedUserData) : null;
    };

    const loadUsers = () => {
      const storedUsers = localStorage.getItem("users");
      if (storedUsers) {
        const usersObj = JSON.parse(storedUsers);
        return Object.values(usersObj); // Convert object to an array of users
      }
      return [];
    };

    const userData = loadUserData();
    if (!userData) {
      navigate("/"); // Redirect if no user data is found
    } else {
      setUser(userData);
    }

    const loadedUsers = loadUsers();

    // Check for users named "admin" and retain only one
    const adminCount = loadedUsers.filter(
      (u) => u.username.toLowerCase() === "admin"
    ).length;
    if (adminCount > 1) {
      const filteredUsers = loadedUsers.filter(
        (u) => u.username.toLowerCase() !== "admin"
      ); // Keep all non-"admin" users
      const adminUser = loadedUsers.find(
        (u) => u.username.toLowerCase() === "admin"
      ); // Keep one "admin" user
      const updatedUsers = adminUser
        ? [...filteredUsers, adminUser]
        : filteredUsers;

      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    } else {
      setUsers(loadedUsers);
    }
  }, [navigate]);

  const notifyNonAdmin = () => {
    alert("Only admins can change settings.");
  };


  const handleEditUser = (username) => {
    if (!user || !user.isAdmin) {
      notifyNonAdmin();
      return;
    }

    if (username === "admin") {
      alert("You cannot edit the default admin account.");
      return;
    }

    const userToEdit = users.find((user) => user.username === username);
    setEditingUser(userToEdit);
    setNewUserName(userToEdit?.username || "");
    setNewPassword(userToEdit?.password || "");
  };

  const passwordRequirements = {
    length: (password) => password.length >= 16,
    uppercase: (password) => /[A-Z]/.test(password),
    lowercase: (password) => /[a-z]/.test(password),
    number: (password) => /[0-9]/.test(password),
    specialChar: (password) => /[!@#$%^&*]/.test(password),
  };

  const validatePassword = (password) => {
    return (
      passwordRequirements.length(password) &&
      passwordRequirements.uppercase(password) &&
      passwordRequirements.lowercase(password) &&
      passwordRequirements.number(password) &&
      passwordRequirements.specialChar(password)
    );
  };

  const handleSaveUserEdit = async () => {
    if (!editingUser) return;

    if (user.isAdmin && newPassword !== editingUser.password) {
      const isValidPassword = validatePassword(newPassword);
      if (!isValidPassword) {
        const confirmChange = window.confirm(
          "The new password does not meet the requirements. Do you want to proceed anyway?"
        );
        if (!confirmChange) return; // If admin cancels, do not proceed
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password

    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) => {
        if (user.username === editingUser.username) {
          return { ...user, username: newUserName, password: hashedPassword }; // Use hashed password
        }
        return user;
      });
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      return updatedUsers;
    });

    const updatedCurrentUser = {
      ...editingUser,
      username: newUserName,
      password: hashedPassword,
    };
    localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));

    setEditingUser(null);
    setNewUserName("");
    setNewPassword("");
  };

  const handleDeleteUser = (username) => {
    if (!user || !user.isAdmin) {
      notifyNonAdmin();
      return;
    }

    if (username === "admin") {
      alert("You cannot delete the default admin account.");
      return;
    }

    if (username === user.username) {
      alert("You cannot delete your own account.");
      return;
    }

    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.filter(
        (user) => user.username !== username
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  };

  const handleToggleAdmin = (username) => {
    if (!user || !user.isAdmin) {
      notifyNonAdmin();
      return;
    }

    if (username.toLowerCase() === "admin") {
      alert(
        "You cannot remove admin privileges from the default admin account."
      );
      return;
    }

    if (username === user.username) {
      alert("You cannot remove your own admin privileges.");
      return;
    }

    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) => {
        if (user.username.toLowerCase() === username.toLowerCase()) {
          return { ...user, isAdmin: !user.isAdmin }; // Toggle admin status
        }
        return user;
      });
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  };

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="home-container">
      <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <div className="active-user">
          {user ? <p>Welcome, {user.username}</p> : <p>Loading user...</p>}
        </div>
        <button className="sign-out-button" onClick={handleSignOut}>
          Sign Out
        </button>
        <Link to="/home">
          <button className="sidebar-button">Home</button>
        </Link>
        <Link to="/settings">
          <button className="sidebar-button">Sensors</button>
        </Link>
        <Link to="/AdminLog">
          <button className="sidebar-button">Logs</button>
        </Link>
        <Link to="/settings">
          <button className="sidebar-button">Settings</button>
        </Link>
      </aside>

      <main className="main-content">
        <h1 className="header-title">Settings</h1>

        

        <section className="users-section">
          <h2>Manage Users</h2>

          <div className="users-list">
            {users.length === 0 ? (
              <p>No users available.</p>
            ) : (
              users.map((user) => (
                <li className="user-item" key={user.username}>
                  <span>
                    {user.username} {user.isAdmin ? "(Admin)" : ""}
                  </span>
                  <div className="button-container">
                    <button
                      className="edit-user-button"
                      onClick={() => handleEditUser(user.username)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-user-button"
                      onClick={() => handleDeleteUser(user.username)}
                    >
                      Delete
                    </button>
                    <button
                      className="toggle-admin-button"
                      onClick={() => handleToggleAdmin(user.username)}
                    >
                      {user.isAdmin ? "Remove Admin" : "Make Admin"}
                    </button>
                  </div>
                  {editingUser?.username === user.username && (
                    <div className="edit-user-inputs">
                      <input
                        type="text"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                      />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button onClick={handleSaveUserEdit}>Save</button>
                    </div>
                  )}
                </li>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
