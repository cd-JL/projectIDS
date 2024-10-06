// "use client"; 

// function Quote() {
//   const onSubmit = async (event) => { // asynchronous function triggered when the form is submitted
//     event.preventDefault();     // Prevents the default form submission behavior (page reload)
//     const formData = new FormData(event.target);    // Creates a FormData object from the form being submitted

//     formData.append("access_key", "61ad2905-8219-4dcb-a947-d6b07670870b"); // Your access key

//     const object = Object.fromEntries(formData);  // Converts the FormData into a plain object
//     const json = JSON.stringify(object);  // Converts the object to a JSON string format

//     try {
//       const res = await fetch("https://api.web3forms.com/submit", {  // Sends a POST request to the Web3Forms API using fetch
//         method: "POST", // method type for request
//         headers: {
//           "Content-Type": "application/json", // Indicates that the request body is in JSON format
//           Accept: "application/json",  // Specifies that the response should be in JSON format
//         },
//         body: json,
//       }).then((res) => res.json()); // Once the request is complete, the response is converted to JSON format

//       if (res.success) {
//         alert("Submission successful!"); // if submission is successful it will dsplay this in pop up
//         event.target.reset(); // Clear the form
//       } else {
//         alert("Submission failed. Please try again."); // if submission is unsuccessful it will dsplay this in pop up
//       }
//     } catch (error) {
//       alert("There was an error submitting the form."); // If an error occurs during the submission (network issues)
//     }
//   };

//     return (
//     <main className="flex flex-col justify-center items-center min-h-screen gap-10">
//     <div className="flex justify-center items-center w-full min-h-screen pt-20">
//       <div className="w-full max-w-xl bg-white p-10 shadow-md border border-black mt-20">
//         <h1 className="text-2xl text-black font-bold mb-8 flex justify-center">
//           Tell Us A Bit More About You
//         </h1>
//         <form onSubmit={onSubmit}>
//           <div className="form-group mb-8 flex items-center">
//             <label
//               htmlFor="firstname"
//               className="block text-black font-bold min-w-[150px] text-center"
//             >
//               First Name:
//             </label>
//             <input
//               type="text"
//               placeholder="What Is Your First Name?"
//               name="First Name"
//               className="block w-4/5 p-2 text-center border border-black text-sm mx-auto"
//               required
//             />
//           </div>

//           <div className="form-group mb-8 flex items-center">
//             <label
//               htmlFor="lastname"
//               className="block text-black font-bold min-w-[150px] text-center"
//             >
//               Last Name:
//             </label>
//             <input
//               type="text"
//               placeholder="What Is Your Last Name?"
//               name="Last Name"
//               className="block w-4/5 p-2 text-center border border-black text-sm mx-auto"
//               required
//             />
//           </div>

//           <div className="form-group mb-8 flex items-center">
//             <label
//               htmlFor="companyname"
//               className="block text-black font-bold min-w-[150px] text-center"
//             >
//               Company Name:
//             </label>
//             <input
//               type="text"
//               placeholder="What Company Do You Work For?"
//               name="Company Name"
//               className="block w-4/5 p-2 text-center border border-black text-sm mx-auto"
//               required
//             />
//           </div>

//           <div className="form-group mb-8 flex items-center">
//             <label
//               htmlFor="companyemail"
//               className="block text-black font-bold min-w-[150px] text-center"
//             >
//               Company Email:
//             </label>
//             <input
//               type="text"
//               placeholder="What's Your Company Email Address?"
//               name="Company Email"
//               className="block w-4/5 p-2 text-center border border-black text-sm mx-auto"
//               required
//             />
//           </div>

//           <div className="form-group mb-8 flex items-center">
//             <label
//               htmlFor="videodescription"
//               className="block text-black font-bold min-w-[150px] text-center"
//             >
//               Video Description:
//             </label>
//             <textarea
//               type="text"
//               placeholder="Describe Your Project..."
//               name="Video Description"
//               className="block w-4/5 p-2 text-center border border-black text-sm mx-auto"
//               required
//             />
//           </div>

//           <div className="form-group mb-8 flex items-center">
//             <label
//               htmlFor="estimatebudget"
//               className="block text-black font-bold min-w-[150px] text-center"
//             >
//               Estimate Budget:
//             </label>
//             <select
//               type="text"
//               name="Estimate Budget"
//               className="block w-4/5 p-2 text-center border border-black text-sm mx-auto"
//             >
//               <option value="price">
//                 What Is Your Estimate Project Budget?
//               </option>
//               <option value="$100-$200">$100-$200</option>
//               <option value="$200-$400">$200-$400</option>
//               <option value="$400-$600">$400-$600</option>
//               <option value="$600-$800">$600-$800</option>
//               <option value="$800 +">$800 +</option>
//             </select>
//           </div>

//           <button
//             type="submit"
//             className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-6 rounded-md mx-auto block w-2/5 border border-black text-lg"
//           >
//             Submit Form
//           </button>
//         </form>
//       </div>
//     </div>
//   </main>
//     );
//   }
  
//   export default Quote;
  
"use client"; 
import React from "react";

import Records from './docker_docker_desktop_4.33.1.json';
// import Records from 'scripts\vulnerabilities\microsoft_microsoft_edge_129.0.2792.79.json';

function Quote() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen gap-10">
      <div className="w-full max-w-4xl px-10">
        {
          // Ensure Records exists and has at least one element, and check if vulnerabilities exist
          Records?.[0]?.vulnerabilities?.length > 0 ? (
            Records[0].vulnerabilities.map((record, index) => {
              return (
                <div className="w-full bg-white p-10 shadow-md border border-black mt-20" key={index}>
                  {/* Display the CVE ID */}
                  <strong>{record?.cve?.id || "No ID available"}</strong>
                
                  {/* Flexbox container for side-by-side display */}
                  <div className="flex flex-row justify-between gap-10 w-full mt-5">
                    
                    {/* Descriptions */}
                    <div className="flex-1 bg-white p-5 shadow-md border border-black">
                      <h4 className="font-semibold">Descriptions:</h4>
                      {
                        record?.cve?.descriptions?.length > 0 ? (
                          record.cve.descriptions.map((description, descIndex) => {
                            return (
                              <p key={descIndex}>
                                {description.lang === "en" && description.value}
                              </p>
                            );
                          })
                        ) : (
                          <p>No descriptions available</p>
                        )
                      }
                    </div>

                    {/* References */}
                    <div className="flex-1 bg-white p-5 shadow-md border border-black">
                      <h4 className="font-semibold">References:</h4>
                      {
                        record?.cve?.references?.length > 0 ? (
                          record.cve.references.map((reference, refIndex) => {
                            return (
                              <p key={refIndex}>
                                <a href={reference.url} target="_blank" rel="noopener noreferrer">
                                  {reference.source}
                                </a>
                              </p>
                            );
                          })
                        ) : (
                          <p>No references available</p>
                        )
                      }
                    </div>

                  </div>
                </div>
              );
            })
          ) : (
            <p>No vulnerabilities available</p>
          )
        }
      </div>
    </main>
  );
}

export default Quote;
