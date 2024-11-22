import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { loginUser } from "../services/auth";
import { MainStackParamList } from "../NavigationParamList";

type LoginScreenProps = {
  navigation: FrameNavigationProp<MainStackParamList, "Login">;
};

export function LoginScreen({ navigation }: LoginScreenProps) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError("");
      await loginUser({ username, password });
      navigation.navigate("Orders");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <flexboxLayout style={styles.container}>
      <label className="text-2xl mb-4 font-bold">Login</label>
      
      <textField
        style={styles.input}
        hint="Username"
        text={username}
        onTextChange={(e) => setUsername(e.value)}
      />

      <textField
        style={styles.input}
        hint="Password"
        secure={true}
        text={password}
        onTextChange={(e) => setPassword(e.value)}
      />

      {error ? <label style={styles.error}>{error}</label> : null}

      <button
        style={styles.button}
        onTap={handleLogin}
        isEnabled={!isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </flexboxLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  input: {
    fontSize: 18,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  button: {
    fontSize: 18,
    padding: 10,
    backgroundColor: "#2e6ddf",
    color: "white",
    borderRadius: 5,
    marginTop: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});