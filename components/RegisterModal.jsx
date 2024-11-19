import { Modal, View, Text, TextInput, Button } from "react-native";
import registerStyles from "../registerStyles";

const RegisterModal = ({
  visible,
  username,
  password,
  email,
  onUsernameChange,
  onPasswordChange,
  onEmailChange,
  onRegister,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={registerStyles.modalContainer}>
        <View style={registerStyles.modalContent}>
          <Text>Register</Text>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={onUsernameChange}
            style={registerStyles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={onPasswordChange}
            secureTextEntry
            style={registerStyles.input}
          />
          <TextInput
          placeholder="e-mail"
          value={email}
          onChangeText={onEmailChange}
          secureTextEntry
          style={registerStyles.input}
          />
          <Button title="Submit" onPress={onRegister} />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default RegisterModal;
