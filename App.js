import { useState, useEffect } from "react";
import { View, FlatList, ActivityIndicator, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MemeItem from "./components/MemeItem";
import ImageModal from "./components/ImageModal";
import LoginModal from "./components/LoginModal";

const App = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [modalImageVisible, setModalImageVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [modalLoginVisible, setModalLoginVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const fetchMemes = async (page) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://memes-api.grye.org/memes/?page=${page}&limit=10`,
      );
      const data = await response.json();

      if (data.length > 0) {
        setMemes((prevMemes) => [...prevMemes, ...data]);
      } else {
        setHasMore(false);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes(page);
  }, [page]);

  const loadMoreMemes = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleImagePress = (imgUrl) => {
    setSelectedImage(imgUrl);
    setModalImageVisible(true);
  };

  const handleLoginPress = () => {
    setModalLoginVisible(true);
  };

  const handleLogin = () => {
    fetch("https://memes-api.grye.org/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accept: "application/json",
      },
      body: new URLSearchParams({
        username: username,
        password: password,
      }).toString(),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.access_token) {
          AsyncStorage.setItem("token", data.access_token);
          setModalLoginVisible(false);
          alert("Login successful!");
        } else {
          console.log(data);
          alert("Login failed");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={memes}
        renderItem={({ item }) => (
          <MemeItem item={item} handleImagePress={handleImagePress} />
        )}
        keyExtractor={(item) => item.filename}
        onEndReached={loadMoreMemes}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" /> : null
        }
      />

      <ImageModal
        visible={modalImageVisible}
        imageUrl={selectedImage}
        onClose={() => setModalImageVisible(false)}
      />

      <LoginModal
        visible={modalLoginVisible}
        username={username}
        password={password}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onLogin={handleLogin}
        onClose={() => setModalLoginVisible(false)}
      />

      <Button title="Login" onPress={handleLoginPress} />
    </View>
  );
};

export default App;
