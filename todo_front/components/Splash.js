import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Splash.css';

function Splash() {
    const navigate = useNavigate();
  
    React.useEffect(() => {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 2000); 
      return () => clearTimeout(timer);
    }, [navigate]);
  
    return (
      <div className="splash-container">
        <div className="speech-bubble">ToDo<br/>List</div>
      </div>
    );
  }
  
  export default Splash;