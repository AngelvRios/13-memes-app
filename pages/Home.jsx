import { useState, useContext } from "react";
import { View, FlatList, ActivityIndicator, Button, Alert } from "react-native";
import MemeItem from "../components/MemeItem";
import ImageModal from "../components/ImageModal";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import UploadMemeModal from "../components/UploadMemeModal";
import { AuthContext } from "../context/AuthContext";
import useMemes from "../services/useMemes";
import useUploadMeme from "../services/useUploadMeme";

const Home = () => {
  const { memes, loading, loadMoreMemes } = useMemes();
  const { uploadMeme } = useUploadMeme(); // Get uploadMeme from hook
  const { loginUser, isAuthenticated } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordconfirm, setPasswordconfirm] = useState("");
  const [email, setEmail] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalImageVisible, setModalImageVisible] = useState(false);
  const [modalLoginVisible, setModalLoginVisible] = useState(false);
  const [modalRegisterVisible, setModalRegisterVisible] = useState(false);
  const [modalUploadVisible, setModalUploadVisible] = useState(false);


  const handleImagePress = (imgUrl) => {
    setSelectedImage(imgUrl);
    setModalImageVisible(true);
  };

  const handleOpenLoginPress = () => {
    setModalLoginVisible(true);
  };

  const handleOpenRegisterPress = () => {
    setModalRegisterVisible(true);
  };

  const handleOpenUploadPress = () => {
    setModalUploadVisible(true);
  };

  const handleUpload = async (image, title, description) => {
    try {
      await uploadMeme(image, title, description); // Call uploadMeme function
      Alert.alert("Success", "Meme uploaded successfully!");
      setModalUploadVisible(false);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to upload meme.");
    }
  };
  function confirmpassword(password, passwordconfirm){
    return passwordconfirm ? passwordconfirm : password
  };

  function register(username, password,email) {
    fetch('https://memes-api.grye.org/register', {
      method: 'POST',
      headers: {
        'accept': 'application/json'
      },
      body: new URLSearchParams({
        username: {username},
        password: {password},
        email: {email},
      })
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
        onLogin={() => {
          loginUser(username, password);
          setModalLoginVisible(false);
        }}
        onClose={() => setModalLoginVisible(false)}
      />

      <RegisterModal
        visible={modalRegisterVisible}
        username={username}
        password={password}
        passwordconfirm={passwordconfirm}
        email={email}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onPasswordConfirmChange={setPasswordconfirm}
        onEmailChange={setEmail}
        onRegister={()=>{
          registerUser(username, password, passwordconfirm, emailS);
          setModalRegisterVisible(false);
        }}
        onClose={() => setModalRegisterVisible(false)}
      />

      <UploadMemeModal
        visible={modalUploadVisible}
        onClose={() => setModalUploadVisible(false)}
        onUpload={handleUpload} // Pass handleUpload
      />

      {isAuthenticated ? (
        <>
          <Button title="Upload Meme" onPress={handleOpenUploadPress} />
        </>
      ) : (
        <div>
          <Button title="Login" onPress={handleOpenLoginPress} />
          <Button title="Register" onPress={handleOpenRegisterPress} />
        </div>
      )}
    </View>
  );
};

export default Home;
