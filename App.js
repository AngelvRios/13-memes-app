import React, { useState, useEffect, createContext, useContext } from "react";
import { View, FlatList, ActivityIndicator, Button, Modal, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Contexto para autenticación
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await fetch("https://memes-api.grye.org/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
        },
        body: new URLSearchParams({ username, password }).toString(),
      });
      const data = await response.json();
      if (data.access_token) {
        setAuthToken(data.access_token);
        await AsyncStorage.setItem("token", data.access_token);
        return true;
      } else {
        console.error("Login failed", data);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (username, password, email) => {
    try {
      const response = await fetch("https://memes-api.grye.org/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
        },
        body: new URLSearchParams({ username, password, email }).toString(),
      });
      const data = await response.json();
      return data.success || false;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};

const App = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [modalImageVisible, setModalImageVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [modalLoginVisible, setModalLoginVisible] = useState(false);
  const [modalRegisterVisible, setModalRegisterVisible] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const { login, register } = useContext(AuthContext);

  const fetchMemes = async (page) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://memes-api.grye.org/memes/?page=${page}&limit=10`
      );
      const data = await response.json();

      if (data.length > 0) {
        setMemes((prev) => [...prev, ...data]);
      } else {
        setHasMore(false);
      }
      setLoading(false);
    } catch (error) {
      console.error("Fetch memes error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes(page);
  }, [page]);

  const loadMoreMemes = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const handleLogin = async () => {
    if (await login(username, password)) {
      setModalLoginVisible(false);
      alert("Login successful!");
    } else {
      alert("Login failed!");
    }
  };

  const handleRegister = async () => {
    if (await register(username, password, email)) {
      setModalRegisterVisible(false);
      alert("Registration successful!");
    } else {
      alert("Registration failed!");
    }
  };

  return (
    <AuthProvider>
      <View style={{ flex: 1 }}>
        <FlatList
          data={memes}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => { setSelectedImage(item.url); setModalImageVisible(true); }}>
              <Text style={styles.memeItem}>{item.filename}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.filename}
          onEndReached={loadMoreMemes}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? <ActivityIndicator size="large" /> : null
          }
        />
        {/* Modal para mostrar imagen */}
        <Modal visible={modalImageVisible} transparent>
          <View style={styles.modal}>
            <Text>{selectedImage}</Text>
            <Button title="Close" onPress={() => setModalImageVisible(false)} />
          </View>
        </Modal>
        {/* Modal para Login */}
        <Modal visible={modalLoginVisible} transparent>
          <View style={styles.modal}>
            <Text>Login</Text>
            <TextInput placeholder="Username" onChangeText={setUsername} style={styles.input} />
            <TextInput placeholder="Password" onChangeText={setPassword} style={styles.input} secureTextEntry />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Close" onPress={() => setModalLoginVisible(false)} />
          </View>
        </Modal>
        {/* Modal para Registro */}
        <Modal visible={modalRegisterVisible} transparent>
          <View style={styles.modal}>
            <Text>Register</Text>
            <TextInput placeholder="Username" onChangeText={setUsername} style={styles.input} />
            <TextInput placeholder="Password" onChangeText={setPassword} style={styles.input} secureTextEntry />
            <TextInput placeholder="Email" onChangeText={setEmail} style={styles.input} />
            <Button title="Register" onPress={handleRegister} />
            <Button title="Close" onPress={() => setModalRegisterVisible(false)} />
          </View>
        </Modal>
        <View style={{ flexDirection: "row", justifyContent: "space-around", margin: 10 }}>
          <Button title="Login" onPress={() => setModalLoginVisible(true)} />
          <Button title="Register" onPress={() => setModalRegisterVisible(true)} />
        </View>
      </View>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  input: {
    width: "80%",
    padding: 10,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  memeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

export default App;
