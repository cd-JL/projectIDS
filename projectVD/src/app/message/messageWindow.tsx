import React, { useState } from 'react'
// Refernced chatGPT in creting this component
function MessageWindow() {
  const selectedUsername = localStorage.getItem("selectedUsername");
  const selectedEmail = localStorage.getItem("selectedEmail");
  const userEmail = localStorage.getItem("userEmail")
  const [message, setMesssage] = useState();

  const sendMessage = async (e: React.FormEvent)=>{
    e.preventDefault();
    const messageData = {userEmail, selectedEmail, message}
    try {
      const response = await fetch("http://localhost:8000/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData)
      })
      if(response.ok){
        console.log("Message send successfully.")
        setMesssage("")
      } 
    } catch{
      console.log("Unable to send the message")
    }
  }
  

  return (
    <>
      {/* Chat Window */}
      <div className="w-2/3 h-full flex flex-col">
        {selectedUsername && (
          <>
            {/* Header */}
            <div className="p-4 bg-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{selectedUsername}</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 bg-gray-900 overflow-y-auto space-y-4">
              <div className="p-2 rounded-lg w-full">
                <p className="text-lg text-gray-300 mb-1">received message</p>
                <p className="text-lg text-gray-300 mb-1 self-end text-right">sent message</p>
              </div>
            </div>

            {/* Input */}
              <form onSubmit={sendMessage}>
              <div className="p-4 bg-gray-800 flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  className="flex-1 p-2 bg-gray-700 text-white rounded-lg placeholder-gray-400"
                  onChange={(e)=> setMesssage(e.target.value)}
                />
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" type='submit'>
                  Send
                </button>
                </div>
              </form>
          </>
        )}
      </div>
    </>
  );
}

export default MessageWindow;
