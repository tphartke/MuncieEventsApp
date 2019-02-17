import { StyleSheet } from "react-native"

export default StyleSheet.create({

    title: {
        textAlign:"center",
        fontSize:30,
        fontWeight:"bold",
        color:'#efe0d5',
        backgroundColor: '#cb532b',
    },

    content: {
        paddingTop: 5
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

    loadingViewPadding: {
        flex: 1, 
        padding: 20
    },

    topBarPadding: {
        paddingTop:20,
        flex: 1
    },
    
    topBarWrapper: {
        height: 65, 
        backgroundColor: '#aaa', 
        paddingTop: 10, 
        paddingHorizontal: 10, 
        flexDirection: 'row'
    },

    topBarContent: {
        height: 45, 
        flex: 1, 
        flexDirection: 'row', 
        paddingHorizontal: 5,
        paddingLeft: 5, 
        justifyContent: 'center',
        borderColor: 'black', 
        borderRadius: 10, 
        borderWidth: 1, 
        width: 320, 
        backgroundColor: '#fff', 
        alignItems: 'center'
    },

    searchBar: {
        flex:1, 
        width: 50
    },

    iosSearch: {
        fontSize: 24
    },

    dateText: {
        fontWeight: 'bold',
        fontSize:20,
        marginHorizontal: 5
    },
    
    header: {
        fontSize:22, 
        fontWeight:'bold',
        paddingTop: 15
    },

    defaultButtonTextStyle: {
        fontSize:13,
        color: '#efe0d5',
        textAlign: 'center'
    },

    textInput: {
        borderColor: 'black',
        borderWidth: 1, 
        width: 320, 
        backgroundColor: '#fff', 
        paddingTop: 35, 
        alignItems: 'center',
        justifyContent: 'center'
    },

    advancedSearchRow: {
        height: 100, 
        flexDirection: 'row', 
        paddingTop:20,  
        alignItems: 'center'
    },

    advancedSearchColumn: {
        flex:5
    },

    textBox: {
        height: 40,
        borderColor: 'gray', 
        borderWidth: 1
    },
        
    textArea: {
        height: 160, 
        borderColor: 'gray', 
        borderWidth: 1
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
    },

    longButtonStyle: {
        width:400, 
        height:50
    },

    longButtonTextStyle: {
        fontSize:18
    },
});