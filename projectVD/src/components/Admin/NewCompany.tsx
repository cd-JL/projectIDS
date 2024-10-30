// Referenced ChatGPT in calling the API endpoint
import React, { useState } from 'react'

function NewCompany() {
    const [error, setError] = useState();
    const [message, setMessage] = useState(); 

    const addCompany = async ()=>{
        let Company = prompt("Enter the name of the company: ")?.trim()
        if (Company){
            console.log(Company)
            try{
                const response = await fetch("http://localhost:8000/newCompany",{
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({'name': Company}),
                });
                
                if(response.ok){
                    const result = await response.json();
                    console.log("Company created successfully.", result.message);
                    setMessage(result.message)
                }
                else{
                    const result = await response.json();
                    alert("Faild to add the company.")
                    setError(result.message)
                }
            }
            catch{
                alert("Error occured, please try again later.")
            }
        }
        else{
            alert("Need to enter the name of the Company.")
        }
    }

  return (
    <>
    <button onClick={addCompany}
    className="p-2 m-5 bg-blue-500 text-white rounded hover:bg-blue-600">
        Add a Company
    </button>
    <p>
        {error && <p className="text-red-600">{error}</p>}
        {message && <p className="text-green-600">{message}</p>}
    </p>
    </>
  )
}

export default NewCompany