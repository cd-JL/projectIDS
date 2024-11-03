import React, { useEffect, useState } from 'react'
// Refernced chatGPT in creting this component
function UsersList() {
  const [usersList, setUsersList] = useState();
  const userEmail = localStorage.getItem("userEmail");

  const fetchUsersList = async (email) => {
    try{
      const response = await fetch(`http://localhost:8000/usersListForMessage? email=${email}`) // Fetch the list of users
      if(response.ok){
        const data = await response.json()
        setUsersList(data)
        // console.log(usersList)
        console.log(data, "data for message")
      }
      else{
        console.log("Faild to fetch the users data")
      }
    }
    catch (error){
      console.error("ERROR FETCHING THE USERS LIST: ", error)
    }
  }

  useEffect(()=>{
   if (!userEmail){
    window.location.href = "/auth/signin"
   } 
   else{
    fetchUsersList(userEmail)
   }
  }, [userEmail]);


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
                  <p></p>
                </div>
              </div>
          </div>
    </div>
  )
}

export default UsersList