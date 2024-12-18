import { StyleSheet } from "react-native";

const registerStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
  },
  modalContent: {
    width: 150,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "left",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  submitButton: {
    marginTop: 10,
  },
});

export default registerStyles;
