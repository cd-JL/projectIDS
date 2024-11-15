import React, { useEffect, useState } from 'react';

function MessageWindow() {
  const selectedUsername = localStorage.getItem("selectedUsername");
  const selectedEmail = localStorage.getItem("selectedEmail");
  const userEmail = localStorage.getItem("userEmail");
  const [message, setMesssage] = useState("");
  const [send, addSend] = useState(0);
  const [noMessage, setNoMessage] = useState(true);
  const [fetchedMessages, setFetchedMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendError, setSendError] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    setSendError(false);
    const messageData = { userEmail, selectedEmail, message };
    try {
      const response = await fetch("http://localhost:8000/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });
      if (response.ok) {
        setMesssage("");
        addSend(send + 1);
      } else {
        setSendError(true);
      }
    } catch {
      setSendError(true);
    }
  };

  const getMessages = async () => {
    setLoading(true);
    const messageData = { userEmail, selectedEmail };
    try {
      const response = await fetch("http://localhost:8000/getMessages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });
      if (response.ok) {
        const messages = await response.json();
        setFetchedMessages(messages);
        setNoMessage(messages.length === 0);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMessages();
  }, [send]);

  return (
    <div className="w-2/3 h-full flex flex-col">
      {selectedUsername && (
        <>
          <div className="p-4 bg-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{selectedUsername}</h2>
          </div>
          {loading ? (
            <div className="p-4 text-gray-300">Loading messages...</div>
          ) : noMessage ? (
            <div className="flex-1 p-4 bg-gray-900 overflow-y-auto">
              <p className="text-lg text-gray-300">No Messages Yet</p>
            </div>
          ) : (
            <div className="flex-1 p-4 bg-gray-900 overflow-y-auto space-y-4">
              {fetchedMessages.map((msg, index) => (
                <div key={index} className="p-2 rounded-lg bg-gray-800 w-full">
                  <p className="text-lg text-gray-300 mb-1">
                    {msg.sender === userEmail ? "You" : "Received"}
                  </p>
                  <p className="text-lg text-gray-300">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
          {sendError && (
            <p className="p-4 text-red-500">Failed to send the message. Please try again.</p>
          )}
          <form onSubmit={sendMessage}>
            <div className="p-4 bg-gray-800 flex items-center space-x-3">
              <input
                required
                type="text"
                placeholder="Enter your message"
                value={message}
                className="flex-1 p-2 bg-gray-700 text-white rounded-lg placeholder-gray-400"
                onChange={(e) => setMesssage(e.target.value.replace(/^\s+/, ""))}
              />
              <button
                className={`px-4 py-2 text-white rounded-lg ${
                  message
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-500 cursor-not-allowed"
                }`}
                type="submit"
                disabled={!message}
              >
                Send
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default MessageWindow;
