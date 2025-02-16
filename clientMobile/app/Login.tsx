import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image
} from "react-native";
import Popup from "./Popup";
import icon from "./../assets/images/icon.png";
import { FcGoogle } from "react-icons/fc";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Fontisto from "@expo/vector-icons/Fontisto";
import Feather from "@expo/vector-icons/Feather";
import axios from "axios";

interface LoginProps {
  setIsSignUp: (isSignUp: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsSignUp }) => {
  const serverIp = "http://52.166.180.95:80"; // כתובת IP של השרת שלך
  const [showPassword, setShowPassword] = useState(false);
  const [popupData, setPopupData] = useState({
    isOpen: false,
    title: "",
    message: "",
    color: "",
  });
  const [toastMessage, setToastMessage] = useState(""); // מצב להודעת Toast
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const showPopup = (message: string, title: string = "Notification", color: string = "#3B82F6") => {
    setPopupData({
      isOpen: true,
      title: title,
      message: message,
      color: color,
    });
  };

  const handleChange = (fieldName: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const send = async () => {
    console.log("formData:", formData);

    const data = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await axios.post(`${serverIp}/login`, data, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Success:", response.data);
      //showPopup(response.data.sentence, "Successfully connected", "#22C55E");
      setToastMessage(response.data.sentence);  // שמירת ההודעה במצב
      showPopup(response.data.sentence, "Successfully connected", "#22C55E");
    } catch (err: any) {
      console.error("Request failed:", err.response?.data || err.message);
      showPopup(
        "Something went wrong. Please check your credentials.",
        "Login Error",
        "#FF0000"
      );
    }
  };

  const isFormValid = formData.email && formData.password;

  const closePopup = () => {
    setPopupData((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in</Text>
      <Image source={icon} style={styles.logo} />
      
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Fontisto name="email" size={20} color="#828282" />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={handleChange("email")}
          value={formData.email}
        />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Feather name="lock" size={20} color="#666" />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          onChangeText={handleChange("password")}
          value={formData.password}
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={togglePassword}>
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={!isFormValid}
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        onPress={send}
      >
        <Text
          style={[styles.buttonText, !isFormValid && styles.buttonTextDisabled]}
        >
          Log in
        </Text>
      </TouchableOpacity>

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.socialButton}>
          <FcGoogle size={20} />
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome5 name="facebook" size={20} color="#1877F2" />
          <Text style={styles.socialText}>Facebook</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Have no account yet?</Text>
      </View>

      <TouchableOpacity
        onPress={() => setIsSignUp(true)}
        style={styles.buttonWhite}
      >
        <Text style={styles.socialText}>Register</Text>
      </TouchableOpacity>
     {toastMessage ? <Text>{toastMessage}</Text> : null}
      <Popup
        isOpen={popupData.isOpen}
        onClose={closePopup}
        title={popupData.title}
        message={popupData.message}
        color={popupData.color}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 20,
     alignItems: "center",
      width: "100%",
      display: 'flex',
      flexDirection: 'column' 
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#D1D5DB",
      borderRadius: 8,
      backgroundColor: "#F9FAFB",
      width: "100%",
      marginBottom: 15,
      height: 44,
    },
    
    iconContainer: {
      paddingHorizontal: 12,
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    },
    logo: {    
      position: "absolute",
      margin: 10,
      top: -40, 
      width: 49.23,
      height: 49,
       
    },
  title: {
    fontSize: 20, 
    fontWeight: "600", 
    textAlign: "center",
    top: 10,
    marginBottom: 30, 
    color: "#3949AB", 
    
  },
  titleHover: {
    width: 358,
    height: 40,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
  },
  
  eyeIcon: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    width: "100%",
    backgroundColor: "#F9FAFB",
    marginBottom: 10,  },
  inputPassword: {
     flex: 1, 
     paddingVertical: 12,
    },
  forgotPassword: {
    color: "#3949AB",
    width: "100%",
    marginBottom: 10,
    paddingLeft: 180,
    lineHeight: 16.8,
    marginLeft: 130,
    fontFamily: "Lato",
    fontSize: 14,
    fontWeight: "600",
  },

  buttonWhite: {
    flexDirection: "row",

    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3949AB",
    borderRadius: 40,
    padding: 10,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 5,
    width: "100%",
  },
  buttonText: { 
    color: "white", 
    fontWeight: "bold",
   },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  line: { flex: 1, 
    height: 1,
     backgroundColor: "#D1D5DB"
     },
  orText: {
     marginHorizontal: 10,
      color: "#666",
    },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3949AB",
    borderRadius: 40,
    padding: 10,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 5,
  },
  socialText: {
     marginLeft: 8,
      fontSize: 14,
       fontWeight: "bold",
        color: "#3949AB",
       
       
       },
  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    marginVertical: 15,
    backgroundColor: "#4F46E5",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    width: "100%",
  },
  buttonDisabled: {
    backgroundColor: "#A5B4FC",
  },

  buttonTextDisabled: {
    color: "#E0E7FF",
  },

  registerText: { 
    marginVertical: 15,
     color: "#666"
     },
  registerButton: {
     marginLeft: 5, 
     padding: 5 
    },
  registerButtonText: {
     color: "#4F46E5", 
     fontWeight: "bold",
     },
  icon: {
      marginRight: 10,
      marginLeft: 10,
      width: 20,
      height: 20,
      textAlign: "center",
  },
    emailIcon: {
        marginRight: 10,
        marginLeft: 10,
        width: 20,
        height: 20,
        textAlign: "center",
    },
  inputIcon: {
    flex: 1,
    paddingVertical: 12,
  },
});

export default Login;