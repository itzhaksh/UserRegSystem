import React, { useState, ChangeEvent } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import axios, { AxiosResponse } from "axios";
import Popup from "./Popup";
import './cssStyle/SingUp.css';

const serverIp = "http://52.166.180.95:80";

interface SignUpProps {
  setIsSignUp: (value: boolean) => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface PopupData {
  isOpen: boolean;
  title: string;
  message: string;
  color: string;
}

interface SignUpResponse {
  sentence: string;
}

function SignUp({ setIsSignUp }: SignUpProps): React.ReactNode {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [popupData, setPopupData] = useState<PopupData>({
    isOpen: false,
    title: "",
    message: "",
    color: "",
  });

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const togglePassword = (): void => {
    setShowPassword(!showPassword);
  };

  const passwordsMatch: boolean = formData.password === formData.confirmPassword;

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

  const send = async (): Promise<SignUpResponse | void> => {
    const data = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    };

    try {
      const response: AxiosResponse<SignUpResponse> = await axios.post(
        `${serverIp}/register`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      showPopup(response.data.sentence, "User successfully registered", "green-300");
      return response.data;
    } catch (err) {
      console.error("Request failed:", axios.isAxiosError(err) ? err.response?.data : err);
      showPopup("An error occurred. Please try again.", "Error", "red-500");
    }
  };

  const allFieldsFilled: boolean = Boolean(
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.firstName &&
    formData.lastName
  );

  const isFormValid: boolean = allFieldsFilled && passwordsMatch;

  const closePopup = (): void => {
    setPopupData((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="signup-container">
      <div className="close-button-container">
        <button className="close-button" onClick={() => setIsSignUp(false)}>×</button>
      </div>

      <h2 className="signup-title">Sign Up</h2>
      
      <div className="form-container">
        <form className="signup-form">
          <div className="input-field">
            <input
              value={formData.firstName}
              name="firstName"
              type="text"
              placeholder="First Name"
              onChange={handleChange}
              className="text-input"
            />
          </div>
          
          <div className="input-field">
            <input
              value={formData.lastName}
              name="lastName"
              type="text"
              placeholder="Last Name"
              onChange={handleChange}
              className="text-input"
            />
          </div>
          
          <div className="input-field">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="text-input"
            />
          </div>

          <div className="input-field password-field">
            <input
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              className="text-input"
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

          <div className="input-field password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="text-input"
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
          
          <div className="password-message">
            {formData.password &&
              formData.confirmPassword &&
              !passwordsMatch && (
                <span className="password-error">
                  The passwords do not match
                </span>
              )}
          </div>
        </form>
      </div>
      
      <button
        type="submit"
        disabled={!isFormValid}
        onClick={send}
        className={`signup-button ${!isFormValid ? 'signup-button-disabled' : ''}`}
      >
        Sign Up
      </button>
      
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

export default SignUp;