import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

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
    color: "#005824",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 20, // Adjust if you have a separate header later
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  courseCode: {
    fontSize: 14,
    color: "gray",
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
    // Removed padding, alignItems, justifyContent
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
    fontWeight: "600", // Slightly bolder
    color: "#333", // Darker text color
  },
  cardImage: {
    width: "75%",
    height: 95,
  },
});
