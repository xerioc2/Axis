import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: "#F2FFED", 
      padding: 20, 
    },
    title: { 
      fontSize: 24, 
      fontWeight: "bold", 
      color: "#005824", 
      textAlign: "center", 
      marginBottom: 10, 
      marginTop: 20,
    },

    //card stuff
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

    //edit button stuff
    editButton: {
      position: "absolute",
      bottom: 20,
      backgroundColor: "#005824",
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems: "center",
      justifyContent: "center",
      elevation: 6,
      borderColor: 'white',
      borderWidth: 6,
      borderEndColor: 'white',
    },   
    modalOverlay: { 
      flex: 1, 
      justifyContent: "flex-end", 
      backgroundColor: "rgba(0,0,0,0.5)" 
    },
    modalContainer: {
      backgroundColor: "white",
      height: "50%",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
    },
    modalButton: { 
      backgroundColor: "green", 
      padding: 15, 
      marginVertical: 5, 
      borderRadius: 10, 
      textAlign: "center",
    },
    modalButtonText: { 
      color: "white", 
      textAlign: "center", 
      fontSize: 16, 
      fontWeight: "bold", 
    },
    formContainer: { 
      marginTop: 10 
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

    //image stuff
    imagePickerButton: {
      backgroundColor: "#007bff", 
      padding: 15,            
      borderRadius: 8,      
      alignItems: "center",   
      marginVertical: 10,      
    },
    imagePickerButtonText: {
      color: "#fff",         
      fontSize: 16,            
      fontWeight: "bold",       
    },

    //footer
    footer: {
      position: 'relative',
      bottom: 0,
      width: '115%',
      height: '7%',
      backgroundColor: 'white',
      paddingVertical: 35,
      alignItems: 'center',
      justifyContent: 'center',
      //borderTopWidth: 1,
      //borderTopColor: 'white',
    },
});

