import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: { 
        height: '100%',
        display: 'flex',
        flex: 1, // ← fixed this line
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: "#F2FFED", 
        position: 'relative', // ← added to support absolute elements like your profile icon
    },
    
    content: {
        flex: 1,
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

    // Modal
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        width: '80%',
        borderRadius: 10,
        elevation: 10,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    modalButton: {
        backgroundColor: 'green',
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Floating Join Button
    floatingJoinButton: {
        position: 'absolute',
        bottom: 75,
        alignSelf: 'center',
        backgroundColor: '#005824',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        zIndex: 10,
    },
    fabText: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 32,
    },

    // Footer
    footer: {
        width: '100%',
        height: 60,
        backgroundColor: 'white',
        position: 'relative',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    footerButtonContainer: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    footerButton: {
        width: '50%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },

    // Cards
    cardImage: {
        width: '75%',
        height: 95,
    },

    // Legacy (can remove if not used)
    editButton: {
        position: 'absolute',
        bottom: 10,
        left: '50%', 
        marginLeft: -36,
        backgroundColor: "#005824",
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: "center",
        justifyContent: "center",
        elevation: 8,
        zIndex: 10,
        borderColor: 'white',
        borderWidth: 4,
    },
});
