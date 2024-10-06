import React from 'react'

export default function Review({onClick}) {
  return (
    <>
    <button onClick={onClick} type="button" className=" bg-orange-500 hover:bg-orange-400 text-white py-4 px-3 rounded-md block border border-black mt-16">
        REVIEWS
    </button>
    </>
  )
}