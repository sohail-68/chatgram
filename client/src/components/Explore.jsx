import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useChatMessages } from "../context/AuthContext";

const UserSearch = () => {
  const { setMessages, messages, setSocket, socket } = useChatMessages();
console.log(messages,"mess");

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const naviagate=useNavigate()

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      axios
        .get(`http://localhost:5001/api/auth/search?q=${encodeURIComponent(query)}`, {
          headers: {
            Authorization: sessionStorage
.getItem("token"),

          },
        })
        .then((res) => setResults(res.data))
        .catch((err) => console.error(err));
    }, 300);

    setTypingTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          {results.map((user) => (
            <div
              key={user._id}
              className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4 hover:shadow-lg transition"
            >
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"  onClick={()=>naviagate(`/userprofile/${user._id}`)}>
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <p className="text-lg font-semibold text-gray-800">{user.username}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
          ))}

          {query && results.length === 0 && (
            <p className="text-center text-gray-500">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
