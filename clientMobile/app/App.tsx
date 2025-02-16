import React, { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import SignUp from "./SignUp";
import Login from "./Login";

export default function App() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <View style={styles.container}>
    <View style={styles.box}>
      <View style={styles.rightSection}>
        {isSignUp ? (
          <SignUp setIsSignUp={setIsSignUp} />
        ) : (
          <Login setIsSignUp={setIsSignUp} />
        )}
      </View>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    flexDirection: "row",
    borderRadius: 20,
    overflow: "hidden",
    width: "90%",
    maxWidth: 500,
    paddingTop: 10
  },
  rightSection: {
    flex: 1,
    padding: 20,
  },
});