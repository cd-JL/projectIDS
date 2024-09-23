import React from 'react'


export default function NavBar() {
  return (
    <div>
      <div className='nav-banner'>
      <img src={require('../public/image-removebg-preview (1).png')} alt="LOGO" className='nav-logo' />

      </div>
      <div className='nav-control'>
        <list>
            <li>Page1</li>
            <li>Page2</li>
            <li>Page3</li>
        </list>
      </div>
    </div>
  )
}
