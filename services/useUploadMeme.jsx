import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

const useUploadMeme = () => {
  const uploadMeme = async (selectedImage, title, description) => {
    if (!selectedImage) {
      throw new Error("No image selected!");
    }

    try {
      const accessToken = await AsyncStorage.getItem("credentials").then(
        (data) => JSON.parse(data)?.access_token,
      );

      if (!accessToken) {
        throw new Error("You must be logged in to upload a meme!");
      }

      const url = `https://memes-api.grye.org/memes/?title=${encodeURIComponent(
        title,
      )}&description=${encodeURIComponent(description)}`;

      const formData = new FormData();

      if (Platform.OS === "web") {
        formData.append("file", selectedImage.file);
      } else {
        const fileUri = selectedImage.uri;
        const fileName = selectedImage.fileName || "upload.jpg";

        const tempFileUri = `${FileSystem.cacheDirectory}${fileName}`;
        await FileSystem.copyAsync({
          from: fileUri,
          to: tempFileUri,
        });

        formData.append("file", {
          uri: tempFileUri,
          name: fileName,
          type: selectedImage.mimeType || "image/jpeg",
        });
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload meme.");
      }

      return { success: true, message: "Meme uploaded successfully!" };
    } catch (error) {
      throw new Error(error.message || "An error occurred while uploading.");
    }
  };

  return { uploadMeme };
};

export default useUploadMeme;
