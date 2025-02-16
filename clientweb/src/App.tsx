import React from "react";
import { useState } from "react";
import Login from "./Login";
import SignUp from "./SingUp";
import img from "./assets/IMG.png";
import icon from "./assets/icon.png";
import './App.css'
import 'normalize.css';

function App(): React.ReactNode {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [showContent, setShowContent] = useState(true); 

  const handleSignUpToggle = (value: boolean) => {
    setShowContent(false); 
    setTimeout(() => {
      setIsSignUp(value); 
      setShowContent(true);
    }, 200);
  };
  return (
    <div className="app-container">
      <div className="main-content">
        <div className="auth-container">
          {}
          <div className="left-section">
            <div className="icon-container">
              <img src={icon} alt="Icon" className="icon-image" width="50" height="50" />
            </div>
            <div className="welcome-image">
              <img
                src={img}
                alt="Welcome illustration"
              />
            </div>
            <h2 className="welcome-title">
              Welcome aboard my friend
            </h2>
            <p className="welcome-text">
              just a couple of clicks and we start
            </p>
          </div>

          <div className="right-section">
            {isSignUp ? (
              <SignUp setIsSignUp={setIsSignUp} />
            ) : (
              <Login setIsSignUp={setIsSignUp} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;