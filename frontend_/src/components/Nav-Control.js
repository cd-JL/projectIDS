import React from 'react';
import { Link } from 'react-router-dom'; 
export default function NavControl() {
  return (
    <div>
      <div className='nav-control'>
        <ul> 
          <li>
            <Link to="/sensor1">Sensor 1</Link> </li>
          <li>
            <Link to="/sensor2">Sensor 2</Link> 
          </li>
          <li>
            <Link to="/sensor3">Sensor 3</Link> </li>
        </ul>
      </div>
    </div>
  );
}
