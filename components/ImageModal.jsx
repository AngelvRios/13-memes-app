import { Modal, View, Image, TouchableOpacity, Text } from "react-native";
import imageStyles from "./imageStyles";

const ImageModal = ({ visible, imageUrl, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={imageStyles.modalContainer}>
        <TouchableOpacity style={imageStyles.closeButton} onPress={onClose}>
          <Text style={imageStyles.closeButtonText}>Close</Text>
        </TouchableOpacity>
        <Image source={{ uri: imageUrl }} style={imageStyles.fullScreenImage} />
      </View>
    </Modal>
  );
};

export default ImageModal;
