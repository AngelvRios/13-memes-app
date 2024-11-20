import { StyleSheet } from "react-native";

const loginStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
  },
  buttonLogin: {
    width:"50px",
  },
  modalContent: {
    width: 150,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "right",
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

export default loginStyles;
