"use client";

import { useState } from "react";
import Review from "./review";


export default function TypeOfVideos({ title, src }) {

  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [review, setReview] = useState('')
  const [reviews, setReviews] = useState([])

  const controlExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded){
      setIsVisible(false)
    }
  };

  const controlVisibility = () => {
    setIsVisible(!isVisible);
  }

  const addReview = () => {
    setReviews([...reviews, review])
    console.log(reviews)
  }

  return (
    <div
      className={`flex flex-col items-center space-y-2 h-full w-full ${
        isExpanded ? 'fixed inset-0 z-50 m-5 backdrop-blur-sm' : 'relative'}`}>
      <video
        className={`object-cover cursor-pointer ${isExpanded ? 'w-4/5 h-auto' : 'w-96 h-full cursor-pointer'}`}
        controls
        muted
        onClick={controlExpand}
        src={src}
      />
      {isExpanded && isVisible && (
        <div className="bg-white opacity-70 h-96 w-96 absolute  z-50 p-2 overflow-y-auto">
          <h2 className=" text-xl font-bold">REVIEWS</h2>
          <div className="h-64 w-80 overflow-y-auto">
            {
              reviews.map((value)=>{
                return(
                  <p>{value}</p>
                )
              })
            }
          </div>
          <hr className=" h-0.5 border-black my-2 "/>
          <div className="flex justify-around">
            <div>
            <textarea value={review} onChange={(e)=>setReview(e.target.value) } className=" border-2 border-black" name="" id=""></textarea>
            </div>
            <div>
              <div>Rating</div>
              <div><button onClick={addReview}>&#9989;</button></div>
            </div>
          </div>
        </div>
      )}
      {!isExpanded && (
        <p className="text-center text-sm font-semibold">{title}</p>
      )}
      {isExpanded && (
        <Review onClick={controlVisibility}/>
      )}
    </div>
  );
}



export function ExamplesOfWork({title,description, src}){

  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const controlExpand = () =>{
    setIsExpanded(!isExpanded);
  }

  const controlVisibility = () => {
    setIsVisible(!isVisible);
  }

    return(
        <div className={`flex flex-col items-center space-y-2 h-full w-full cursor-pointer ${isExpanded ? 'fixed inset-0 z-40 m-5 cursor-pointer backdrop-blur-sm' : 'relative'}` }>
            <video
            className={`object-cover h-72 ${isExpanded ? 'w-4/5 h-auto' : 'w-96 h-full'}`}
            controls
            muted
            src={src}
            onClick={controlExpand}
            />
            {isExpanded && isVisible && (
                <div className="bg-white opacity-70 h-96 w-96 absolute  z-50 overflow-y-auto p-2">
                  <p>Reviews</p>
                </div>
            )}
            {!isExpanded && (
          <p className="text-center text-sm font-semibold">{title}</p>
            )}
            {!isExpanded && (
               <p className=" text-center text-sm">{description}</p>
            )}
            {isExpanded && (
              <Review onClick={controlVisibility}/>
            )}
        </div>
    )
}