import { Modal, View, Text, TextInput, Button } from "react-native";
import loginStyles from "./loginStyles";

const LoginModal = ({
  visible,
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onLogin,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={loginStyles.modalContainer}>
        <View style={loginStyles.modalContent}>
          <Text>Login</Text>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={onUsernameChange}
            style={loginStyles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={onPasswordChange}
            secureTextEntry
            style={loginStyles.input}
          />
          <Button title="Submit" onPress={onLogin} />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default LoginModal;
