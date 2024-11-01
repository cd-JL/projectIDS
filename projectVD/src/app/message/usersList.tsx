import React from 'react'

function UsersList() {
  return (
    <div>
        {/* Sidebar */}
        <h1 className="text-2xl font-semibold mb-4">People</h1>
          <div className="flex-1 overflow-y-auto">
            {/* Users list */}
              <div
                className="flex items-center p-3 hover:bg-gray-700 rounded-lg cursor-pointer"
              >
                <img alt='Profile' src='image_source' className="rounded-full w-12 h-12"/>
                <div className="flex flex-col">
                  <p className="text-lg font-medium">Username</p>
                </div>
              </div>
          </div>
    </div>
  )
}

export default UsersList