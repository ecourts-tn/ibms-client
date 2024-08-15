  import React from "react";
  import './header.css'
  
  const Sidebar = ({mode,setMode}) => {
    return (
        <ul className="list-group">
          <li className="list-group-item">Bail Petition
            <span class="badge badge-info badge-pill float-right">1</span>
          </li>
          <li className="list-group-item">Anticipatory Bail Petition
            <span class="badge badge-info badge-pill float-right">0</span>
          </li>
          <li className="list-group-item">Condition Relaxation
            <span class="badge badge-info badge-pill float-right">0</span>
          </li>
          <li className="list-group-item">Intervene Petition
            <span class="badge badge-info badge-pill float-right">0</span>
          </li>
          <li className="list-group-item">Modification Petition 
            <span class="badge badge-info badge-pill float-right">0</span>
          </li>
          <li className="list-group-item">Surety Petition
            <span class="badge badge-info badge-pill float-right">0</span>
          </li>
          <li className="list-group-item">Discharge of Surety
            <span class="badge badge-info badge-pill float-right">0</span>
          </li>
          <li className="list-group-item">Extension of Time
            <span class="badge badge-info badge-pill float-right">0</span>
          </li>
          <li className="list-group-item">Return of Passport 
            <span class="badge badge-info badge-pill float-right">0</span>
          </li>
          <li className="list-group-item">Return of Property 
            <span class="badge badge-info badge-pill float-right">0</span>
          </li>
        </ul>
    );
  };
  
  export default Sidebar;