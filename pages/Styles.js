import { StyleSheet } from "react-native"

export default StyleSheet.create({

    title: {
        textAlign:"center",
        fontSize:30,
        fontWeight:"bold",
        color:'#efe0d5',
        backgroundColor: '#cb532b'
    },

    eventRow: {
        backgroundColor:'#ddd', 
        fontSize: 14, 
        borderColor:'black', 
        borderWidth:1, 
        paddingHorizontal: 10, 
        borderRadius: 5, 
        marginHorizontal: 5
    },

    topBarPadding: {
        paddingTop:20
    },

    dateText: {
        fontWeight: 'bold',
         fontSize:20, 
         marginHorizontal: 5
        },

    defaultButtonTextStyle: {
        fontSize:13,
        color: '#efe0d5',
        textAlign: 'center'
    },

    defaultButtonStyle: {
        height:30,
        width:40,
        backgroundColor: '#cb532b',
        borderRadius:5,
        justifyContent: 'center', 
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'black'
    }
});