import { StyleSheet } from "react-native";
import { Colors } from "../../theme";
import { useFonts } from "expo-font";

export const styles = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // Ensures footer stays at the bottom
    backgroundColor: "#F2FFED",
    // Removed padding: 20 here, apply padding to content/header if needed separately
  },
  content: {
    flex: 1, // Takes up remaining space
    padding: 20, // Added padding here instead of container
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 10,
    marginTop: 50, // Adjust if you have a separate header later
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 10,
    marginVertical: 18,
    elevation: 3,
    width: 299,
    height: 152,
    alignSelf: "center",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 2,
    shadowRadius: 5.3,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  courseTitle: {
    alignSelf: "center",
    fontSize: 13,
    fontWeight: 700,
    top: 2,
  },
  courseCode: {
    alignSelf: "center",
    fontSize: 14,
    top: 4,
    fontWeight: 600,
    right: 67,
  },
  cardContent: {
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    height: "50%", // Adjust as needed
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalButton: {
    backgroundColor: "green",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: "center", // Center text horizontally
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  formContainer: {
    marginTop: 10,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  //edit button stuff
  editButton: {
    position: "absolute",
    // Position it vertically relative to the footer
    bottom: 35, // Adjust as needed, relative to footer bottom
    // Center it horizontally
    left: "50%",
    marginLeft: -36, // Half of the button's width (72 / 2)
    // Styling
    backgroundColor: Colors.primary,
    width: 72,
    height: 72,
    borderRadius: 36, // Half of width/height for circle
    alignItems: "center",
    justifyContent: "center",
    elevation: 8, // Increased elevation to be clearly above footer buttons
    zIndex: 10, // Ensure it's above other footer elements
    borderColor: "white",
    borderWidth: 4, // Reduced border slightly
  },
  //footer
  footer: {
    width: "100%",
    height: 85, // Fixed height for the footer bar, adjust as needed
    backgroundColor: Colors.white,
    position: "relative", // Needed for absolute positioning of editButton relative to footer
    borderTopWidth: 1, // Optional: Add a subtle top border
    borderTopColor: "#ddd", // Optional: Border color
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: -2 }, // upward direction
    shadowOpacity: 1, // since rgba is already semi-transparent
    shadowRadius: 4,
  },
  footerButtonContainer: {
    flex: 1, // Take full available space within footer
    flexDirection: "row",
    width: "100%",
    height: "100%", // Fill the footer height
    alignItems: "stretch", // Stretch buttons vertically
    justifyContent: "center", // Center buttons horizontally
  },
  footerButton: {
    width: "50%", // Each button takes half the width
    height: "100%", // Each button takes full height of the container
    alignItems: "center", // Center content (text) horizontally
    justifyContent: "center", // Center content (text) vertically
    // Removed border and padding
  },
  footerButtonText: {
    fontSize: 16, // Adjusted font size
    fontWeight: "500", // Slightly bolder
    color: "#555555", // Darker text color
  },
  cardImage: {
    alignSelf: "center",
    width: 262,
    height: 93,
    top: 6,
    borderRadius: 15,
  },
});
