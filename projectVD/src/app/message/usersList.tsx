import React from 'react'

function UsersList() {
  return (
    <div>
        <div className="flex h-screen bg-white text-white">
        {/* Sidebar */}
        <div className="w-1/3 bg-gray-800 p-4 flex flex-col">
          <h1 className="text-2xl font-semibold mb-4">People</h1>
          <div className="flex-1 overflow-y-auto">
            {/* Users list */}
              <div
                className="flex items-center p-3 hover:bg-gray-700 rounded-lg cursor-pointer"
              >
                <img alt='Profile' src='image_source' className="rounded-full w-12 h-12"/>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">Username</p>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersList