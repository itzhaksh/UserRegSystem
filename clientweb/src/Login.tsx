import React, { useState, ChangeEvent } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa6";
import Popup from "./Popup";
import axios, { AxiosResponse } from "axios";
import { IoLockClosedOutline } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import './cssStyle/Login.css';

const serverIp = "http://52.166.180.95:80"; 


interface LoginProps {
  setIsSignUp: (value: boolean) => void;
}

interface FormData {
  email: string;
  password: string;
}

interface PopupData {
  isOpen: boolean;
  title: string;
  message: string;
  color: string;
}

interface LoginResponse {
  sentence: string;
}

function Login({ setIsSignUp }: LoginProps): React.ReactNode {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [popupData, setPopupData] = useState<PopupData>({
    isOpen: false,
    title: "",
    message: "",
    color: "",
  });

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const showPopup = (
    message: string,
    title: string = "Notification",
    color: string = "blue-500"
  ): void => {
    setPopupData({
      isOpen: true,
      title,
      message,
      color,
    });
  };

  const togglePassword = (): void => {
    setShowPassword(!showPassword);
  };

  const isFormValid: boolean = Boolean(formData.email && formData.password);

  const send = async (): Promise<LoginResponse | void> => {
    console.log("formData:", formData);

    const data: FormData = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response: AxiosResponse<LoginResponse> = await axios.post(
        `${serverIp}/login`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Success:", response.data);
      showPopup(response.data.sentence, "Successfully connected", "green-300");
      return response.data;
    } catch (err: any) {
      console.error("Request failed:", err.response?.data || err.message);
      showPopup(
        "Something went wrong. Please check your credentials.",
        "Login Error",
        "#FF0000"
      );
    }
  };

  const closePopup = (): void => {
    setPopupData((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="login-container">
        <div className="login-spacer"></div>
      <h2 className="login-title">Log in</h2>

      <form className="login-form">
        <div className="input-container">
          <MdOutlineMailOutline className="input-icon" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="input-field"
          />
        </div>
        
        <div className="input-container">
          <IoLockClosedOutline className="input-icon" />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="input-field"
          />
          <button
            onClick={togglePassword}
            type="button"
            className="password-toggle"
          >
            {showPassword ? (
              <FaRegEyeSlash className="eye-icon" />
            ) : (
              <FaRegEye className="eye-icon" />
            )}
          </button>
        </div>

        <div className="forgot-password">
          <a href="#" className="forgot-password-link">
            Forgot password?
          </a>
        </div>
      </form>

      <button
        type="button"
        onClick={send}
        disabled={!isFormValid}
        className={`login-button ${!isFormValid ? 'login-button-disabled' : ''}`}
      >
        Log in
      </button>

      <div className="divider">
        <span className="divider-text">Or</span>
      </div>

      <div className="social-buttons">
        <button className="social-button">
          <FcGoogle className="social-icon google" />
          <span className="social-text">Google</span>
        </button>

        <button className="social-button">
          <FaFacebook className="social-icon facebook" />
          <span className="social-text">Facebook</span>
        </button>
      </div>

      <div className="register-section">
        <span className="register-text">Have no account yet?</span>
        <button
          onClick={() => setIsSignUp(true)}
          className="register-button"
        >
          Register
        </button>
      </div>

      <Popup
        isOpen={popupData.isOpen}
        onClose={closePopup}
        title={popupData.title}
        message={popupData.message}
        color={popupData.color}
      />
    </div>
  );
}

export default Login;