import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // Ensures footer stays at the bottom
    backgroundColor: "#F2FFED",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    position: "relative",
    zIndex: 5,
  },
  profileButton: {
    padding: 10,
  },
  contentScrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    minHeight: "100%",
  },
  sectionsContainer: {
    width: "100%",
    maxWidth: 1200, // Max width for large screens
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginTop: 25,
    marginBottom: 10,
  },
  emptyStateContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  // Footer styles
  footer: {
    width: "100%",
    height: 85,
    backgroundColor: Colors.white,
    position: "relative",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  footerButtonContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    height: "100%",
    alignItems: "stretch",
    justifyContent: "center",
    maxWidth: 600, // Limit width on larger screens
    alignSelf: "center",
  },
  footerButton: {
    width: "50%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555555",
  },
  // Edit button styles
  editButton: {
    position: "absolute",
    bottom: 35,
    left: "50%",
    marginLeft: -36,
    backgroundColor: Colors.primary,
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    zIndex: 10,
    borderColor: "white",
    borderWidth: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    height: "50%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "green",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Form styles
  formContainer: {
    marginTop: 10,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
    padding: 20,
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
});