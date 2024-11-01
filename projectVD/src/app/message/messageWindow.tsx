import React from 'react'

function MessageWindow() {
  return (
    <>
    {/* Chat Window */}
    <div className="w-2/3 h-full flex flex-col">
          {/* Header */}
          <div className="p-4 bg-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Username</h2>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 bg-gray-900 overflow-y-auto space-y-4">
              <div
                className="p-2 rounded-lg w-full "
              >
                <p className="text-lg text-gray-300 mb-1">received message</p>
                <p className="text-lg text-gray-300 mb-1 self-end text-right">sended messages2</p>
              </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-gray-800 flex items-center space-x-3">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 p-2 bg-gray-700 text-white rounded-lg placeholder-gray-400"
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
    </>
  )
}

export default MessageWindow