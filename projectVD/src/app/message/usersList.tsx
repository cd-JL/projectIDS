import React, { useEffect, useState, useCallback } from 'react';
// Referenced ChatGPT in creating this component         

interface Message {
  sender: string;
}

function UsersList() {
  const [usersList, setUsersList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const userEmail = localStorage.getItem("userEmail");
  const selectedEmail = localStorage.getItem("selectedEmail");
  const [cound, setCound] = useState(0);
  const [loading, setLoading] = useState(false);
  const [unreadUsers, setUnreadUsers] = useState<Message[]>([]);

  const fetchUsersList = async (email) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/usersListForMessage?email=${email}`); // Fetch the list of users
      if (response.ok) {
        const data = await response.json();
        setUsersList(data || []);
        setFilteredUsers(data || []); // Initialize filtered users
        console.log(data, "data for message");
      } else {
        console.log("Failed to fetch the users data");
        setUsersList([]);
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error("ERROR FETCHING THE USERS LIST", error);
      setUsersList([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const searchUsrs = useCallback(
    (query) => {
      if (!query) {
        setFilteredUsers(usersList); // Reset to full list when query is empty
      } else {
        const filtered = usersList.filter((user) =>
          user.username.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredUsers(filtered);
      }
    },
    [usersList]
  );

  const unreadMessages = async () => {
    try {
      const response = await fetch(`http://localhost:8000/unreadMessages?email=${userEmail}`);
      if (response.ok) {
        const data = await response.json();
        setUnreadUsers(data);
        console.log(data, "unread messages");
        console.log(data.length, "total unread messages");
        localStorage.setItem("totalUnread", data.length);
        const x = data.length;
        const unreadMessageList = data.map((message) => message.sender);
        console.log(unreadMessageList);
        setCound(x);
      } else {
        console.log("Failed to fetch the unread messages");
      }
    } catch (error) {
      console.error("Error fetching the unread messages", error);
    }
  };

  const makeMessageRead = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/makeMessageRead?sender=${encodeURIComponent(
          selectedEmail
        )}&receiver=${encodeURIComponent(userEmail)}`
      );
      console.log("message read");
    } catch (error) {
      console.error("Error updating messages:", error);
    }
  };

  useEffect(() => {
    if (!userEmail) {
      window.location.href = "/auth/signin";
    } else {
      fetchUsersList(userEmail); // Run this once initially

      const intervalId = setInterval(() => {
        unreadMessages();
        makeMessageRead();
      }, 500); // Runs every 1 second (1000 milliseconds)

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [userEmail]);

  return (
    <div>
      {/* Sidebar */}
      <p className=' text-lg text-red-700'>Total unred message: {cound}</p>
      <h1 className="text-2xl font-semibold mb-4">People</h1>
      <input
        type="text"
        placeholder="Search"
        className="w-full p-2 bg-gray-700 text-white rounded-lg placeholder-gray-400"
        onChange={(e) => {
          const query = e.target.value;
          searchUsrs(query); // Call the search function
        }}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={`flex-1 overflow-y-auto`}>
          {/* Users list */}
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div
                key={index}
                className="flex  p-3 hover:bg-gray-700 rounded-lg cursor-pointer border-2 border-white my-2"
                onClick={() => {
                  localStorage.setItem("selectedUsername", user.username);
                  localStorage.setItem("selectedEmail", user.email);
                  window.location.href = "/message";
                }}
              >
                {user?.role === "admin" && (
                  <img
                    alt="Profile"
                    src="/images/user/admin.png"
                    className="rounded-full w-12 h-12"
                  />
                )}
                {user?.role === "view-only" && (
                  <img
                    alt="Profile"
                    src="/images/user/user.png"
                    className="rounded-full w-12 h-12"
                  />
                )}
                <div className="flex flex-col">
                  <p className="text-lg font-medium">{user.username}</p>
                  <p className="text-sm font-medium">{user.company}</p>
                  
                </div>
                <div className=' justify-end'>
                {unreadUsers?.map((message) => message.sender).includes(user.email) && <div className=' h-3 w-3 rounded-2xl bg-red float-right'></div>}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No users found</p>
          )}
        </div>
        
      )}
    </div>
  );
}

export default UsersList;
