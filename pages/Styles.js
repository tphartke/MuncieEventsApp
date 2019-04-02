import { StyleSheet, Dimensions} from "react-native"
const contentHeight = Dimensions.get('window').height*0.815
const advancedSearchHeight = Dimensions.get('window').height*0.08

export default StyleSheet.create({
    title: {
        textAlign:"center",
        fontSize:30,
        fontWeight:"bold",
        color:'#efe0d5',
        backgroundColor: '#cb532b',
    },

    content: {
        paddingTop: 5,
    },

    widgetContent: {
        padding: 10,
        fontSize: 16        
    },

    eventList: {
        flex: 1,
        flexBasis: contentHeight
    },

    expandedView: {
        flex: 1,
        flexBasis: contentHeight
    },

    advancedSearchResults: {
        flex: 1,
        flexBasis: advancedSearchHeight
    },
    
    eventRow: {
        backgroundColor:'#eee', 
        fontSize: 14, 
        borderColor:'black', 
        borderWidth:1, 
        paddingHorizontal: 10,
        borderRadius: 5, 
        marginHorizontal: 5,
        justifyContent: 'center', 
        alignItems: 'center',
        display: 'flex'
    },

    eventRowText: {
        fontSize: 14, 
        flex: 1,
        textAlign: 'center', 
        alignSelf: 'stretch'
    },

    eventRowImage: {
        width: 60, 
        height: 60
    },

    loadingViewPadding: {
        flex: 1, 
        padding: 20
    },

    backgroundImage:{
        height: '100%',
        width: '100%',
        opacity: 0.5
    },

    wrapper: {
        paddingTop:20,
        flex: 1,
        backgroundColor: 'white',
        flexBasis: '100%'

    },
    
    topBarWrapper: {
        height: 65, 
        backgroundColor: '#aaa', 
        paddingTop: 10, 
        paddingHorizontal: 10, 
        flexDirection: 'row',
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
        flexGrow: 1,
        height: 40,
        borderColor: 'gray', 
        borderWidth: 1,
    },
        
    textArea: {
        height: 160, 
        borderColor: 'gray', 
        borderWidth: 1
    },

    formRow:{
        //flexDirection: 'row',
        paddingBottom: 10
    },

    formLabel:{
        flex: 0, 
        fontWeight: 'bold', 
        fontSize: 25
    },

    formEntry:{
        flex: 1,
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

    mediumButtonStyle: {
        width:100
    },

    mediumButtonTextStyle:{
        fontSize: 15
    }
});