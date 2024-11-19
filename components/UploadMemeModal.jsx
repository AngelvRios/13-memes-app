import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const UploadMemeModal = ({ visible, onClose, onUpload }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImage = async () => {
    const storagePermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (storagePermission.status !== "granted") {
      Alert.alert(
        "Permission required",
        "Permission to access media library is required!",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedImage || !title || !description) {
      Alert.alert("Error", "Please complete all fields and select an image.");
      return;
    }
    onUpload(selectedImage, title, description);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text>Upload Meme</Text>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />
          <Button title="Select Image" onPress={pickImage} />
          {selectedImage && (
            <Text style={styles.imageName}>{selectedImage.fileName}</Text>
          )}
          <Button title="Upload" onPress={handleUpload} />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 8,
    marginVertical: 10,
    borderRadius: 5,
  },
  imageName: {
    marginVertical: 10,
    fontStyle: "italic",
  },
});

export default UploadMemeModal;
